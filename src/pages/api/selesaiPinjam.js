// pages/api/users.js
import db from '../../lib/db';

export default async function handler(req, res) {
    try {
        // Melakukan query ke database
        const [rows] = await db.query('SELECT r.*, a.nama, u.nama_lengkap, u.no_wa FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_user u ON r.id_user = u.id ORDER BY r.tgl_pengembalian DESC');
        
        res.status(200).json(rows);  // Mengirim data ke client
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });  // Menangani error
    }
}