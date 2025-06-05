import mysql from "mysql2/promise";

if (!process.env.DB_HOST) throw new Error('DB_HOST is not defined');
if (!process.env.DB_USER) throw new Error('DB_USER is not defined');
if (!process.env.DB_PASSWORD) throw new Error('DB_PASSWORD is not defined');
if (!process.env.DB_NAME) throw new Error('DB_NAME is not defined');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;
