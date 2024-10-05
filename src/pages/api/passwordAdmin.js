import db from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    const apiKey = req.headers['apikey'];
    const envApiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (req.method == 'PUT') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
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