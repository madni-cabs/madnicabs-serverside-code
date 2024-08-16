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
import http from 'http'; // Using HTTP instead of HTTPS
import { WebSocketServer } from 'ws';

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
app.use('/api/tags', tagsRoutes);
app.use('/api/rent', rentrouter);
app.use('/api/images', imagesRouter);
app.use('/api/app', CabBookingNotificationRouter);

// Create an HTTP server and attach the WebSocket server to it
const server = http.createServer(app); // Use HTTP here
const wss = new WebSocketServer({ server });

let appClient = null;

wss.on('connection', (ws) => {
  console.log('App connected for notifications');
  appClient = ws;

  ws.on('close', () => {
    console.log('App disconnected from notifications');
    appClient = null;
  });
});

export const notifyApp = (bookingDetails) => {
  if (appClient && appClient.readyState === WebSocket.OPEN) {
    appClient.send(JSON.stringify(bookingDetails));
  }
};

// Start the server
const startServer = async () => {
  try {
    await dbConnect;
    await createCabTable();
    await createCabBookListTable();
    await createTagTable();
    await createRentTable();

    const port = process.env.PORT || 80; // Default HTTP port

    server.listen(port, () => {
      console.log(`Server and WebSocket running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

startServer();
