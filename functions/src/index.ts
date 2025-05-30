import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated as onFirestoreDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

const setCorsHeaders = (res: any) => { res.set('Access-Control-Allow-Origin', '*'); res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); };
// CORS configuration for callable functions
const corsOptions = {
  cors: true, // Allow all origins
};

// Get configuration values from environment variables
// These will be set by Firebase Functions config
const gmailEmail = process.env.GMAIL_EMAIL || 'tech@elev8texas.com';
const gmailPassword = process.env.GMAIL_PASSWORD;
const googleCalendarId = process.env.GOOGLE_CALENDAR_ID;
const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY;

const businessEmail = 'tech@elev8texas.com';

// Create reusable transporter object using Gmail
const getTransporter = () => {
  return nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: gmailEmail,
      pass: gmailPassword,
  },
});
};

// Get Google Calendar authentication
const getCalendarAuth = () => {
  const auth = new google.auth.JWT(
    googleClientEmail,
    undefined,
    googlePrivateKey?.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  );
  
  return auth;
};

// Initialize Firebase Admin (uses default service account in Firebase Functions environment)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Email notification functions
export const sendEmailNotification = onFirestoreDocumentCreated(
  'emails/{docId}',
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const transporter = getTransporter();

    const mailOptions = {
      from: gmailEmail,
      to: businessEmail,
      subject: 'New Email Subscription - Elev8 Solutions',
      html: `
        <h2>New Email Subscription</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Source:</strong> ${data.source || 'Website'}</p>
        <p><strong>Timestamp:</strong> ${data.timestamp?.toDate?.() || new Date()}</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully');
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
        from: gmailEmail,
        to: businessEmail,
        subject: `New Appointment Scheduled - ${Array.isArray(appointmentData.services) ? appointmentData.services.join(', ') : appointmentData.services || appointmentData.service}`,
        html: `
          <h2>New Appointment Scheduled</h2>
          <p><strong>Appointment ID:</strong> ${appointmentId}</p>
          <p><strong>Customer:</strong> ${appointmentData.customerName}</p>
          <p><strong>Email:</strong> ${appointmentData.customerEmail}</p>
          <p><strong>Phone:</strong> ${appointmentData.customerPhone}</p>
          <p><strong>Service(s):</strong> ${Array.isArray(appointmentData.services) ? appointmentData.services.join(', ') : appointmentData.services || appointmentData.service}</p>
          <p><strong>Start Time:</strong> ${appointmentData.startTime.toDate()}</p>
          <p><strong>End Time:</strong> ${appointmentData.endTime.toDate()}</p>
          <p><strong>Address:</strong> ${appointmentData.address}</p>
          <p><strong>Status:</strong> ${appointmentData.status}</p>
          ${appointmentData.notes ? `<p><strong>Notes:</strong> ${appointmentData.notes}</p>` : ''}
          
          <hr>
          <p><em>This is an automated notification from your Elev8 website.</em></p>
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
        from: gmailEmail,
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
        from: gmailEmail,
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
        from: gmailEmail,
        to: contactData.email,
        subject: 'We received your message - Elev8 Solutions',
        html: `
          <h2>Thank you for reaching out to Elev8 Solutions!</h2>
          <p>Hi ${contactData.name},</p>
          <p>We've received your message and one of our team members will get back to you within 2 hours during business hours.</p>
          
          <h3>Your Message Details:</h3>
          <p><strong>Service Interest:</strong> ${contactData.service}</p>
          ${contactData.urgency ? `<p><strong>Urgency:</strong> ${contactData.urgency}</p>` : ''}
          <p><strong>Your Message:</strong></p>
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; font-style: italic;">${contactData.message}</p>
          
          <h3>What Happens Next?</h3>
          <ul>
            <li>A team member will review your specific request</li>
            <li>We'll contact you within 2 hours during business hours (7 AM - 6 PM, Mon-Fri)</li>
            <li>We'll provide immediate assistance or schedule a consultation</li>
            ${contactData.urgency === 'emergency' ? '<li><strong>Emergency requests are handled immediately</strong></li>' : ''}
          </ul>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c9a96e;">
            <h4 style="color: #c9a96e; margin-top: 0;">💬 Your Contact Request</h4>
            <p><strong>Request ID:</strong> ${contactId}</p>
            <p><strong>Submitted:</strong> ${contactData.timestamp.toDate().toLocaleDateString()}</p>
            <p><em>Reference this ID if you need to follow up</em></p>
          </div>
          
          <p><strong>Need immediate assistance?</strong> Call us at <a href="tel:+15127018085">(512) 701-8085</a></p>
          
          <p>Best regards,<br>The Elev8 Solutions Team</p>
          
          <hr>
          <p><em>Elev8 Solutions - Professional Exterior Cleaning Services</em><br>
          <em>Austin, Texas & Surrounding Areas</em><br>
          <em>Quick Response Team Available</em></p>
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
        from: gmailEmail,
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

      // Email confirmation to customer for quote request
      const customerMailOptions = {
        from: gmailEmail,
        to: quoteData.email,
        subject: 'Your Quote Request Has Been Received - Elev8 Solutions',
        html: `
          <h2>Thank you for your quote request!</h2>
          <p>Hi ${quoteData.name},</p>
          <p>We've received your detailed quote request and our team is preparing a customized estimate for your property.</p>
          
          <h3>Your Quote Request Summary:</h3>
          <p><strong>Property Address:</strong> ${quoteData.address}</p>
          <p><strong>Property Type:</strong> ${quoteData.propertyType}</p>
          <p><strong>Services Requested:</strong> ${quoteData.services.join(', ')}</p>
          ${quoteData.squareFootage ? `<p><strong>Square Footage:</strong> ${quoteData.squareFootage}</p>` : ''}
          ${quoteData.windowCount ? `<p><strong>Number of Windows:</strong> ${quoteData.windowCount}</p>` : ''}
          
          <h3>What Happens Next?</h3>
          <ul>
            <li>Our team will review your property details and service requirements</li>
            <li>We'll prepare a detailed, itemized quote tailored to your specific needs</li>
            <li>You'll receive your personalized quote within 24 hours</li>
            <li>We'll contact you to schedule a convenient service time</li>
          </ul>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #c9a96e; margin-top: 0;">📋 Quote Request Details</h4>
            <p><strong>Quote ID:</strong> ${quoteId}</p>
            <p><strong>Submitted:</strong> ${quoteData.timestamp.toDate().toLocaleDateString()}</p>
            <p><em>Save this information for your records</em></p>
          </div>
          
          <p><strong>Questions or need to make changes?</strong> Reply to this email or call us at <a href="tel:+15127018085">(512) 701-8085</a></p>
          
          <p>Best regards,<br>The Elev8 Solutions Team</p>
          
          <hr>
          <p><em>Elev8 Solutions - Professional Exterior Cleaning Services</em><br>
          <em>Austin, Texas & Surrounding Areas</em><br>
          <em>Licensed, Insured & Locally Owned</em></p>
        `,
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(businessMailOptions),
        transporter.sendMail(customerMailOptions)
      ]);

      console.log(`Quote notification emails sent for ${quoteId}`);

      // Update the quote document to mark emails as sent
      await event.data?.ref.update({
        emailsSent: true,
        emailsSentAt: admin.firestore.FieldValue.serverTimestamp()
      });

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
        from: gmailEmail,
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

// Email notification for commercial inquiries
export const onCommercialInquiryCreated = onFirestoreDocumentCreated(
  'commercial-inquiries/{docId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const data = snapshot.data();
    const docId = event.params.docId;

    try {
      const transporter = getTransporter();
      
      // Email to business
      const businessMailOptions = {
        from: gmailEmail,
        to: businessEmail,
        subject: `New Commercial Inquiry - ${data.businessName}`,
        html: `
          <h2>New Commercial Inquiry Received</h2>
          <p><strong>Inquiry ID:</strong> ${docId}</p>
          <p><strong>Business Name:</strong> ${data.businessName}</p>
          <p><strong>Contact Person:</strong> ${data.contactName}</p>
          <p><strong>Phone Number:</strong> ${data.phoneNumber}</p>
          <p><strong>Business Address:</strong> ${data.businessAddress}</p>
          <p><strong>Submitted:</strong> ${data.timestamp?.toDate()?.toLocaleString() || 'Unknown'}</p>
          <p><strong>Source:</strong> Commercial Form</p>
          
          <hr>
          <p><em>This inquiry was automatically generated from the Elev8 website commercial form.</em></p>
        `,
      };

      await transporter.sendMail(businessMailOptions);
      console.log(`Commercial inquiry notification sent for ${docId}`);
    } catch (error) {
      console.error('Error sending commercial inquiry notification:', error);
    }
  }
);

// Calendar Functions for appointment booking

// Get available time slots
export const getAvailableTimeSlots = onRequest(async (req, res) => {
  try {
    setCorsHeaders(res); 
    if (req.method === 'OPTIONS') {
      res.status(204).send(''); 
      return;
    }
    
    const { date } = req.body;

    if (!date) {
      res.status(400).json({ error: 'Date is required' }); 
      return;
    }

    console.log('Received request for date:', date);

    const auth = getCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    // Parse the date correctly in Central Time (Texas timezone)
    // Input should be in format "YYYY-MM-DD"
    const selectedDate = new Date(date + 'T00:00:00.000-06:00'); // Force Central Time
    console.log('Parsed selectedDate:', selectedDate.toISOString());
    
    // Define business hours in Central Time
    const dayOfWeek = selectedDate.getDay();
    
    let startHour = 9; // 9 AM Central
    let endHour = 17;   // 5 PM Central
    
    if (dayOfWeek === 0) { // Sunday - closed
      res.status(200).json({ timeSlots: [] });
      return;
    } else if (dayOfWeek === 6) { // Saturday
      startHour = 9;  // 9 AM Central
      endHour = 17;   // 5 PM Central
    }
    
    // Create proper Central Time dates
    // Central Time is UTC-6 (CST) or UTC-5 (CDT)
    // For May 2025, we're in CDT (UTC-5)
    const centralOffset = 5; // Hours to ADD to Central Time to get UTC
    
    const [year, month, day] = date.split('-').map(Number);
    
    // Create the times: Central Time + offset = UTC Time
    // 9 AM Central + 5 hours = 14:00 UTC (2 PM UTC)
    const startOfDay = new Date(year, month - 1, day, startHour + centralOffset, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, endHour + centralOffset, 0, 0, 0);
    
    console.log('Business hours (Central Time converted to UTC):', {
      start: startOfDay.toISOString(),
      end: endOfDay.toISOString(),
      dayOfWeek: dayOfWeek,
      centralTimeStart: `${startHour}:00 Central`,
      centralTimeEnd: `${endHour}:00 Central`
    });

    // Get existing events for the day
    const existingEvents = await calendar.events.list({
      calendarId: googleCalendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log(`Found ${existingEvents.data.items?.length || 0} existing events`);

    // Generate available time slots (2-hour blocks)
    const timeSlots: any[] = [];
    const current = new Date(startOfDay);
    
    while (current < endOfDay) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + 2 * 60 * 60 * 1000); // 2 hour slots
      
      // Don't create slots that extend beyond business hours
      if (slotEnd <= endOfDay) {
        // Check if this slot conflicts with existing events
        const isAvailable = !existingEvents.data.items?.some(event => {
          if (!event.start?.dateTime || !event.end?.dateTime) return false;
          
          const eventStart = new Date(event.start.dateTime);
          const eventEnd = new Date(event.end.dateTime);
          
          // Check for overlap
          return (slotStart < eventEnd && slotEnd > eventStart);
        });

        // Return the times as ISO strings (the frontend will handle timezone display)
        const slot = {
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          available: isAvailable
        };
        
        console.log('Generated slot:', slot);
        timeSlots.push(slot);
      }
      
      current.setHours(current.getHours() + 2); // Increment by 2 hours
    }

    console.log('Generated', timeSlots.length, 'total time slots');
    console.log('Sample slot structure:', timeSlots[0]);
    res.status(200).json({ timeSlots });
    
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ 
      error: 'Failed to fetch available time slots',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create calendar event and appointment (HTTP version)
export const createCalendarEventHttp = onRequest(async (req, res) => {
  try {
    console.log('📅 Calendar event creation started');
    console.log('📋 Request method:', req.method);
    console.log('📋 Request headers:', JSON.stringify(req.headers, null, 2));
    
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
      console.log('✅ CORS preflight request handled');
      res.status(204).send('');
      return;
    }

    console.log('📦 Request body received:', JSON.stringify(req.body, null, 2));

    const {
      customerName,
      customerEmail,
      customerPhone,
      services,
      startTime,
      endTime,
      address,
      notes
    } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !services || !startTime || !endTime) {
      console.log('❌ Validation failed - missing required fields');
      console.log('❌ Missing fields:', {
        customerName: !customerName,
        customerEmail: !customerEmail,
        services: !services,
        startTime: !startTime,
        endTime: !endTime
      });
      res.status(400).json({ 
        error: 'Missing required fields',
        required: ['customerName', 'customerEmail', 'services', 'startTime', 'endTime'],
        received: Object.keys(req.body || {}),
        details: 'One or more required fields are missing from the request'
      });
      return;
    }

    console.log('✅ Validation passed - all required fields present');
    console.log('🔧 Creating calendar event...');

    // Validate environment variables
    if (!googleCalendarId || !googleClientEmail || !googlePrivateKey) {
      console.error('❌ Missing Google Calendar environment variables:', {
        googleCalendarId: !!googleCalendarId,
        googleClientEmail: !!googleClientEmail,
        googlePrivateKey: !!googlePrivateKey
      });
      res.status(500).json({
        error: 'Server configuration error',
        details: 'Google Calendar integration not properly configured',
        type: 'configuration_error'
      });
      return;
    }

    console.log('✅ Environment variables validated');

    const auth = getCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const serviceList = Array.isArray(services) ? services.join(', ') : services;

    const event = {
      summary: `${serviceList} - ${customerName}`,
      description: `
Service(s): ${serviceList}
Customer: ${customerName}
Phone: ${customerPhone || 'Not provided'}
Email: ${customerEmail}
${address ? `Address: ${address}` : ''}
${notes ? `Notes: ${notes}` : ''}

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
      calendarId: googleCalendarId,
      requestBody: event,
      sendUpdates: 'none', // Don't send invitations
    });

    const eventData = response.data;

    // Save appointment to Firestore
    const appointmentData = {
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      services: Array.isArray(services) ? services : [services],
      startTime: admin.firestore.Timestamp.fromDate(new Date(startTime)),
      endTime: admin.firestore.Timestamp.fromDate(new Date(endTime)),
      address: address || '',
      notes: notes || '',
      calendarEventId: eventData.id || '',
      status: 'scheduled',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const appointmentRef = await admin.firestore()
      .collection('appointments')
      .add(appointmentData);

    console.log(`Calendar event created: ${eventData.id}`);
    console.log(`Appointment saved: ${appointmentRef.id}`);

    res.status(200).json({
      success: true,
      eventId: eventData.id,
      appointmentId: appointmentRef.id
    });

  } catch (error) {
    console.error('❌ Error creating calendar event:', error);
    console.error('❌ Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      code: (error as any)?.code,
      stack: (error as any)?.stack
    });
    
    // Check if it's a Google Calendar API error
    if ((error as any)?.response?.status) {
      console.error('❌ Google Calendar API error:', {
        status: (error as any).response.status,
        statusText: (error as any).response.statusText,
        data: (error as any).response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create calendar event',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: 'calendar_creation_error'
    });
  }
});

// Update appointment status
export const updateAppointmentStatus = onCall(corsOptions, async (request) => {
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
          calendarId: googleCalendarId,
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

// Simple test function to verify CORS configuration
export const testCORS = onCall(corsOptions, async (request) => {
  console.log('CORS test function called');
  return { 
    success: true, 
    message: 'CORS is working!',
    timestamp: new Date().toISOString()
  };
}); 