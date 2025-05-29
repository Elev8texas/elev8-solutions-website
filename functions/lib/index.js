"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCommercialInquiryCreated = exports.sendBundleNotification = exports.sendQuoteNotification = exports.sendContactNotification = exports.sendClientProfileNotification = exports.sendAppointmentNotification = exports.sendEmailNotification = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
const params_1 = require("firebase-functions/params");
// Define configuration parameters
const gmailEmail = (0, params_1.defineString)('GMAIL_EMAIL');
const gmailPassword = (0, params_1.defineString)('GMAIL_PASSWORD');
const firebaseServiceAccountKey = (0, params_1.defineString)('FIREBASE_SERVICE_ACCOUNT_KEY', { default: '' });
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
    }
    else {
        // Use default service account (recommended for Firebase Functions)
        admin.initializeApp();
    }
}
// Email notification functions
exports.sendEmailNotification = (0, firestore_1.onDocumentCreated)('emails/{docId}', async (event) => {
    var _a, _b, _c;
    const data = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    if (!data)
        return;
    const transporter = getTransporter();
    const mailOptions = {
        from: gmailEmail.value(),
        to: businessEmail,
        subject: 'New Email Subscription - Elev8 Solutions',
        html: `
        <h2>New Email Subscription</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Source:</strong> ${data.source || 'Website'}</p>
        <p><strong>Timestamp:</strong> ${((_c = (_b = data.timestamp) === null || _b === void 0 ? void 0 : _b.toDate) === null || _c === void 0 ? void 0 : _c.call(_b)) || new Date()}</p>
      `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
    }
    catch (error) {
        console.error('Error sending email notification:', error);
    }
});
// Function to send email notification when new appointment is created
exports.sendAppointmentNotification = (0, firestore_1.onDocumentCreated)('appointments/{appointmentId}', async (event) => {
    var _a;
    const appointmentData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    const appointmentId = event.params.appointmentId;
    if (!appointmentData)
        return;
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
    }
    catch (error) {
        console.error('Error sending appointment notification:', error);
    }
});
// Function to send email notification when new client profile is created
exports.sendClientProfileNotification = (0, firestore_1.onDocumentCreated)('client-profiles/{profileId}', async (event) => {
    var _a;
    const profileData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    const profileId = event.params.profileId;
    if (!profileData)
        return;
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
    }
    catch (error) {
        console.error('Error sending client profile notification:', error);
    }
});
// Function to send email notification when new contact is created
exports.sendContactNotification = (0, firestore_1.onDocumentCreated)('contacts/{contactId}', async (event) => {
    var _a, _b;
    const contactData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    const contactId = event.params.contactId;
    if (!contactData)
        return;
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
        await ((_b = event.data) === null || _b === void 0 ? void 0 : _b.ref.update({
            emailsSent: true,
            emailsSentAt: admin.firestore.FieldValue.serverTimestamp()
        }));
    }
    catch (error) {
        console.error('Error sending contact notification:', error);
    }
});
// Function to send email notification when new quote is created
exports.sendQuoteNotification = (0, firestore_1.onDocumentCreated)('quotes/{quoteId}', async (event) => {
    var _a;
    const quoteData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    const quoteId = event.params.quoteId;
    if (!quoteData)
        return;
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
    }
    catch (error) {
        console.error('Error sending quote notification:', error);
    }
});
// Function to send email notification for bundle selections
exports.sendBundleNotification = (0, firestore_1.onDocumentCreated)('bundle-selections/{bundleId}', async (event) => {
    var _a;
    const bundleData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    const bundleId = event.params.bundleId;
    if (!bundleData)
        return;
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
    }
    catch (error) {
        console.error('Error sending bundle notification:', error);
    }
});
// Email notification for commercial inquiries
exports.onCommercialInquiryCreated = (0, firestore_1.onDocumentCreated)('commercial-inquiries/{docId}', async (event) => {
    var _a, _b;
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
          <p><strong>Submitted:</strong> ${((_b = (_a = data.timestamp) === null || _a === void 0 ? void 0 : _a.toDate()) === null || _b === void 0 ? void 0 : _b.toLocaleString()) || 'Unknown'}</p>
          <p><strong>Source:</strong> Commercial Form</p>
          
          <hr>
          <p><em>This inquiry was automatically generated from the Elev8 website commercial form.</em></p>
        `,
        };
        await transporter.sendMail(businessMailOptions);
        console.log(`Commercial inquiry notification sent for ${docId}`);
    }
    catch (error) {
        console.error('Error sending commercial inquiry notification:', error);
    }
});
//# sourceMappingURL=index.js.map