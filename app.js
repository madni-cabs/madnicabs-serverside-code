import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { dbConnect } from './database/dbConnect.js';
import createCabTable from './dbTables/cablistTable.js';
import cabListRoutes from './api/cablistApi.js';
import createCabBookListTable from './dbTables/cabbooklistTable.js';
import createTagTable from './dbTables/tagTable.js';
import createRentTable from './dbTables/rentTable.js';
import cabBookRoutes from './api/cabbooklistApi.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import tagsRoutes from './api/tagsApi.js';
import rentrouter from './api/rentApi.js';
import imagesRouter from './api/imagesApi.js';
import CabBookingNotificationRouter from './api/appNotificationApi.js';
import http from 'http';
import { WebSocketServer } from 'ws';
import emailRouter from './api/emailSendApi.js';
import createEmailValidationsTable from './dbTables/emailValidation.js';
import emailValidationRouter from './api/emailValidationApi.js';
import createDashBoardAdminTable from './dbTables/dashboardAdminTable.js';
import dashboardAdminRouter from './api/dashboardAdminApi.js';

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the uploads folder as static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Use your routes
app.use('/api/cabs', cabListRoutes);
app.use('/api/cabbook', cabBookRoutes);
// Tags EndPoint
app.use('/api/tags', tagsRoutes);
// Rent Endpoint
app.use('/api/rent', rentrouter);
// Images Endpoint
app.use('/api/images', imagesRouter);
// Later work on this
app.use('/api/app', CabBookingNotificationRouter);
// Email Router Later Work on it
app.use('/api', emailRouter);
// Email Validation Router
app.use('/api', emailValidationRouter);
// Dashboard Login
app.use('/api/dashboard', dashboardAdminRouter);

// Create an HTTP server
const server = http.createServer(app);

// Set up WebSocket server on a different port
const wssPort = 6666;
const wss = new WebSocketServer({ port: wssPort });

wss.on('connection', (ws) => {
  console.log('App connected for notifications');
  
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('App disconnected from notifications');
  });
});

export const notifyApp = (bookingDetails) => {
  console.log('Sending notification to clients:', bookingDetails);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(bookingDetails));
    }
  });
};

// Start the HTTP server
const startServer = async () => {
  try {
    await dbConnect;
    await createCabTable();
    await createCabBookListTable();
    // Tag Table
    await createTagTable();
    // Rent Table
    await createRentTable();
    // Email Validation Table
    await createEmailValidationsTable();
    // Dashboard User Table
    await createDashBoardAdminTable();

    const port = process.env.PORT || 80; // Default HTTP port

    server.listen(port, () => {
      console.log(`HTTP Server running at http://localhost:${port}`);
    });

    console.log(`WebSocket server running on port ${wssPort}`);
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

startServer();
