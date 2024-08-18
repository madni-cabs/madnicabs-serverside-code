import express from 'express';
import { sql, dbConnect } from '../database/dbConnect.js';
import nodemailer from 'nodemailer';

const cabBookRouter = express.Router();

// Generate a unique 8-digit ID based on the current timestamp
const generateId = () => {
  const timestamp = Date.now().toString();
  const base36 = parseInt(timestamp.slice(-8)).toString(36).toUpperCase(); // Convert to base36 for alphanumeric characters
  const paddedId = base36.padStart(8, '0'); // Ensure the ID is 8 characters long
  return paddedId;
};

// Function to send email
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'madnicabs@gmail.com', // Replace with your email
      pass: 'deei dchw fkaa kncv', // Replace with your email password or app-specific password
    },
  });

  const mailOptions = {
    from: 'madnicabs@gmail.com',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};
const formatTimeToAmPm = (time) => {
  const [hours, minutes, seconds] = time.split(":");
  const date = new Date(1970, 0, 1, hours, minutes, seconds);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
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
    updated_date,
    updated_time
  } = req.body;
  const id = generateId();

  try {
    await dbConnect;
    const request = new sql.Request();
    const query = `
          INSERT INTO cabbooklist (id, pickup_location, drop_location, rent, pickup_date, pickup_time, full_name, email, phone_number, country, message, cab_name, status, created_date, created_time, updated_date, updated_time)
          VALUES (@id, @pickup_location, @drop_location, @rent, @pickup_date, @pickup_time, @full_name, @email, @phone_number, @country, @message, @cab_name, @status, @created_date, @created_time, @updated_date, @updated_time)
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
    request.input('updated_date', sql.NVarChar, updated_date);
    request.input('updated_time', sql.NVarChar, updated_time);
    await request.query(query);

    // Prepare email content
    // const logoData = fs.readFileSync(logoPath).toString('base64');
    // const logoImage = `data:image/png;base64,${logoData}`;

    const customerEmailHtml = `
<div style="text-align: left;">
  <h1 style="text-align: center;">Dear ${full_name},</h1>
  <p>You have successfully booked a ride.</p>
  <p><strong>Booking Details:</strong></p>
  <ul style="list-style-type: none; padding: 0;">
    <li><strong>Booking ID:</strong> ${id}</li>
    <li><strong>Pickup Location:</strong> ${pickup_location}</li>
    <li><strong>Drop Location:</strong> ${drop_location}</li>
    <li><strong>Pickup Date:</strong> ${pickup_date}</li>
    <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickup_time)}</li>
    <li><strong>Cab Name:</strong> ${cab_name}</li>
    <li><strong>Rent:</strong> ${rent}</li>
  </ul>
  <p>Our representative will contact you as soon as possible.</p>
</div>

      `;

    const adminEmailHtml = `
        <div>
          <h1>New Booking Created</h1>
          <p><strong>Booking ID:</strong> ${id}</p>
          <p><strong>Customer Name:</strong> ${full_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phone_number}</p>
          <p><strong>Pickup Location:</strong> ${pickup_location}</p>
          <p><strong>Drop Location:</strong> ${drop_location}</p>
          <p><strong>Pickup Date:</strong> ${pickup_date}</p>
          <p><strong>Pickup Time:</strong> ${formatTimeToAmPm(pickup_time)}</p>
          <p><strong>Cab Name:</strong> ${cab_name}</p>
          <p><strong>Rent:</strong> ${rent}</p>
        </div>
      `;

    // Send email to customer
    await sendEmail(email, 'Your Madni Cabs Booking Confirmation', customerEmailHtml);

    // Send email to admin
    await sendEmail('madnicabs@gmail.com', 'New Booking Notification', adminEmailHtml);

    // Return the generated booking ID
    res.status(201).json({ message: 'Booking created successfully', id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating booking', details: err.message });
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
    res.status(500).json({ error: 'Error fetching bookings', details: err.message });
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
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = fetchResult.recordset[0];

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

    // Prepare email content with original details + updated fields
    const emailHtml = `
      <div style="text-align: left;">
        <h1 style="text-align: center;">Booking Updated</h1>
        <p><strong>Booking ID:</strong> ${id}</p>
        <p><strong>Pickup Location:</strong> ${bookingData.pickup_location}</p>
        <p><strong>Drop Location:</strong> ${bookingData.drop_location}</p>
        <p><strong>Cab Name:</strong> ${bookingData.cab_name}</p>
        <p><strong>Rent:</strong> ${bookingData.rent}</p>
        <p><strong>New Pickup Date:</strong> ${pickup_date}</p>
        <p><strong>New Pickup Time:</strong> ${pickup_time}</p>
        <p><strong>New Phone Number:</strong> ${phone_number}</p>
      </div>
    `;

    // Send email to customer and admin with updated details
    await sendEmail(bookingData.email, 'Your Madni Cabs Booking Update', emailHtml);
    await sendEmail('madnicabs@gmail.com', 'Madni Cabs Booking Update Notification', emailHtml);

    // Respond with success
    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating booking', details: err.message });
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
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching booking', details: err.message });
  }
});

// DELETE - Delete cab booking by ID
cabBookRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await dbConnect;
    const request = new sql.Request();
    request.input('id', sql.NVarChar, id);
    const query = 'DELETE FROM cabbooklist WHERE id = @id';

    await request.query(query);

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting booking', details: err.message });
  }
});



// PUT - Cancel a cab booking by ID
cabBookRouter.put('/cancel/:id', async (req, res) => {
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
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = fetchResult.recordset[0];

    // Update the booking to "Cancelled" status with the reason
    request.input('status', sql.NVarChar, 'Cancelled');
    request.input('cancel_reason', sql.NVarChar, cancel_reason);
    request.input('updated_date', sql.NVarChar, updated_date);
    request.input('updated_time', sql.NVarChar, updated_time);

    const query = `
      UPDATE cabbooklist
      SET status = @status,
          cancel_reason = @cancel_reason,
          updated_date = @updated_date,
          updated_time = @updated_time
      WHERE id = @id
    `;

    await request.query(query);

    // Prepare email content
    const customerEmailHtml = `
      <div style="text-align: left;">
        <h1 style="text-align: center;">Booking Cancelled</h1>
        <p>Dear ${bookingData.full_name},</p>
        <p>Your booking with the following details has been cancelled:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>Booking ID:</strong> ${id}</li>
          <li><strong>Pickup Location:</strong> ${bookingData.pickup_location}</li>
          <li><strong>Drop Location:</strong> ${bookingData.drop_location}</li>
          <li><strong>Pickup Date:</strong> ${bookingData.pickup_date}</li>
          <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(bookingData.pickup_time)}</li>
          <li><strong>Cab Name:</strong> ${bookingData.cab_name}</li>
          <li><strong>Rent:</strong> ${bookingData.rent}</li>
          <li><strong>Cancellation Reason:</strong> ${cancel_reason}</li>
        </ul>
        <p>If you have any questions, feel free to contact us.</p>
      </div>
    `;

    const adminEmailHtml = `
      <div>
        <h1>Booking Cancelled</h1>
        <p><strong>Booking ID:</strong> ${id}</p>
        <p><strong>Customer Name:</strong> ${bookingData.full_name}</p>
        <p><strong>Email:</strong> ${bookingData.email}</p>
        <p><strong>Phone Number:</strong> ${bookingData.phone_number}</p>
        <p><strong>Pickup Location:</strong> ${bookingData.pickup_location}</p>
        <p><strong>Drop Location:</strong> ${bookingData.drop_location}</p>
        <p><strong>Pickup Date:</strong> ${bookingData.pickup_date}</p>
        <p><strong>Pickup Time:</strong> ${formatTimeToAmPm(bookingData.pickup_time)}</p>
        <p><strong>Cab Name:</strong> ${bookingData.cab_name}</p>
        <p><strong>Rent:</strong> ${bookingData.rent}</p>
        <p><strong>Cancellation Reason:</strong> ${cancel_reason}</p>
        <p><strong>Cancelled Date:</strong> ${updated_date}</p>
        <p><strong>Cancelled Time:</strong> ${updated_time}</p>
      </div>
    `;

    // Send email to customer
    await sendEmail(bookingData.email, 'Madni Cabs Booking Cancellation Confirmation', customerEmailHtml);

    // Send email to admin
    await sendEmail('madnicabs@gmail.com', 'Madni Cabs Booking Cancellation Notification', adminEmailHtml);

    // Respond with success
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling booking:', err.message);
    res.status(500).json({ error: 'Error cancelling booking', details: err.message });
  }
});



// PUT - Update booking status to Completed by ID
cabBookRouter.put('/complete/:id', async (req, res) => {
  const { id } = req.params;
  const { updated_date, updated_time } = req.body;

  try {
    await dbConnect;
    const request = new sql.Request();

    // Fetch the original booking details
    request.input('id', sql.NVarChar, id);
    const fetchQuery = 'SELECT * FROM cabbooklist WHERE id = @id';
    const fetchResult = await request.query(fetchQuery);

    if (fetchResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = fetchResult.recordset[0];

    // Update the booking status to "Completed"
    request.input('status', sql.NVarChar, 'Completed');
    request.input('updated_date', sql.NVarChar, updated_date);
    request.input('updated_time', sql.NVarChar, updated_time);

    const query = `
      UPDATE cabbooklist
      SET status = @status,
          updated_date = @updated_date,
          updated_time = @updated_time
      WHERE id = @id
    `;

    await request.query(query);

    // Prepare email content
    const customerEmailHtml = `
      <div style="text-align: left;">
        <h1 style="text-align: center;">Booking Completed</h1>
        <p>Dear ${bookingData.full_name},</p>
        <p>Your booking with the following details has been completed:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>Booking ID:</strong> ${id}</li>
          <li><strong>Pickup Location:</strong> ${bookingData.pickup_location}</li>
          <li><strong>Drop Location:</strong> ${bookingData.drop_location}</li>
          <li><strong>Pickup Date:</strong> ${bookingData.pickup_date}</li>
          <li><strong>Pickup Time:</strong> ${formatTimeToAmPm(bookingData.pickup_time)}</li>
          <li><strong>Cab Name:</strong> ${bookingData.cab_name}</li>
          <li><strong>Rent:</strong> ${bookingData.rent}</li>
        </ul>
        <p>Thank You for Choosing Us ❤️.</p>
        <p>If you have any questions, feel free to contact us.</p>
      </div>
    `;

    const adminEmailHtml = `
      <div>
        <h1>Booking Completed</h1>
        <p><strong>Booking ID:</strong> ${id}</p>
        <p><strong>Customer Name:</strong> ${bookingData.full_name}</p>
        <p><strong>Email:</strong> ${bookingData.email}</p>
        <p><strong>Phone Number:</strong> ${bookingData.phone_number}</p>
        <p><strong>Pickup Location:</strong> ${bookingData.pickup_location}</p>
        <p><strong>Drop Location:</strong> ${bookingData.drop_location}</p>
        <p><strong>Pickup Date:</strong> ${bookingData.pickup_date}</p>
        <p><strong>Pickup Time:</strong> ${formatTimeToAmPm(bookingData.pickup_time)}</p>
        <p><strong>Cab Name:</strong> ${bookingData.cab_name}</p>
        <p><strong>Rent:</strong> ${bookingData.rent}</p>
        <p><strong>Completed Date:</strong> ${updated_date}</p>
        <p><strong>Completed Time:</strong> ${updated_time}</p>
      </div>
    `;

    // Send email to customer
    await sendEmail(bookingData.email, 'Madni Cabs Booking Completion Confirmation', customerEmailHtml);

    // Send email to admin
    await sendEmail('madnicabs@gmail.com', 'Madni Cabs Booking Completion Notification', adminEmailHtml);

    // Respond with success
    res.status(200).json({ message: 'Booking marked as completed successfully' });
  } catch (err) {
    console.error('Error marking booking as completed:', err.message);
    res.status(500).json({ error: 'Error marking booking as completed', details: err.message });
  }
});




export default cabBookRouter;
