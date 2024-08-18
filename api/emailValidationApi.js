import express from "express";
import sql from "mssql";
import { dbConnect } from "../database/dbConnect.js";
import nodemailer from "nodemailer"; // For sending emails

const emailValidationRouter = express.Router();

// Connect to the database
dbConnect;

// Generate a unique 6-digit numeric validation password using DateTime
const generateValidationPassword = () => {
    const dateTimeNow = Date.now(); // Get the current time in milliseconds
    const password = dateTimeNow.toString().slice(-6); // Slice the last 6 digits
    return password;
  };

  const createdAt = new Date(); // Date object

  

// Send email with the validation password
const sendValidationEmail = async (email, validationPassword) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'madnicabs@gmail.com',
      pass: 'deei dchw fkaa kncv', // Replace with your email password or an app-specific password
    },
  });

  const mailOptions = {
    from: 'madnicabs@gmail.com',
    to: email,
    subject: 'Your Validation Password',
    html: `<p>Dear User,</p>
           <p>Your validation password is: <strong>${validationPassword}</strong></p>
           <p>This password is valid for only 3 minutes.</p>
           <p>Best regards,<br/>Madni Cabs</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Validation password sent to ${email}`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

// API to generate and send validation password
emailValidationRouter.post("/email-validation", async (req, res) => {
  const { email } = req.body;
  const validationPassword = generateValidationPassword();
  const createdAt = new Date().toISOString(); // Store the current date-time as a string

  const query = `
    INSERT INTO email_validations (id, email, validation_password, created_at)
    VALUES (@id, @Email, @ValidationPassword, @CreatedAt)
  `;

  try {
    const request = new sql.Request();
    request.input("id", sql.VarChar, Date.now().toString());
    request.input("Email", sql.VarChar, email);
    request.input("ValidationPassword", sql.VarChar, validationPassword);
    request.input("CreatedAt", sql.DateTime, createdAt);

    
    await request.query(query);
    console.log("Validation password inserted into database successfully.");

    await sendValidationEmail(email, validationPassword);
    console.log("Validation email sent successfully.");

    res.status(201).json({ message: "Validation password sent to your email." });
  } catch (err) {
    console.error("Error generating validation password:", err);
    res.status(500).json({ error: "Error generating validation password" });
  }
});

// API to validate the code against the related email
emailValidationRouter.post("/validate-code", async (req, res) => {
    const { email, validationCode } = req.body;
  
    const query = `
      SELECT * FROM email_validations 
      WHERE email = @Email AND validation_password = @ValidationPassword 
        AND CONVERT(datetime, created_at, 126) >= DATEADD(MINUTE, -3, GETDATE())
    `;
  
    try {
      const request = new sql.Request();
      request.input("Email", sql.VarChar, email);
      request.input("ValidationPassword", sql.VarChar, validationCode);
  
      const result = await request.query(query);
  
      if (result.recordset.length > 0) {
        res.status(200).json({ valid: true, message: "Validation successful." });
      } else {
        res.status(400).json({ valid: false, message: "Invalid or expired validation code." });
      }
    } catch (err) {
      console.error("Error validating code:", err);
      res.status(500).json({ error: "Error validating code" });
    }
  });
  

// Function to clear expired validation passwords
const clearExpiredValidationPasswords = async () => {
    const query = `
      DELETE FROM email_validations 
      WHERE created_at < DATEADD(MINUTE, -3, GETDATE())
    `;
  
    try {
      const request = new sql.Request();
      await request.query(query);
      console.log(`Expired validation passwords cleared.`);
    } catch (err) {
      console.error('Error clearing expired validation passwords:', err);
    }
  };
  

// Run the function to clear expired passwords every 30 minutes
setInterval(clearExpiredValidationPasswords, 30 * 60 * 1000); // 30 minutes = 1800000 ms


export default emailValidationRouter;
