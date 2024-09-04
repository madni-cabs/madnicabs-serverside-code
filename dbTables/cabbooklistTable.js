import { sql, dbConnect } from '../database/dbConnect.js';

// Define the CabBookList model
const createCabBookListTable = async () => {
  await dbConnect; // Ensure the database is connected

  const checkTableQuery = `
    SELECT * FROM sysobjects WHERE name='cabbooklist' and xtype='U';
  `;

  const createTableQuery = `
    CREATE TABLE cabbooklist (
      id NVARCHAR(255) NOT NULL PRIMARY KEY,
      pickup_location NVARCHAR(255),
      drop_location NVARCHAR(255),
      rent INT,
      pickup_date NVARCHAR(100),
      pickup_time NVARCHAR(100),
      full_name NVARCHAR(255),
      email NVARCHAR(255),
      phone_number NVARCHAR(50),
      country NVARCHAR(100),
      message NVARCHAR(MAX),
      status NVARCHAR(50),
      cab_name NVARCHAR(255),
      created_date NVARCHAR(255),
      created_time NVARCHAR(255),
      updated_date NVARCHAR(255),
      updated_time NVARCHAR(255),
      cancel_reason NVARCHAR(255),
      cancelled_by NVARCHAR(50)
    );
  `;

  try {
    const request = new sql.Request();
    const result = await request.query(checkTableQuery);

    if (result.recordset.length > 0) {
      console.log('Table "cabbooklist" already exists.');
    } else {
      await request.query(createTableQuery);
      console.log('Table "cabbooklist" has been created.');
    }
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

export default createCabBookListTable;
