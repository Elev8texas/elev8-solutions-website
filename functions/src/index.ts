import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated as onFirestoreDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { defineString } from 'firebase-functions/params';

// Initialize Firebase Admin
admin.initializeApp();

// Define configuration parameters
const gmailEmail = defineString('GMAIL_EMAIL');
const gmailPassword = defineString('GMAIL_PASSWORD');
const googleApiKey = defineString('GOOGLE_API_KEY');
const calendarId = defineString('GOOGLE_CALENDAR_ID', { default: 'primary' });
const serviceAccountKey = defineString('GOOGLE_SERVICE_ACCOUNT_KEY');

const businessEmail = 'contact@elev8texas.com';

// Create reusable transporter object using Gmail
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail.value(),
      pass: gmailPassword.value(),
    },
  });
};

// Initialize Google Calendar API
const getCalendarAuth = () => {
  if (serviceAccountKey.value()) {
    // Use service account for server-side authentication
    const credentials = JSON.parse(serviceAccountKey.value());
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });
    return auth;
  } else if (googleApiKey.value()) {
    // Fallback to API key (limited functionality)
    google.options({ auth: googleApiKey.value() });
    return googleApiKey.value();
  }
  throw new Error('Google Calendar authentication not configured');
};

// Create calendar event
export const createCalendarEvent = onCall(async (request) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      service,
      startTime,
      endTime,
      address
    } = request.data;

    // Validate required fields
    if (!customerName || !customerEmail || !service || !startTime || !endTime) {
      throw new HttpsError('invalid-argument', 'Missing required fields');
    }

    const auth = getCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: `${service} - ${customerName}`,
      description: `
Service: ${service}
Customer: ${customerName}
Phone: ${customerPhone || 'Not provided'}
Email: ${customerEmail}
${address ? `Address: ${address}` : ''}

This appointment was automatically scheduled through the Elev8 Solutions website.
      `.trim(),
      start: {
        dateTime: startTime,
        timeZone: 'America/Chicago', // Central Time for Texas
      },
      end: {
        dateTime: endTime,
        timeZone: 'America/Chicago',
      },
      attendees: [
        {
          email: customerEmail,
          displayName: customerName,
        },
        {
          email: businessEmail,
          displayName: 'Elev8 Solutions',
        }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'email', minutes: 60 },     // 1 hour before
        ],
      },
      location: address || '',
    };

    const response = await calendar.events.insert({
      calendarId: calendarId.value(),
      requestBody: event,
      sendUpdates: 'all', // Send invitations to all attendees
    });

    // Save appointment to Firestore
    const appointmentData = {
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      service,
      startTime: admin.firestore.Timestamp.fromDate(new Date(startTime)),
      endTime: admin.firestore.Timestamp.fromDate(new Date(endTime)),
      address: address || '',
      calendarEventId: response.data?.id || '',
      status: 'scheduled',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const appointmentRef = await admin.firestore()
      .collection('appointments')
      .add(appointmentData);

    console.log(`Calendar event created: ${response.data?.id}`);
    console.log(`Appointment saved: ${appointmentRef.id}`);

    return {
      success: true,
      eventId: response.data?.id || '',
      appointmentId: appointmentRef.id,
      eventLink: response.data?.htmlLink || '',
    };

  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new HttpsError('internal', 'Failed to create calendar event');
  }
});

// Get available time slots
export const getAvailableTimeSlots = onCall(async (request) => {
  try {
    const { date } = request.data;

    if (!date) {
      throw new HttpsError('invalid-argument', 'Date is required');
    }

    const auth = getCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const startOfDay = new Date(date);
    startOfDay.setHours(7, 0, 0, 0); // 7 AM start

    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0); // 6 PM end

    // Adjust for Saturday hours (8 AM - 4 PM)
    if (startOfDay.getDay() === 6) {
      startOfDay.setHours(8, 0, 0, 0);
      endOfDay.setHours(16, 0, 0, 0);
    }

    // No regular hours on Sunday
    if (startOfDay.getDay() === 0) {
      return { timeSlots: [] };
    }

    // Get existing events
    const response = await calendar.events.list({
      calendarId: calendarId.value(),
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const existingEvents = response.data?.items || [];

    // Generate time slots (1-hour intervals)
    const timeSlots = [];
    const current = new Date(startOfDay);

    while (current < endOfDay) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + 60 * 60 * 1000); // 1 hour later

      // Check if this slot conflicts with existing events
      const isAvailable = !existingEvents.some((event: any) => {
        if (!event.start?.dateTime || !event.end?.dateTime) return false;

        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);

        return (slotStart < eventEnd && slotEnd > eventStart);
      });

      timeSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: isAvailable
      });

      current.setHours(current.getHours() + 1);
    }

    return { timeSlots };

  } catch (error) {
    console.error('Error fetching available time slots:', error);
    throw new HttpsError('internal', 'Failed to fetch available time slots');
  }
});

// Update appointment status
export const updateAppointmentStatus = onCall(async (request) => {
  try {
    const { appointmentId, status, calendarEventId } = request.data;

    if (!appointmentId || !status) {
      throw new HttpsError('invalid-argument', 'Missing required fields');
    }

    // Update Firestore appointment
    await admin.firestore()
      .collection('appointments')
      .doc(appointmentId)
      .update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    // If cancelling, also delete the calendar event
    if (status === 'cancelled' && calendarEventId) {
      try {
        const auth = getCalendarAuth();
        const calendar = google.calendar({ version: 'v3', auth });
        
        await calendar.events.delete({
          calendarId: calendarId.value(),
          eventId: calendarEventId,
          sendUpdates: 'all', // Notify attendees
        });
        
        console.log(`Calendar event deleted: ${calendarEventId}`);
      } catch (calendarError) {
        console.error('Error deleting calendar event:', calendarError);
        // Don't fail the whole operation if calendar deletion fails
      }
    }

    return { success: true };

  } catch (error) {
    console.error('Error updating appointment:', error);
    throw new HttpsError('internal', 'Failed to update appointment');
  }
});

// Function to send email notification when new email is collected
export const sendEmailNotification = onFirestoreDocumentCreated(
  'Emails/{emailId}',
  async (event) => {
    const emailData = event.data?.data();
    const emailId = event.params.emailId;

    if (!emailData) return;

    try {
      const transporter = getTransporter();
      
      // Email to business
      const businessMailOptions = {
        from: gmailEmail.value(),
        to: businessEmail,
        subject: `New Email Subscription - ${emailData.source}`,
        html: `
          <h2>New Email Subscription</h2>
          <p><strong>Email ID:</strong> ${emailId}</p>
          <p><strong>Email:</strong> ${emailData.email}</p>
          <p><strong>Source:</strong> ${emailData.source}</p>
          <p><strong>Status:</strong> ${emailData.status}</p>
          <p><strong>Submitted:</strong> ${emailData.timestamp.toDate()}</p>
          
          <hr>
          <p><em>This is an automated notification from your Elev8 website.</em></p>
        `,
      };

      await transporter.sendMail(businessMailOptions);
      console.log(`Email notification sent for ${emailId}`);

    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }
);

// Function to send email notification when new appointment is created
export const sendAppointmentNotification = onFirestoreDocumentCreated(
  'appointments/{appointmentId}',
  async (event) => {
    const appointmentData = event.data?.data();
    const appointmentId = event.params.appointmentId;

    if (!appointmentData) return;

    try {
      const transporter = getTransporter();
      
      // Email to business
      const businessMailOptions = {
        from: gmailEmail.value(),
        to: businessEmail,
        subject: `New Appointment Scheduled - ${appointmentData.customerName}`,
        html: `
          <h2>New Appointment Scheduled</h2>
          <p><strong>Appointment ID:</strong> ${appointmentId}</p>
          <p><strong>Customer:</strong> ${appointmentData.customerName}</p>
          <p><strong>Email:</strong> ${appointmentData.customerEmail}</p>
          <p><strong>Phone:</strong> ${appointmentData.customerPhone || 'Not provided'}</p>
          <p><strong>Service:</strong> ${appointmentData.service}</p>
          <p><strong>Date & Time:</strong> ${appointmentData.startTime.toDate().toLocaleString()}</p>
          <p><strong>Address:</strong> ${appointmentData.address || 'Not provided'}</p>
          <p><strong>Calendar Event ID:</strong> ${appointmentData.calendarEventId}</p>
          
          <hr>
          <p><em>This appointment was automatically scheduled through your Elev8 website.</em></p>
        `,
      };

      await transporter.sendMail(businessMailOptions);
      console.log(`Appointment notification sent for ${appointmentId}`);

    } catch (error) {
      console.error('Error sending appointment notification:', error);
    }
  }
);

// Function to send email notification when new client profile is created
export const sendClientProfileNotification = onFirestoreDocumentCreated(
  'client-profiles/{profileId}',
  async (event) => {
    const profileData = event.data?.data();
    const profileId = event.params.profileId;

    if (!profileData) return;

    try {
      const transporter = getTransporter();
      
      // Email to business
      const businessMailOptions = {
        from: gmailEmail.value(),
        to: businessEmail,
        subject: `New Client Profile - ${profileData.name}`,
        html: `
          <h2>New Client Profile Created</h2>
          <p><strong>Profile ID:</strong> ${profileId}</p>
          <p><strong>Name:</strong> ${profileData.name}</p>
          <p><strong>Email:</strong> ${profileData.email}</p>
          <p><strong>Phone:</strong> ${profileData.phone || 'Not provided'}</p>
          <p><strong>Address:</strong> ${profileData.address || 'Not provided'}</p>
          <p><strong>Service Inquired:</strong> ${profileData.serviceInquired}</p>
          <p><strong>Source:</strong> ${profileData.source}</p>
          <p><strong>Status:</strong> ${profileData.status}</p>
          <p><strong>Submitted:</strong> ${profileData.timestamp.toDate()}</p>
          
          ${profileData.additionalInfo ? `
          <h3>Additional Information:</h3>
          <pre>${JSON.stringify(profileData.additionalInfo, null, 2)}</pre>
          ` : ''}
          
          <hr>
          <p><em>This is an automated notification from your Elev8 website.</em></p>
        `,
      };

      await transporter.sendMail(businessMailOptions);
      console.log(`Client profile notification sent for ${profileId}`);

    } catch (error) {
      console.error('Error sending client profile notification:', error);
    }
  }
);

// Function to send email notification when new contact is created
export const sendContactNotification = onFirestoreDocumentCreated(
  'contacts/{contactId}',
  async (event) => {
    const contactData = event.data?.data();
    const contactId = event.params.contactId;

    if (!contactData) return;

    try {
      const transporter = getTransporter();
      
      // Email to business
      const businessMailOptions = {
        from: gmailEmail.value(),
        to: businessEmail,
        subject: `New Contact Form Submission - ${contactData.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Contact ID:</strong> ${contactId}</p>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
          <p><strong>Service:</strong> ${contactData.service}</p>
          <p><strong>Urgency:</strong> ${contactData.urgency || 'Normal'}</p>
          <p><strong>Source:</strong> ${contactData.source}</p>
          <p><strong>Message:</strong></p>
          <p>${contactData.message}</p>
          <p><strong>Submitted:</strong> ${contactData.timestamp.toDate()}</p>
          
          <hr>
          <p><em>This is an automated notification from your Elev8 website.</em></p>
        `,
      };

      // Email confirmation to customer
      const customerMailOptions = {
        from: gmailEmail.value(),
        to: contactData.email,
        subject: 'Thank you for contacting Elev8 Solutions',
        html: `
          <h2>Thank you for contacting Elev8 Solutions!</h2>
          <p>Hi ${contactData.name},</p>
          <p>We've received your message and will get back to you within 24 hours with a personalized quote.</p>
          
          <h3>Your Request Details:</h3>
          <p><strong>Service:</strong> ${contactData.service}</p>
          <p><strong>Message:</strong> ${contactData.message}</p>
          
          <h3>What's Next?</h3>
          <ul>
            <li>We'll review your request and prepare a customized quote</li>
            <li>One of our team members will contact you within 24 hours</li>
            <li>We'll schedule a convenient time for your service</li>
          </ul>
          
          <p><strong>Need immediate assistance?</strong> Call us at <a href="tel:+15127018085">(512) 701-8085</a></p>
          
          <p>Best regards,<br>The Elev8 Solutions Team</p>
          
          <hr>
          <p><em>Elev8 Solutions - Professional Cleaning Services</em><br>
          <em>Austin, Texas & Surrounding Areas</em></p>
        `,
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(businessMailOptions),
        transporter.sendMail(customerMailOptions)
      ]);

      console.log(`Email notifications sent for contact ${contactId}`);
      
      // Update the contact document to mark emails as sent
      await event.data?.ref.update({
        emailsSent: true,
        emailsSentAt: admin.firestore.FieldValue.serverTimestamp()
      });

    } catch (error) {
      console.error('Error sending contact notification:', error);
    }
  }
);

// Function to send email notification when new quote is created
export const sendQuoteNotification = onFirestoreDocumentCreated(
  'quotes/{quoteId}',
  async (event) => {
    const quoteData = event.data?.data();
    const quoteId = event.params.quoteId;

    if (!quoteData) return;

    try {
      const transporter = getTransporter();
      
      // Email to business
      const businessMailOptions = {
        from: gmailEmail.value(),
        to: businessEmail,
        subject: `New Quote Request - ${quoteData.name}`,
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Quote ID:</strong> ${quoteId}</p>
          <p><strong>Name:</strong> ${quoteData.name}</p>
          <p><strong>Email:</strong> ${quoteData.email}</p>
          <p><strong>Phone:</strong> ${quoteData.phone || 'Not provided'}</p>
          <p><strong>Address:</strong> ${quoteData.address}</p>
          <p><strong>Property Type:</strong> ${quoteData.propertyType}</p>
          <p><strong>Square Footage:</strong> ${quoteData.squareFootage || 'Not provided'}</p>
          <p><strong>Window Count:</strong> ${quoteData.windowCount || 'Not provided'}</p>
          <p><strong>Services:</strong> ${quoteData.services.join(', ')}</p>
          <p><strong>Additional Details:</strong></p>
          <p>${quoteData.additionalDetails || 'None provided'}</p>
          <p><strong>Submitted:</strong> ${quoteData.timestamp.toDate()}</p>
          
          <hr>
          <p><em>This is an automated notification from your Elev8 website.</em></p>
        `,
      };

      await transporter.sendMail(businessMailOptions);
      console.log(`Quote notification sent for ${quoteId}`);

    } catch (error) {
      console.error('Error sending quote notification:', error);
    }
  }
);

// Function to send email notification for bundle selections
export const sendBundleNotification = onFirestoreDocumentCreated(
  'bundle-selections/{bundleId}',
  async (event) => {
    const bundleData = event.data?.data();
    const bundleId = event.params.bundleId;

    if (!bundleData) return;

    try {
      const transporter = getTransporter();
      
      const mailOptions = {
        from: gmailEmail.value(),
        to: businessEmail,
        subject: `New Bundle Selection - ${bundleData.bundleName}`,
        html: `
          <h2>New Bundle Selection</h2>
          <p><strong>Bundle ID:</strong> ${bundleId}</p>
          <p><strong>Bundle:</strong> ${bundleData.bundleName}</p>
          <p><strong>Customer Info:</strong> ${JSON.stringify(bundleData.customerInfo, null, 2)}</p>
          <p><strong>Submitted:</strong> ${bundleData.timestamp.toDate()}</p>
          
          <hr>
          <p><em>This is an automated notification from your Elev8 website.</em></p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Bundle notification sent for ${bundleId}`);

    } catch (error) {
      console.error('Error sending bundle notification:', error);
    }
  }
); 