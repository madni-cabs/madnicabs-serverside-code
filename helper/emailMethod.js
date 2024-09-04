import nodemailer from 'nodemailer';

// Function to send an email
export const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'madnicabs@gmail.com',
        pass: 'deei dchw fkaa kncv', // Replace with your actual app-specific password
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