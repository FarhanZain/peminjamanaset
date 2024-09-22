// pages/api/users.js
import db from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const token = req.cookies.auth;
    const decoded = jwt.verify(token, '!iniTokenRAHASIApeminjaman@set?');
    
    try {
        // Melakukan query ke database
        const [rows] = await db.query('SELECT r.*, a.* FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id WHERE r.id_user = ?', [decoded.id]);
        
        res.status(200).json(rows);  // Mengirim data ke client
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });  // Menangani error
    }
}