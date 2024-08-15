import express from "express";
const AppRouter = express.Router();

AppRouter.post('/send-notification', (req, res) => {
    const title = 'New Booking';
    const body = 'Saad has booked a Cab';
  
    // Log the notification data to the console
    console.log(`Title: ${title}`);
    console.log(`Body: ${body}`);
  
    res.status(200).json({ message: 'Notification sent!' });
  });

  export default AppRouter;