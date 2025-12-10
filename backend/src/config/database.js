import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const pool = mysql2.createPool({
  host: host,
  database: database,
  user: user,
  password: password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
