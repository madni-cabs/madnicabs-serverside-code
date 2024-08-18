import { sql, dbConnect } from '../database/dbConnect.js';

// Define the EmailValidations model
const createEmailValidationsTable = async () => {
  await dbConnect; // Ensure database is connected

  const checkTableQuery = `
    SELECT * FROM sysobjects WHERE name='email_validations' and xtype='U';
  `;

  const createTableQuery = `
    CREATE TABLE email_validations (
      id NVARCHAR(255) NOT NULL PRIMARY KEY,
      email NVARCHAR(255) NOT NULL,
      validation_password NVARCHAR(6) NOT NULL,
      created_at DATETIME NOT NULL
    );
  `;

  try {
    const request = new sql.Request();
    const result = await request.query(checkTableQuery);

    if (result.recordset.length > 0) {
      console.log('Table "email_validations" already exists.');
    } else {
      await request.query(createTableQuery);
      console.log('Table "email_validations" has been created.');
    }
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

export default createEmailValidationsTable;
