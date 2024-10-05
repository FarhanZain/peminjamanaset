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
            const [rows] = await db.query('SELECT un.unit, u.id, u.username, u.no_wa, u.role, u.status FROM tbl_user u LEFT JOIN tbl_unit un ON u.id_unit = un.id WHERE role IN ("admin", "superadmin")');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal mengambil data' });
        }
    }else if (req.method === 'POST') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { levelAdmin, usernameAdmin, waAdmin, unitAdmin } = req.body;
        const templatePassword = "adminASETyuab";
        const passwordAdmin = await bcrypt.hash(templatePassword, 10);
        try {
            const [checkDuplicate] = await db.query('SELECT username FROM tbl_user WHERE username = ?', [usernameAdmin]);
            if (checkDuplicate.length > 0) {
                return res.status(409).json({ error: 'Username sudah digunakan' });
            }
            await db.query('INSERT INTO tbl_user (username, password, no_wa, role, id_unit, status) VALUES (?, ?, ?, ?, ?, ?)', [usernameAdmin, passwordAdmin, waAdmin, levelAdmin, unitAdmin, "Aktif"]);
            res.status(200).json({ message: 'Admin berhasil ditambahkan' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menambahkan admin' });
        }
    }else if (req.method === 'DELETE') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { deletedId } = req.body;
        try {
            await db.query('DELETE FROM tbl_user WHERE id = ?', [deletedId]);
            res.status(200).json({ message: 'Admin berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menghapus admin' });
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