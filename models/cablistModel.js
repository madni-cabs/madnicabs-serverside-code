// // models/cablistModel.js
// import { Sequelize, DataTypes } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_DATABASE,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_SERVER,
//     dialect: process.env.DB_DIALECT,
//     port: process.env.DB_PORT,
//     dialectOptions: {
//       encrypt: true, // Use encryption if necessary
//     },
//     logging: console.log, // Enable query logging
//   }
// );

// const Cab = sequelize.define('Cab', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   fair: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   passengers: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   luggageCarry: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   carImage: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   airCondition: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//   },
// }, {
//   tableName: 'cablist',
// });

// export default Cab;
