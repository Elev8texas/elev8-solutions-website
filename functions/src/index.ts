import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated as onFirestoreDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { defineString } from 'firebase-functions/params';

// Define configuration parameters
const gmailEmail = defineString('GMAIL_EMAIL');
const gmailPassword = defineString('GMAIL_PASSWORD');
const firebaseServiceAccountKey = defineString('FIREBASE_SERVICE_ACCOUNT_KEY', { default: '' });

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

// Initialize Firebase Admin with service account (automatically uses service account in Firebase environment)
if (!admin.apps.length) {
  if (firebaseServiceAccountKey.value()) {
    // Use custom service account if provided
    const serviceAccount = JSON.parse(firebaseServiceAccountKey.value());
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://elev8-website-a155a-default-rtdb.firebaseio.com"
    });
  } else {
    // Use default service account (recommended for Firebase Functions)
    admin.initializeApp();
  }
}

// Email notification functions
export const sendEmailNotification = onFirestoreDocumentCreated(
  'emails/{docId}',
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const transporter = getTransporter();

    const mailOptions = {
      from: gmailEmail.value(),
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
        from: gmailEmail.value(),
        to: businessEmail,
        subject: `New Appointment Scheduled - ${appointmentData.service}`,
        html: `
          <h2>New Appointment Scheduled</h2>
          <p><strong>Appointment ID:</strong> ${appointmentId}</p>
          <p><strong>Customer:</strong> ${appointmentData.customerName}</p>
          <p><strong>Email:</strong> ${appointmentData.customerEmail}</p>
          <p><strong>Phone:</strong> ${appointmentData.customerPhone}</p>
          <p><strong>Service:</strong> ${appointmentData.service}</p>
          <p><strong>Start Time:</strong> ${appointmentData.startTime.toDate()}</p>
          <p><strong>End Time:</strong> ${appointmentData.endTime.toDate()}</p>
          <p><strong>Address:</strong> ${appointmentData.address}</p>
          <p><strong>Status:</strong> ${appointmentData.status}</p>
          
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
        from: gmailEmail.value(),
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