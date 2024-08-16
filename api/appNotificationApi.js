// api/appNotificationApi.js

import express from 'express';
import { notifyApp } from '../app.js'; // Adjust the path if needed

const CabBookingNotificationRouter = express.Router();

// Assuming you have a POST route where the booking is created
CabBookingNotificationRouter.post('/notify', async (req, res) => {
  const bookingDetails = req.body;

  try {
    notifyApp(bookingDetails); // Send notification to WebSocket client (Flutter app)
    res.status(200).json({ message: 'Notification sent to client' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification', details: err.message });
  }
});

export default CabBookingNotificationRouter;
