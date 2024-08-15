// routes/cabRoutes.js
import express from 'express';
import { sql, dbConnect } from '../database/dbConnect.js';
import { imageUpload } from '../helper/imageUploader.js';
import { validateCabListFields } from '../helper/validateRequest.js'; // Import validation middleware
import uniqueId from '../helper/uniqueId.js';

const cablistRouter = express.Router();

// Connect to the database
dbConnect;

// POST: Add a new cab to cablist
cablistRouter.post('/add',  imageUpload, async (req, res) => {
  const id = uniqueId();
  const { name, passengers, luggageCarry, airCondition , tags} = req.body;
  const carImage = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO dbo.cablist (id,name, passengers, luggageCarry, carImage, airCondition, tags)
    VALUES (@id, @name, @passengers, @luggageCarry, @carImage, @airCondition, @tags)
  `;

  try {
    const request = new sql.Request();
    request.input('id', sql.NVarChar, id);
    request.input('name', sql.NVarChar, name);
    request.input('passengers', sql.Int, passengers);
    request.input('luggageCarry', sql.Int, luggageCarry);
    request.input('carImage', sql.NVarChar, carImage);
    request.input('airCondition', sql.NVarChar, airCondition);
    request.input('tags', sql.NVarChar, tags);
    await request.query(query);
    res.status(201).send('Cab added successfully.');
  } catch (err) {
    res.status(500).send('Error adding cab: ' + err);
  }
});

cablistRouter.put('/update/:id', imageUpload, async (req, res) => {
  const { id } = req.params;
  const { name, passengers, luggageCarry, airCondition , tags} = req.body;
  const carImage = req.file ? req.file.filename : null;

  let query = `
    UPDATE dbo.cablist 
    SET name = @name, passengers = @passengers, 
    luggageCarry = @luggageCarry, airCondition = @airCondition, tags = @tags
  `;

  if (carImage) {
    query += `, carImage = @carImage`;
  }

  query += ` WHERE id = @id`;

  try {
    // Ensure database connection
    await dbConnect;

    const request = new sql.Request();
    request.input('id', sql.NVarChar, id);
    request.input('name', sql.NVarChar, name);
    request.input('passengers', sql.Int, passengers);
    request.input('luggageCarry', sql.Int, luggageCarry);
    if (carImage) {
      request.input('carImage', sql.NVarChar, carImage);
    }
    request.input('airCondition', sql.NVarChar, airCondition);
    request.input('tags', sql.NVarChar, tags);

    console.log('Executing Query:', query);
    console.log('Query Parameters:', {
      id,
      name,
      passengers,
      luggageCarry,
      airCondition,
      carImage
    });

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Cab not found.');
    }

    res.send('Cab updated successfully.');
  } catch (err) {
    console.error('Error updating cab:', err);
    res.status(500).send('Error updating cab: ' + err.message);
  }
});



// DELETE: Remove a cab from cablist
cablistRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM dbo.cablist WHERE id = @id`;

  try {
    // Ensure database connection
    await dbConnect;

    const request = new sql.Request();
    request.input('id', sql.NVarChar, id);
    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Cab not found.');
    }

    return  res.send('Cab deleted successfully.');
  } catch (err) {
    console.error('Error deleting cab:', err);
    return  res.status(500).send('Error deleting cab: ' + err.message);
  }
});


// GET: Retrieve all cabs from cablist
cablistRouter.get('/get', async (req, res) => {
  const query = `SELECT * FROM dbo.cablist`;

  try {
    const request = new sql.Request();
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    return  res.status(500).send('Error retrieving cabs: ' + err);
  }
});


// GET: Retrieve a specific cab by ID
cablistRouter.get('/get/:id', async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM dbo.cablist WHERE id = @id`;

  try {
    const request = new sql.Request();
    request.input('id', sql.NVarChar, id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).send('Cab not found.');
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send('Error retrieving cab: ' + err);
  }
});

export default cablistRouter;