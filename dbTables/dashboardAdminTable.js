// dbTables/dashboardAdmin.js
import { sql, dbConnect } from '../database/dbConnect.js';

const createDashBoardAdminTable = async () => {
  await dbConnect;

  const checkTableQuery = `
    SELECT * FROM sysobjects WHERE name='dashboardAdmin' and xtype='U';
  `;

  const createTableQuery = `
  CREATE TABLE dashboardAdmin (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    picture NVARCHAR(255),
    token NVARCHAR(255)
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
