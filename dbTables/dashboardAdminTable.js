// dbTables/dashboardAdmin.js
import { sql, dbConnect } from '../database/dbConnect.js';

// Define the Cab model
const createDashBoardAdminTable = async () => {
  await dbConnect; // Ensure database is connected

  const checkTableQuery = `
    SELECT * FROM sysobjects WHERE name='dashboardAdmin' and xtype='U';
  `;

  const createTableQuery = `
  CREATE TABLE dashboardAdmin (
    id NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    uniqueID NVARCHAR(255) NOT NULL,
  );
`;


  try {
    const request = new sql.Request();
    const result = await request.query(checkTableQuery);

    if (result.recordset.length > 0) {
      console.log('Table "dashboardAdmin" already exists.');
    } else {
      await request.query(createTableQuery);
      console.log('Table "dashboardAdmin" has been created.');
    }
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

export default createDashBoardAdminTable;
