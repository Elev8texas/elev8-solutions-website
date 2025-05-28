import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Initialize Firebase Admin
admin.initializeApp();

// Email configuration
const gmailEmail = functions.config().gmail?.email;
const gmailPassword = functions.config().gmail?.password;
const businessEmail = 'contact@elev8texas.com';

// Create reusable transporter object using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Function to send email notification when new email is collected
export const sendEmailNotification = functions.firestore
  .document('Emails/{emailId}')
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const emailData = snap.data();
    const emailId = context.params.emailId;

    try {
      // Email to business
      const businessMailOptions = {
        from: gmailEmail,
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
  });

// Function to send email notification when new client profile is created
export const sendClientProfileNotification = functions.firestore
  .document('client-profiles/{profileId}')
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const profileData = snap.data();
    const profileId = context.params.profileId;

    try {
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
  });

// Function to send email notification when new contact is created
export const sendContactNotification = functions.firestore
  .document('contacts/{contactId}')
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const contactData = snap.data();
    const contactId = context.params.contactId;

    try {
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
      await snap.ref.update({
        emailsSent: true,
        emailsSentAt: admin.firestore.FieldValue.serverTimestamp()
      });

    } catch (error) {
      console.error('Error sending contact notification:', error);
    }
  });

// Function to send email notification when new quote is created
export const sendQuoteNotification = functions.firestore
  .document('quotes/{quoteId}')
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const quoteData = snap.data();
    const quoteId = context.params.quoteId;

    try {
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

      await transporter.sendMail(businessMailOptions);
      console.log(`Quote notification sent for ${quoteId}`);

    } catch (error) {
      console.error('Error sending quote notification:', error);
    }
  });

// Function to send email notification for bundle selections
export const sendBundleNotification = functions.firestore
  .document('bundle-selections/{bundleId}')
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const bundleData = snap.data();
    const bundleId = context.params.bundleId;

    try {
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
  }); 