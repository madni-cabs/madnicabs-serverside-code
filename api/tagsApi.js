import express from "express";
import sql from "mssql";
import { dbConnect } from "../database/dbConnect.js";

const tagsrouter = express.Router();

// Connect to the database
dbConnect;

// Generate a unique 4-digit ID based on the current timestamp
const generateId = () => {
  const timestamp = Date.now().toString();
  return timestamp.slice(-4); // Get the last 4 digits
};

// Create a tag
tagsrouter.post("/add", async (req, res) => {
  const { name } = req.body;
  const id = generateId();

  const query = `
    INSERT INTO tagtable (id, name)
    VALUES ('${id}', '${name}')
  `;

  try {
    const request = new sql.Request();
    await request.query(query);
    res.status(201).json({ id, name });
  } catch (err) {
    res.status(500).json({ error: "Error creating tag" });
  }
});

// Get all tags
tagsrouter.get("/get", async (req, res) => {
  const query = `SELECT * FROM tagtable`;

  try {
    const request = new sql.Request();
    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving tags" });
  }
});

// Get a tag by ID
tagsrouter.get("/get/:id", async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT * FROM tagtable WHERE id='${id}'
  `;

  try {
    const request = new sql.Request();
    const result = await request.query(query);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Tag not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error retrieving tag" });
  }
});

// Update a tag by ID
tagsrouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const query = `
    UPDATE tagtable SET name='${name}' WHERE id='${id}'
  `;

  try {
    const request = new sql.Request();
    await request.query(query);
    res.status(200).json({ id, name });
  } catch (err) {
    res.status(500).json({ error: "Error updating tag" });
  }
});

// Delete a tag by ID
tagsrouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM tagtable WHERE id='${id}'
  `;

  try {
    const request = new sql.Request();
    await request.query(query);
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting tag" });
  }
});

export default tagsrouter;