// routes/auth.js
import express from 'express';
import { sql, dbConnect } from '../database/dbConnect.js';
import crypto from 'crypto';

const dashboardAdminRouter = express.Router();

dashboardAdminRouter.post('/login', async (req, res) => {
  await dbConnect;

  const { name, password } = req.body;

  try {
    const request = new sql.Request();
    const query = `
      SELECT * FROM dashboardAdmin WHERE name = @name AND password = @password;
    `;
    request.input('name', sql.NVarChar, name);
    request.input('password', sql.NVarChar, password);
    const result = await request.query(query);

    if (result.recordset.length > 0) {
      const token = crypto.randomBytes(7).toString('hex'); // Generate a 14-character token
      const updateQuery = `
        UPDATE dashboardAdmin SET token = @token WHERE id = @id;
      `;
      request.input('token', sql.NVarChar, token);
      request.input('id', sql.Int, result.recordset[0].id);
      await request.query(updateQuery);

      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// routes/auth.js (continued)
dashboardAdminRouter.post('/logout', async (req, res) => {
    await dbConnect;
  
    const { token } = req.body;
  
    try {
      const request = new sql.Request();
      const query = `
        UPDATE dashboardAdmin SET token = NULL WHERE token = @token;
      `;
      request.input('token', sql.NVarChar, token);
      const result = await request.query(query);
  
      if (result.rowsAffected[0] > 0) {
        res.json({ success: true, message: 'Logged out successfully' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid token' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

export default dashboardAdminRouter;
