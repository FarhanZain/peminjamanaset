import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const [rows] = await db.query('SELECT un.unit, u.id, u.username, u.no_wa, u.role, u.status FROM tbl_user u LEFT JOIN tbl_unit un ON u.id_unit = un.id WHERE u.role IN ("admin", "superadmin")');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    }else if (req.method == 'PUT') {
        const { updatedId, updatedUsername, updatedWa } = req.body;
        try {
            const [checkDuplicate] = await db.query('SELECT username FROM tbl_user WHERE username = ?', [updatedUsername]);
            if (checkDuplicate.length > 0) {
                return res.status(409).json({ error: 'Username sudah digunakan' });
            }

            await db.query('UPDATE tbl_user SET username = ?, no_wa = ? WHERE tbl_user.id = ?', [updatedUsername, updatedWa, updatedId]);
            res.status(200).json({ message: 'Profil berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal memperbarui profil' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}