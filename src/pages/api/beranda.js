// pages/api/users.js
import db from '../../lib/db';

export default async function handler(req, res) {
    try {
        // Melakukan query ke database
        const [rows] = await db.query('SELECT b.*, a.* FROM tbl_beranda b JOIN tbl_aset a ON b.id_aset = a.id');
        
        res.status(200).json(rows);  // Mengirim data ke client
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });  // Menangani error
    }
}