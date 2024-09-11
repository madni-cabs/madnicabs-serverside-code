import express from 'express';
import { sql, dbConnect } from '../database/dbConnect.js';
import { sendEmail } from '../helper/emailMethod.js';
import {
  bookingCreationTemplateUser,
  bookingCreationTemplateAdmin,
  bookingUpdateTemplateUser,
  bookingUpdateTemplateAdmin,
  userCancelledBookingUserEmail,
  userCancelledBookingAdminEmail,
  adminCancelledBookingUserEmail,
  adminCancelledBookingAdminEmail,
  bookingDeletionTemplateAdmin,
  bookingMissedTemplateUser,
  bookingMissedTemplateAdmin,
} from '../utils/emailTemplates/emailTemplates.js';
import {
  sendWhatsAppMessageSingle,
  sendWhatsAppGroupMessage,
  adminMainOwnerWhatsAppTemplate,
  groupWhatsAppTemplate,
} from '../utils/whatsAppTemplates/whatsAppTemplates.js';

const cabBookRouter = express.Router();

// Generate a unique 8-digit ID based on the current timestamp
const generateId = () => {
  const timestamp = Date.now().toString();
  const base36 = parseInt(timestamp.slice(-8)).toString(36).toUpperCase();
  const paddedId = base36.padStart(8, '0');
  return paddedId;
};

// Helper function to handle WhatsApp messaging errors
const handleWhatsAppError = async (error, messageDetails) => {
  console.error('Error sending WhatsApp message:', error.message);

  const errorHtml = `
    <h2>Error Sending WhatsApp Message</h2>
    <p><strong>Error Message:</strong> ${error.message}</p>
    <p><strong>Booking Details:</strong></p>
    <pre>${JSON.stringify(messageDetails, null, 2)}</pre>
  `;

  // Send email to notify about the WhatsApp message failure
  await sendEmail('h.saadshabbir@gmail.com', 'Error Sending WhatsApp Message', errorHtml);
};

// POST - Create a new cab booking
cabBookRouter.post('/add', async (req, res) => {
  const {
    pickup_location,
    drop_location,
    rent,
    pickup_date,
    pickup_time,
    full_name,
    email,
    phone_number,
    country,
    message,
    cab_name,
    status,
    created_date,
    created_time,
  } = req.body;
  const id = generateId();

  try {
    await dbConnect;
    const request = new sql.Request();
    const query = `
      INSERT INTO cabbooklist (id, pickup_location, drop_location, rent, pickup_date, pickup_time, full_name, email, phone_number, country, message, cab_name, status, created_date, created_time)
      VALUES (@id, @pickup_location, @drop_location, @rent, @pickup_date, @pickup_time, @full_name, @email, @phone_number, @country, @message, @cab_name, @status, @created_date, @created_time)
    `;
    request.input('id', sql.NVarChar, id);
    request.input('pickup_location', sql.NVarChar, pickup_location);
    request.input('drop_location', sql.NVarChar, drop_location);
    request.input('rent', sql.Int, rent);
    request.input('pickup_date', sql.NVarChar, pickup_date);
    request.input('pickup_time', sql.NVarChar, pickup_time);
    request.input('full_name', sql.NVarChar, full_name);
    request.input('email', sql.NVarChar, email);
    request.input('phone_number', sql.NVarChar, phone_number);
    request.input('country', sql.NVarChar, country);
    request.input('message', sql.NVarChar, message);
    request.input('cab_name', sql.NVarChar, cab_name);
    request.input('status', sql.NVarChar, status);
    request.input('created_date', sql.NVarChar, created_date);
    request.input('created_time', sql.NVarChar, created_time);
    await request.query(query);

    // Prepare email content using styled templates
    const customerHtml = bookingCreationTemplateUser(
      full_name,
      id,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
      cab_name,
      rent,
      email,
      phone_number
    );

    const adminHtml = bookingCreationTemplateAdmin(
      id,
      full_name,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
      cab_name,
      rent,
      email,
      phone_number
    );

    // Send email to customer and admin
    await sendEmail(email, 'Your Madni Cabs Booking Confirmation', customerHtml);
    await sendEmail('madnicabs@gmail.com', 'New Booking Notification', adminHtml);
    const action = 'create';
    // Send WhatsApp messages
    const ownerMessage = adminMainOwnerWhatsAppTemplate(
      full_name,
      id,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
      cab_name,
      rent,
      email,
      phone_number,
      action
    );

    const groupMessage = groupWhatsAppTemplate(
      full_name,
      id,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
      cab_name,
      rent,
      email,
      phone_number,
      action
    );

    try {
      await sendWhatsAppMessageSingle('923095860148', ownerMessage);
      // await sendWhatsAppMessageSingle('966582480985', ownerMessage);
      await sendWhatsAppGroupMessage('Madni Cabs', groupMessage);
    } catch (error) {
      await handleWhatsAppError(error, { action: 'create', bookingId: id, fullName: full_name });
    }

    res.status(201).json({ message: 'Booking created successfully', id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', details: err.message });
  }
});

// GET - Get all cab bookings
cabBookRouter.get('/get', async (req, res) => {
  try {
    await dbConnect;
    const request = new sql.Request();
    const query = 'SELECT * FROM cabbooklist';
    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', details: err.message });
  }
});

// GET - Get cab booking by ID
cabBookRouter.get('/get/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await dbConnect;
    const request = new sql.Request();
    request.input('id', sql.NVarChar, id);
    const query = 'SELECT * FROM cabbooklist WHERE id = @id';
    const result = await request.query(query);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching booking', details: err.message });
  }
});

// PUT - Update cab booking by ID
cabBookRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { pickup_date, pickup_time, phone_number, updated_date, updated_time } = req.body;

  try {
    await dbConnect;
    const request = new sql.Request();

    // Fetch the original booking details
    const fetchQuery = 'SELECT * FROM cabbooklist WHERE id = @id';
    request.input('id', sql.NVarChar, id);
    const fetchResult = await request.query(fetchQuery);

    if (fetchResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingData = fetchResult.recordset[0];

    // Extract required fields from the fetched data
    const { full_name, pickup_location, drop_location, cab_name, email, rent, status } = bookingData;

    // Update the booking with new pickup_date, pickup_time, and phone_number
    request.input('pickup_date', sql.NVarChar, pickup_date);
    request.input('pickup_time', sql.NVarChar, pickup_time);
    request.input('phone_number', sql.NVarChar, phone_number);
    request.input('updated_date', sql.NVarChar, updated_date);
    request.input('updated_time', sql.NVarChar, updated_time);

    const updateQuery = `
      UPDATE cabbooklist
      SET pickup_date = @pickup_date,
          pickup_time = @pickup_time,
          phone_number = @phone_number,
          updated_date = @updated_date,
          updated_time = @updated_time
      WHERE id = @id
    `;
    await request.query(updateQuery);

    // Prepare email content using styled templates for update
    const customerHtml = bookingUpdateTemplateUser(
      full_name,
      id,
      pickup_location,
      drop_location,
      cab_name,
      pickup_date,
      pickup_time,
      phone_number,
      email
    );

    const adminHtml = bookingUpdateTemplateAdmin(
      id,
      full_name,
      pickup_location,
      drop_location,
      cab_name,
      pickup_date,
      pickup_time,
      phone_number,
      email
    );

    // Send email to customer and admin
    await sendEmail(email, 'Your Madni Cabs Booking Update', customerHtml);
    await sendEmail('madnicabs@gmail.com', 'Madni Cabs Booking Update Notification', adminHtml);
const action = 'update';
    // Send WhatsApp messages
    const ownerMessage = adminMainOwnerWhatsAppTemplate(
      full_name,
      id,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
      cab_name,
      rent,
      email,
      phone_number,
      action
    );

    const groupMessage = groupWhatsAppTemplate(
      full_name,
      id,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
      cab_name,
      rent,
      email,
      phone_number,
      action
    );

    try {
      await sendWhatsAppMessageSingle('923095860148', ownerMessage);
      // await sendWhatsAppMessageSingle('966582480985', ownerMessage);
      await sendWhatsAppGroupMessage('Madni Cabs', groupMessage);
    } catch (error) {
      await handleWhatsAppError(error, { action: 'update', bookingId: id, fullName: full_name });
    }

    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking', details: err.message });
  }
});

// PUT - Cancel a cab booking by User
cabBookRouter.put('/cancel-by-user/:id', async (req, res) => {
  const { id } = req.params;
  const { cancel_reason, updated_date, updated_time } = req.body;

  try {
    await dbConnect;
    const request = new sql.Request();

    // Fetch the original booking details
    request.input('id', sql.NVarChar, id);
    const fetchQuery = 'SELECT * FROM cabbooklist WHERE id = @id';
    const fetchResult = await request.query(fetchQuery);

    if (fetchResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingData = fetchResult.recordset[0];

    // Update the booking to "Cancelled" status with the reason
    request.input('status', sql.NVarChar, 'Cancelled');
    request.input('cancel_reason', sql.NVarChar, cancel_reason);
    request.input('cancelled_by', sql.NVarChar, 'User');
    request.input('updated_date', sql.NVarChar, updated_date);
    request.input('updated_time', sql.NVarChar, updated_time);

    const query = `
      UPDATE cabbooklist
      SET status = @status,
          cancel_reason = @cancel_reason,
          cancelled_by = @cancelled_by,
          updated_date = @updated_date,
          updated_time = @updated_time
      WHERE id = @id
    `;
    await request.query(query);

    // Send email notifications
    const userEmailContent = userCancelledBookingUserEmail(
      bookingData.full_name,
      id,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name,
      bookingData.rent,
      cancel_reason
    );

    const adminEmailContent = userCancelledBookingAdminEmail(
      id,
      bookingData.full_name,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name,
      bookingData.rent,
      cancel_reason
    );

    await sendEmail(bookingData.email, 'Madni Cabs Booking Cancellation Confirmation', userEmailContent);
    await sendEmail('madnicabs@gmail.com', 'User Cancelled Booking Notification', adminEmailContent);
    const action = 'cancel';
    // Send WhatsApp messages
    const ownerMessage = adminMainOwnerWhatsAppTemplate(
      bookingData.full_name,
      id,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name,
      bookingData.rent,
      bookingData.email,
      bookingData.phone_number,
      'User',
      action,
      cancel_reason
    );

    const groupMessage = groupWhatsAppTemplate(
      bookingData.full_name,
      id,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name,
      bookingData.rent,
      bookingData.email,
      bookingData.phone_number,
      action,
      'User',
      cancel_reason
    );

    try {
      await sendWhatsAppMessageSingle('923095860148', ownerMessage);
      // await sendWhatsAppMessageSingle('966582480985', ownerMessage);
      await sendWhatsAppGroupMessage('Madni Cabs', groupMessage);
    } catch (error) {
      await handleWhatsAppError(error, { action: 'cancel by user', bookingId: id, fullName: bookingData.full_name });
    }

    res.status(200).json({ message: 'Booking canceled successfully by the user.' });
  } catch (err) {
    res.status(500).json({ message: 'Error canceling booking by user', details: err.message });
  }
});

// PUT - Cancel a cab booking by Admin
cabBookRouter.put('/cancel-by-admin/:id', async (req, res) => {
  const { id } = req.params;
  const { cancel_reason, updated_date, updated_time } = req.body;

  try {
    await dbConnect;
    const request = new sql.Request();

    // Fetch the original booking details
    request.input('id', sql.NVarChar, id);
    const fetchQuery = 'SELECT * FROM cabbooklist WHERE id = @id';
    const fetchResult = await request.query(fetchQuery);

    if (fetchResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingData = fetchResult.recordset[0];

    // Update the booking to "Cancelled" status with the reason
    request.input('status', sql.NVarChar, 'Cancelled');
    request.input('cancel_reason', sql.NVarChar, cancel_reason);
    request.input('cancelled_by', sql.NVarChar, 'Admin');
    request.input('updated_date', sql.NVarChar, updated_date);
    request.input('updated_time', sql.NVarChar, updated_time);

    const query = `
      UPDATE cabbooklist
      SET status = @status,
          cancel_reason = @cancel_reason,
          cancelled_by = @cancelled_by,
          updated_date = @updated_date,
          updated_time = @updated_time
      WHERE id = @id
    `;
    await request.query(query);

    // Send email notifications
    const userEmailContent = adminCancelledBookingUserEmail(
      bookingData.full_name,
      id,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name,
      bookingData.rent,
      cancel_reason
    );

    const adminEmailContent = adminCancelledBookingAdminEmail(
      id,
      bookingData.full_name,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name,
      bookingData.rent,
      cancel_reason
    );

    await sendEmail(bookingData.email, 'Madni Cabs Booking Cancellation Notification', userEmailContent);
    await sendEmail('madnicabs@gmail.com', 'Admin Cancelled Booking Confirmation', adminEmailContent);

    // Send WhatsApp messages
    const ownerMessage = adminMainOwnerWhatsAppTemplate(
      bookingData.full_name,
      id,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name,
      bookingData.rent,
      bookingData.email,
      bookingData.phone_number,
      'Admin',
      'cancel',
      cancel_reason
    );

    const groupMessage = groupWhatsAppTemplate(
      bookingData.full_name,
      id,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name,
      bookingData.rent,
      bookingData.email,
      bookingData.phone_number,
      'cancel',
      'Admin',
      cancel_reason
    );

    try {
      await sendWhatsAppMessageSingle('923095860148', ownerMessage);
      // await sendWhatsAppMessageSingle('966582480985', ownerMessage);
      await sendWhatsAppGroupMessage('Madni Cabs', groupMessage);
    } catch (error) {
      await handleWhatsAppError(error, { action: 'cancel by admin', bookingId: id, fullName: bookingData.full_name });
    }

    res.status(200).json({ message: 'Booking canceled successfully by the admin.' });
  } catch (err) {
    res.status(500).json({ message: 'Error canceling booking by admin', details: err.message });
  }
});

// PUT - Mark booking as "Under Review" (Send email only to admin)
cabBookRouter.put('/under-review/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await dbConnect;
    const request = new sql.Request();

    // Fetch the original booking details
    const fetchQuery = 'SELECT * FROM cabbooklist WHERE id = @id';
    request.input('id', sql.NVarChar, id);
    const fetchResult = await request.query(fetchQuery);

    if (fetchResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingData = fetchResult.recordset[0];

    // Update the booking to "Under Review" status
    request.input('status', sql.NVarChar, 'Under Review');

    const query = `
      UPDATE cabbooklist
      SET status = @status
      WHERE id = @id
    `;
    await request.query(query);

    res.status(200).json({ message: 'Booking marked as under review successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking booking as under review', details: err.message });
  }
});

// PUT - Mark booking as missed (Send email to admin and user)
cabBookRouter.put('/missed/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await dbConnect;
    const request = new sql.Request();

    // Fetch the original booking details
    const fetchQuery = 'SELECT * FROM cabbooklist WHERE id = @id';
    request.input('id', sql.NVarChar, id);
    const fetchResult = await request.query(fetchQuery);

    if (fetchResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingData = fetchResult.recordset[0];

    // Update the booking to "Missed" status
    request.input('status', sql.NVarChar, 'Missed');

    const query = `
      UPDATE cabbooklist
      SET status = @status,
      WHERE id = @id
    `;
    await request.query(query);

    // Prepare email content for admin
    const adminHtml = bookingMissedTemplateAdmin(
      id,
      bookingData.full_name,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name
    );

    // Prepare email content for user
    const userHtml = bookingMissedTemplateUser(
      bookingData.full_name,
      id,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name
    );

    // Send emails to admin and user
    await sendEmail('madnicabs@gmail.com', 'Booking Marked as Missed', adminHtml);
    await sendEmail(bookingData.email, 'Your Booking Marked as Missed', userHtml);

    res.status(200).json({ message: 'Booking marked as missed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking booking as missed', details: err.message });
  }
});

// DELETE - Delete cab booking by ID (for database cleanup)
cabBookRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await dbConnect;
    const request = new sql.Request();

    // Fetch booking details before deletion
    request.input('id', sql.NVarChar, id);
    const fetchQuery = 'SELECT * FROM cabbooklist WHERE id = @id';
    const fetchResult = await request.query(fetchQuery);

    if (fetchResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingData = fetchResult.recordset[0];

    // Perform the deletion
    const deleteQuery = 'DELETE FROM cabbooklist WHERE id = @id';
    await request.query(deleteQuery);

    // Prepare email content for admin notification
    const adminHtml = bookingDeletionTemplateAdmin(
      bookingData.id,
      bookingData.full_name,
      bookingData.pickup_location,
      bookingData.drop_location,
      bookingData.pickup_date,
      bookingData.pickup_time,
      bookingData.cab_name,
      bookingData.rent,
      bookingData.email,
      bookingData.phone_number,
      bookingData.country,
      bookingData.message,
      bookingData.status,
      bookingData.created_date,
      bookingData.created_time,
      bookingData.updated_date,
      bookingData.updated_time,
      bookingData.cancel_reason,
      bookingData.cancelled_by
    );

    // Send deletion notification to admin only
    await sendEmail('madnicabs@gmail.com', 'Booking Deletion Notification', adminHtml);

    res.status(200).json({ message: 'Booking deleted successfully to maintain database cleanliness.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting booking', details: err.message });
  }
});

export default cabBookRouter;