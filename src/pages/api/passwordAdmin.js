import db from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method == 'PUT') {
        const { updatedId, updatedPassword } = req.body;
        try {
            const passwordAdmin = await bcrypt.hash(updatedPassword, 10);
            await db.query('UPDATE tbl_user SET password = ? WHERE tbl_user.id = ?', [passwordAdmin, updatedId]);
            res.status(200).json({ message: 'Password berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal memperbarui password' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}