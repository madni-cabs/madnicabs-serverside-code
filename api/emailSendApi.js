import express from 'express';
import nodemailer from 'nodemailer';

const emailRouter = express.Router();

// Setup the transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or any other email service provider
  auth: {
    user: 'madnicabs@gmail.com', // Your email
    pass: 'vftt gzxt nkav psmc', // Your email password (use environment variables for security)
  },
  logger: true, // Enable logging
  debug: true,  // Enable debugging
});

// POST - Send an email
emailRouter.post('/send-email', async (req, res) => {
  const { to, subject, body } = req.body;

  const mailOptions = {
    from: 'madnicabs@gmail.com', // Sender address
    to: to, // List of receivers
    subject: subject, // Subject line
    text: body, // Plain text body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email: ', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

export default emailRouter;
