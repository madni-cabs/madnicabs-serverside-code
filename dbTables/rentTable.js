import { sql, dbConnect } from '../database/dbConnect.js';

// Define the RentTable model
const createRentTable = async () => {
  await dbConnect; // Ensure database is connected

  const checkTableQuery = `
    SELECT * FROM sysobjects WHERE name='renttable' and xtype='U';
  `;

  const createTableQuery = `
    CREATE TABLE renttable (
      id NVARCHAR(255) NOT NULL,
      pickupLocation NVARCHAR(255) NOT NULL,
      dropLocation NVARCHAR(255) NOT NULL,
      cab_name NVARCHAR(255) NOT NULL,
      rent INT NOT NULL
    );
  `;

  try {
    const request = new sql.Request();
    const result = await request.query(checkTableQuery);

    if (result.recordset.length > 0) {
      console.log('Table "renttable" already exists.');
    } else {
      await request.query(createTableQuery);
      console.log('Table "renttable" has been created.');
    }
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

export default createRentTable;
