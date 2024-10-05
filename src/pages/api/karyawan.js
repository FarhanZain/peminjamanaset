import db from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    const apiKey = req.headers['apikey'];
    const envApiKey = process.env.NEXT_PUBLIC_API_KEY;
    
    if (req.method === 'GET') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        try {
            const [rows] = await db.query('SELECT id, username, nama_lengkap, alamat, no_wa, status FROM tbl_user WHERE role = "karyawan"');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    }else if (req.method === 'POST') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { namaKaryawan, alamatKaryawan, waKaryawan } = req.body;
        const templatePassword = "karyawanYUAB";
        const passwordKaryawan = await bcrypt.hash(templatePassword, 10);
        try {
            const [rows] = await db.query(`SELECT username FROM tbl_user WHERE username LIKE 'karyawan%' ORDER BY CAST(SUBSTRING(username, 9) AS UNSIGNED) DESC LIMIT 1`);
            let lastNumber = 0;
            if (rows.length > 0) {
                const lastUsername = rows[0].username;
                lastNumber = parseInt(lastUsername.replace('karyawan', ''), 10);
            }
            const usernameKaryawan = `karyawan${lastNumber + 1}`;

            const [checkDuplicate] = await db.query('SELECT username FROM tbl_user WHERE username = ?', [usernameKaryawan]);
            if (checkDuplicate.length > 0) {
                return res.status(409).json({ error: 'Username sudah digunakan' });
            }

            await db.query('INSERT INTO tbl_user (username, password, no_wa, role, status, nama_lengkap, alamat) VALUES (?, ?, ?, ?, ?, ?, ?)', [usernameKaryawan, passwordKaryawan, waKaryawan, "karyawan", "Aktif", namaKaryawan, alamatKaryawan]);
            res.status(201).json({ message: 'Karyawan berhasil ditambahkan' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menambahkan karyawan' });
        }
    }else if (req.method === 'DELETE') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { deletedId } = req.body;
        try {
            await db.query('DELETE FROM tbl_user WHERE id = ?', [deletedId]);
            res.status(200).json({ message: 'Karyawan berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menghapus karyawan' });
        }
    }else if (req.method === 'PUT') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { updatedId, updatedStatus } = req.body;
        try {
            await db.query('UPDATE tbl_user SET status = ? WHERE tbl_user.id = ?', [updatedStatus, updatedId]);
            res.status(200).json({ message: 'Status berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal memperbarui status' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}