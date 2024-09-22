// pages/api/users.js
import db from '../../lib/db';

export default async function handler(req, res) {
    try {
        // Melakukan query ke database
        const [rows] = await db.query('SELECT * FROM tbl_user WHERE role = "karyawan"');
        
        res.status(200).json(rows);  // Mengirim data ke client
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });  // Menangani error
    }
}