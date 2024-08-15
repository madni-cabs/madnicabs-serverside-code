// dbTables/cabListTable.js
import { sql, dbConnect } from '../database/dbConnect.js';

// Define the Cab model
const createCabTable = async () => {
  await dbConnect; // Ensure database is connected

  const checkTableQuery = `
    SELECT * FROM sysobjects WHERE name='cablist' and xtype='U';
  `;

  const createTableQuery = `
  CREATE TABLE cablist (
    id NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NOT NULL,
    passengers INT NOT NULL,
    luggageCarry INT NOT NULL,
    carImage NVARCHAR(255),
    airCondition NVARCHAR(255) NOT NULL,
    tags NVARCHAR(MAX)
  );
`;


  try {
    const request = new sql.Request();
    const result = await request.query(checkTableQuery);

    if (result.recordset.length > 0) {
      console.log('Table "cablist" already exists.');
    } else {
      await request.query(createTableQuery);
      console.log('Table "cablist" has been created.');
    }
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

export default createCabTable;
