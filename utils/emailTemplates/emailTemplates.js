import { formatTimeToAmPm } from '../../helper/formatTimeToAmPm.js';


// Header Template with Styled Title for Madni Cabs
const headerTemplate = `
  <div style="text-align: center; background-color: #000; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="color: #FFD700; margin: 0; font-size: 24px; font-weight: bold; font-family: 'Georgia', serif;">Madni Cabs</h2>
  </div>
`;

// Footer Template
const footerTemplate = `
  <p style="font-size: 14px; color: #666; margin-top: 20px; text-align: center;">
    Thank you for choosing Madni Cabs. We value your trust in our services. For assistance, please contact our support team.
  </p>
`;

// Booking Creation Content for User Email
const bookingCreationTemplateUser = (fullName, id, pickupLocation, dropLocation, pickupDate, pickupTime, cabName, rent, email, phoneNumber) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">Dear ${fullName},</p>
    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      We are thrilled to confirm your booking with Madni Cabs. Here are your booking details:
    </p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickupTime)}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
      <li><strong>Rent:</strong> ${rent} SAR</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone Number:</strong> ${phoneNumber}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      Thank you for choosing Madni Cabs. We look forward to serving you.
    </p>
  </div>
  ${footerTemplate}
`;


// Booking Creation Content for Admin Email
const bookingCreationTemplateAdmin = (id, fullName, pickupLocation, dropLocation, pickupDate, pickupTime, cabName, rent, email, phoneNumber) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">A new booking has been created with the following details:</p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Customer Name:</strong> ${fullName}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickupTime)}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
      <li><strong>Rent:</strong> ${rent} SAR</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone Number:</strong> ${phoneNumber}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      Please review and ensure all arrangements are in place to provide the customer with exceptional service.
    </p>
  </div>
`;



// Booking Update Content for User Email
const bookingUpdateTemplateUser = (fullName, id, pickupLocation, dropLocation, cabName, newDate, newTime, newPhone, email) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">Dear ${fullName},</p>
    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      Your booking details have been updated as requested. Here are the updated details:
    </p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
      <li><strong>New Pickup Date:</strong> ${newDate}</li>
      <li><strong>New Pickup Time:</strong> ${formatTimeToAmPm(newTime)}</li>
      <li><strong>New Phone Number:</strong> ${newPhone}</li>
      <li><strong>Email:</strong> ${email}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      Thank you for updating your booking with Madni Cabs. We look forward to serving you.
    </p>
  </div>
  ${footerTemplate}
`;



// Booking Update Content for Admin Email
const bookingUpdateTemplateAdmin = (id, fullName, pickupLocation, dropLocation, cabName, newDate, newTime, newPhone, email) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">The following booking has been updated with new details:</p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Customer Name:</strong> ${fullName}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
      <li><strong>New Pickup Date:</strong> ${newDate}</li>
      <li><strong>New Pickup Time:</strong> ${formatTimeToAmPm(newTime)}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>New Phone Number:</strong> ${newPhone}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      Please verify the updated details and ensure the continued satisfaction of the customer.
    </p>
  </div>
`;



// Booking Cancellation Template for User (User Initiated)
const userCancelledBookingUserEmail = (fullName, id, pickupLocation, dropLocation, pickupDate, pickupTime, cabName, rent, cancelReason) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">Dear ${fullName},</p>
    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      We have received your request to cancel your booking. Below are the details of your canceled booking:
    </p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickupTime)}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
      <li><strong>Rent:</strong> ${rent} SAR</li>
      <li><strong>Cancellation Reason:</strong> ${cancelReason}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      We are sorry to see you cancel your booking. Please contact us if you have any questions.
    </p>
  </div>
  ${footerTemplate}
`;



// Booking Cancellation Template for Admin (User Initiated)
const userCancelledBookingAdminEmail = (id, fullName, pickupLocation, dropLocation, pickupDate, pickupTime, cabName, rent, cancelReason) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">A booking has been canceled by the user with the following details:</p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Customer Name:</strong> ${fullName}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickupTime)}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
      <li><strong>Rent:</strong> ${rent} SAR</li>
      <li><strong>Cancellation Reason:</strong> ${cancelReason}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      Please review this cancellation and ensure all necessary actions are taken.
    </p>
  </div>
`;


// Booking Cancellation Template for User (Admin Initiated)
const adminCancelledBookingUserEmail = (fullName, id, pickupLocation, dropLocation, pickupDate, pickupTime, cabName, rent, cancelReason) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">Dear ${fullName},</p>
    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      We regret to inform you that your booking has been canceled by Madni Cabs. Below are the details of the canceled booking:
    </p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickupTime)}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
      <li><strong>Rent:</strong> ${rent} SAR</li>
      <li><strong>Cancellation Reason:</strong> ${cancelReason}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      We apologize for any inconvenience caused. Please contact us if you have any questions.
    </p>
  </div>
  ${footerTemplate}
`;



// Booking Cancellation Template for Admin (Admin Initiated)
const adminCancelledBookingAdminEmail = (id, fullName, pickupLocation, dropLocation, pickupDate, pickupTime, cabName, rent, cancelReason) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">You have canceled a booking with the following details:</p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Customer Name:</strong> ${fullName}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickupTime)}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
      <li><strong>Rent:</strong> ${rent} SAR</li>
      <li><strong>Cancellation Reason:</strong> ${cancelReason}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      Please ensure that this cancellation is properly documented and communicated to the relevant teams.
    </p>
  </div>
`;


// Booking Deletion Template for Admin Only
const bookingDeletionTemplateAdmin = (
  id, fullName, pickupLocation, dropLocation, pickupDate, pickupTime, cabName, rent, email, phoneNumber, country, message, status, createdDate, createdTime, updatedDate, updatedTime, cancelReason, cancelledBy
) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">The following booking record has been deleted from the database:</p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id || 'Null'}</li>
      <li><strong>Customer Name:</strong> ${fullName || 'Null'}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation || 'Null'}</li>
      <li><strong>Drop Location:</strong> ${dropLocation || 'Null'}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate || 'Null'}</li>
      <li><strong>Pickup Time:</strong> ${pickupTime ? formatTimeToAmPm(pickupTime) : 'Null'}</li>
      <li><strong>Cab Name:</strong> ${cabName || 'Null'}</li>
      <li><strong>Rent:</strong> ${rent !== null ? `${rent} SAR` : 'Null'}</li>
      <li><strong>Email:</strong> ${email || 'Null'}</li>
      <li><strong>Phone Number:</strong> ${phoneNumber || 'Null'}</li>
      <li><strong>Country:</strong> ${country || 'Null'}</li>
      <li><strong>Message:</strong> ${message || 'Null'}</li>
      <li><strong>Status:</strong> ${status || 'Null'}</li>
      <li><strong>Created Date:</strong> ${createdDate || 'Null'}</li>
      <li><strong>Created Time:</strong> ${createdTime || 'Null'}</li>
      <li><strong>Updated Date:</strong> ${updatedDate || 'Null'}</li>
      <li><strong>Updated Time:</strong> ${updatedTime || 'Null'}</li>
      <li><strong>Cancellation Reason:</strong> ${cancelReason || 'Null'}</li>
      <li><strong>Cancelled By:</strong> ${cancelledBy || 'Null'}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      Please ensure this deletion is properly documented as per our data management policies.
    </p>
  </div>
`;


// Template for Booking Marked as Under Review (Admin Notification)
const bookingUnderReviewTemplateAdmin = (id, fullName, pickupLocation, dropLocation, pickupDate, pickupTime, cabName) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">The following booking has been marked as <strong>Under Review</strong>:</p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Customer Name:</strong> ${fullName}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickupTime)}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      Please review this booking and take necessary actions to resolve the status.
    </p>
  </div>
`;

// Template for Booking Marked as Missed (Admin Notification)
const bookingMissedTemplateAdmin = (id, fullName, pickupLocation, dropLocation, pickupDate, pickupTime, cabName) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">The following booking has been marked as <strong>Missed</strong>:</p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Customer Name:</strong> ${fullName}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickupTime)}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      Please document this booking status appropriately and ensure all relevant parties are notified.
    </p>
  </div>
`;

// Booking Missed Template for User (User Notification)
const bookingMissedTemplateUser = (fullName, id, pickupLocation, dropLocation, pickupDate, pickupTime, cabName) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">Dear ${fullName},</p>
    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      We regret to inform you that your booking was marked as <strong>Missed</strong>. Below are the details of your booking:
    </p>
    <ul style="list-style: none; padding: 0; color: #333; margin: 15px 0;">
      <li><strong>Booking ID:</strong> ${id}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Drop Location:</strong> ${dropLocation}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickupTime)}</li>
      <li><strong>Cab Name:</strong> ${cabName}</li>
    </ul>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
      We apologize for any inconvenience caused. If you have any questions or need further assistance, please contact our support team.
    </p>
  </div>
  ${footerTemplate}
`;



// Elegant OTP Email Template with Username
const ValidationEmailTemplate = (userName, otpCode) => `
  ${headerTemplate}
  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333; margin: 0;">Dear ${userName},</p>
    <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 10px 0;">
      Your security is our priority. Please use the following one-time password (OTP) to validate your email address. This code is valid for <strong>3 minutes</strong>. Do not share this code with anyone.
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 20px; color: #333; font-weight: 700; border: 2px solid #FFD700; padding: 10px 20px; border-radius: 10px; display: inline-block; letter-spacing: 4px;">
        ${String(otpCode).split('').join('-')}
      </span>
    </div>
    <p style="font-size: 14px; color: #777; margin: 10px 0; text-align: center;">
      If you did not request this code, please disregard this message. We prioritize your safety.
    </p>
    <p style="font-size: 14px; color: #666; margin-top: 20px; text-align: center;">
      Thank you for trusting Madni Cabs. For further assistance, please contact our support team.
    </p>
  </div>
`;


export { bookingCreationTemplateUser, bookingCreationTemplateAdmin, bookingUpdateTemplateUser, bookingUpdateTemplateAdmin, userCancelledBookingUserEmail, userCancelledBookingAdminEmail, adminCancelledBookingUserEmail, adminCancelledBookingAdminEmail, bookingDeletionTemplateAdmin, ValidationEmailTemplate, bookingUnderReviewTemplateAdmin, bookingMissedTemplateAdmin ,bookingMissedTemplateUser};