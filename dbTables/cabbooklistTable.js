import { sql, dbConnect } from '../database/dbConnect.js';

// Define the CabBookList model
const createCabBookListTable = async () => {
  await dbConnect; // Ensure database is connected

  const checkTableQuery = `
    SELECT * FROM sysobjects WHERE name='cabbooklist' and xtype='U';
  `;

  const createTableQuery = `
    CREATE TABLE cabbooklist (
      id NVARCHAR(255) NOT NULL,
      pickup_location NVARCHAR(255) NOT NULL,
      drop_location NVARCHAR(255) NOT NULL,
      cabname NVARCHAR(255) NOT NULL,
      pickup_date NVARCHAR(100) NOT NULL,
      pickup_time NVARCHAR(100) NOT NULL,
      full_name NVARCHAR(255) NOT NULL,
      email NVARCHAR(255) NOT NULL,
      phone_number NVARCHAR(50) NOT NULL,
      country NVARCHAR(100) NOT NULL,
      rent INT,
      message NVARCHAR(MAX),
      status NVARCHAR(50) DEFAULT 'Pending'
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
