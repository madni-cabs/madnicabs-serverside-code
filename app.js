import dotenv from 'dotenv';
import express from 'express';
import path from 'path'; // Import the path module
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
import AppRouter from './api/appNotificationApi.js';

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the uploads folder as static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // Use process.cwd() to get the current working directory

// Use your routes
app.use('/api/cabs', cabListRoutes);
app.use('/api/cabbook', cabBookRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/rent', rentrouter);
app.use('/api/images', imagesRouter);
app.use('/api/app', AppRouter);

// Start the server
const startServer = async () => {
  try {
    await dbConnect; // Await the database connection
    await createCabTable(); // Ensure tables are created
    await createCabBookListTable(); // Ensure tables are created
    await createTagTable();
    await createRentTable();

    const port = process.env.PORT || 8800;

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

startServer();
