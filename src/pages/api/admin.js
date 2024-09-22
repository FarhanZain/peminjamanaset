// pages/api/users.js
import db from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const [rows] = await db.query('SELECT id, username, no_wa, role, unit, status FROM tbl_user WHERE role IN ("admin", "superadmin")');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal mengambil data' });
        }
    }else if (req.method === 'POST') {
        const { levelAdmin, usernameAdmin, waAdmin, unitAdmin } = req.body;
        const templatePassword = "adminASETyuab";
        const passwordAdmin = await bcrypt.hash(templatePassword, 10);
        try {
            const [checkDuplicate] = await db.query('SELECT username FROM tbl_user WHERE username = ?', [usernameAdmin]);
            if (checkDuplicate.length > 0) {
                return res.status(409).json({ error: 'Username sudah digunakan' });
            }
            await db.query('INSERT INTO tbl_user (username, password, no_wa, role, unit, status) VALUES (?, ?, ?, ?, ?, ?)', [usernameAdmin, passwordAdmin, waAdmin, levelAdmin, unitAdmin, "Aktif"]);
            res.status(201).json({ message: 'Admin berhasil ditambahkan' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menambahkan admin' });
        }
    }else if (req.method === 'DELETE') {
        const { deletedId } = req.body;
        try {
            await db.query('DELETE FROM tbl_user WHERE id = ?', [deletedId]);
            res.status(200).json({ message: 'Admin berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menghapus admin' });
        }
    }else if (req.method === 'PUT') {
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