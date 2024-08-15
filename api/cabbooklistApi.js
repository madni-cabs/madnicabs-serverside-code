import express from 'express';
import { sql, dbConnect } from '../database/dbConnect.js';

const cabBookRouter = express.Router();

// Generate a unique 4-digit ID based on the current timestamp
const generateId = () => {
  const timestamp = Date.now().toString();
  return timestamp.slice(-6); // Get the last 4 digits
};

// POST - Create a new cab booking
cabBookRouter.post('/add', async (req, res) => {
  const {
    pickup_location,
    drop_location,
    pickup_date,
    pickup_time,
    full_name,
    email,
    phone_number,
    country,
    distance,
    rent,
    message,
    status = 'Pending'
  } = req.body;
  const id = generateId();

  try {
    await dbConnect;
    const request = new sql.Request();
    const query = `
      INSERT INTO cabbooklist (id,pickup_location, drop_location, pickup_date, pickup_time, full_name, email, phone_number, country, distance, rent, message, status)
      VALUES (@id,@pickup_location, @drop_location, @pickup_date, @pickup_time, @full_name, @Email, @phone_number, @country, @distance, @rent, @message, @status)
    `;
    request.input('id', sql.NVarChar, id);
    request.input('pickup_location', sql.NVarChar, pickup_location);
    request.input('drop_location', sql.NVarChar, drop_location);
    request.input('pickup_date', sql.NVarChar, pickup_date);
    request.input('pickup_time', sql.NVarChar, pickup_time);
    request.input('full_name', sql.NVarChar, full_name);
    request.input('email', sql.NVarChar, email);
    request.input('phone_number', sql.NVarChar, phone_number);
    request.input('country', sql.NVarChar, country);
    request.input('distance', sql.Float, distance);
    request.input('rent', sql.Int, rent);
    request.input('message', sql.NVarChar, message);
    request.input('status', sql.NVarChar, status);

    await request.query(query);

    res.status(201).json({ message: 'Booking created successfully' });
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

// GET - Get cab booking by ID
cabBookRouter.get('/get/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await dbConnect;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
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

// PUT - Update cab booking by ID
cabBookRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const {
    pickup_location,
    drop_location,
    pickup_date,
    pickup_time,
    full_name,
    email,
    phone_number,
    country,
    distance,
    rent,
    message,
    status
  } = req.body;

  try {
    await dbConnect;
    const request = new sql.Request();
    request.input('id', sql.NVarChar, id);
    request.input('pickup_location', sql.NVarChar, pickup_location);
    request.input('drop_location', sql.NVarChar, drop_location);
    request.input('pickup_date', sql.Date, pickup_date);
    request.input('pickup_time', sql.Time, pickup_time);
    request.input('full_name', sql.NVarChar, full_name);
    request.input('email', sql.NVarChar, email);
    request.input('phone_number', sql.NVarChar, phone_number);
    request.input('country', sql.NVarChar, country);
    request.input('distance', sql.Float, distance);
    request.input('rent', sql.Int, rent);
    request.input('message', sql.NVarChar, message);
    request.input('status', sql.NVarChar, status);

    const query = `
      UPDATE cabbooklist
      SET pickup_location = @pickup_location,
          drop_location = @drop_location,
          pickup_date = @pickup_date,
          pickup_time = @pickup_time,
          full_name = @full_name,
          email = @email,
          phone_number = @phone_number,
          country = @country,
          distance = @distance,
          rent = @rent,
          message = @message,
          status = @status
      WHERE id = @id
    `;

    await request.query(query);

    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating booking', details: err.message });
  }
});

// DELETE - Delete cab booking by ID
cabBookRouter.delete('delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await dbConnect;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    const query = 'DELETE FROM cabbooklist WHERE id = @id';

    await request.query(query);

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting booking', details: err.message });
  }
});

export default cabBookRouter;
