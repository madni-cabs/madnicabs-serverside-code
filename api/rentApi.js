import express from "express";
import sql from "mssql";
import { dbConnect } from "../database/dbConnect.js";

const rentRouter = express.Router();

// Connect to the database
dbConnect;

// Generate a unique 4-digit ID based on the current timestamp
const generateId = () => {
  const timestamp = Date.now().toString();
  return timestamp.slice(-4); // Get the last 4 digits
};

// Create a fare
rentRouter.post("/add", async (req, res) => {
  const { pickupLocation, dropLocation, cab_name, rent } = req.body;
  const id = generateId();

  const query = `
    INSERT INTO renttable (id, pickupLocation, dropLocation, cab_name, rent)
    VALUES (@id, @pickupLocation, @dropLocation, @cab_name, @rent)
  `;

  try {
    const request = new sql.Request();
    request.input("id", sql.VarChar, id);
    request.input("pickupLocation", sql.VarChar, pickupLocation);
    request.input("dropLocation", sql.VarChar, dropLocation);
    request.input("cab_name", sql.VarChar, cab_name);
    request.input("rent", sql.Int, rent);
    await request.query(query);
    res.status(201).json({ id, pickupLocation, dropLocation, cab_name, rent });
    console.log(res);
  } catch (err) {
    console.error("Error creating fare record:", err);
    res.status(500).json({ error: "Error creating fare record" });
  }
});

// Get all fares
rentRouter.get("/get", async (req, res) => {
  const query = `SELECT * FROM renttable`;

  try {
    const request = new sql.Request();
    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving fare records" });
  }
});

// Get a fare by ID
rentRouter.get("/get/:id", async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT * FROM renttable WHERE id='${id}'
  `;

  try {
    const request = new sql.Request();
    const result = await request.query(query);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Rent record not found" });
    }
  } catch (err) {
    res.status (500).json({ error: "Error retrieving rent record" });
  }
});

// Update a fare by ID
rentRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { pickupLocation, dropLocation, cab_name, rent } = req.body;

  const query = `
    UPDATE renttable
    SET pickupLocation='${pickupLocation}', dropLocation='${dropLocation}', cab_name='${cab_name}', rent='${rent}'
    WHERE id='${id}'
  `;

  try {
    const request = new sql.Request();
    await request.query(query);
    res.status(200).json({ id, pickupLocation, dropLocation, cab_name, rent });
  } catch (err) {
    res.status(500).json({ error: "Error updating fare record" });
  }
});

// Delete a fare by ID
rentRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM renttable WHERE id='${id}'
  `;

  try {
    const request = new sql.Request();
    await request.query(query);
    res.status(200).json({ message: "Fare record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting fare record" });
  }
});

// Get distinct drop locations based on pickupLocation and cab_name
rentRouter.get("/locations/:pickupLocation", async (req, res) => {
  const { pickupLocation } = req.params;
  const { cab_name } = req.query; // Use a query parameter for cab_name

  const query = `
      SELECT DISTINCT dropLocation FROM renttable WHERE pickupLocation=@pickupLocation AND cab_name=@cab_name
  `;

  try {
    const request = new sql.Request();
    request.input("pickupLocation", sql.VarChar, pickupLocation);
    request.input("cab_name", sql.VarChar, cab_name);
    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error retrieving drop locations:", err);
    res.status(500).json({ error: "Error retrieving drop locations" });
  }
});

// Get rent and cab_name for a specific pickup and drop location
rentRouter.get("/rent-distance", async (req, res) => {
  const { pickup, drop, cab_name } = req.query;

  const query = `
      SELECT rent FROM renttable 
      WHERE pickupLocation=@pickup AND dropLocation=@drop AND cab_name=@cab_name
  `;

  try {
    const request = new sql.Request();
    request.input("pickup", sql.VarChar, pickup);
    request.input("drop", sql.VarChar, drop);
    request.input("cab_name", sql.VarChar, cab_name);
    const result = await request.query(query);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "No fare found for the selected locations and cab" });
    }
  } catch (err) {
    console.error("Error retrieving rent:", err);
    res.status(500).json({ error: "Error retrieving rent" });
  }
});


export default rentRouter;
