
// lib/db.js
import mysql from 'mysql2/promise';

// Membuat koneksi pool ke MySQL database
const db = mysql.createPool({
  host: process.env.DB_HOST,       // Host database (misalnya localhost atau IP server)
  user: process.env.DB_USER,       // Nama pengguna database
  password: process.env.DB_PASS,   // Kata sandi pengguna
  database: process.env.DB_NAME,   // Nama database yang digunakan
});

export default db;