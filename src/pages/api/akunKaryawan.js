import db from '../../lib/db';

export default async function handler(req, res) {
    const apiKey = req.headers['apikey'];
    const envApiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (req.method == 'GET') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        try {
            const [rows] = await db.query('SELECT id, username, no_wa, role, nama_lengkap, alamat FROM tbl_user WHERE role = "karyawan"');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    }else if (req.method == 'PUT') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { updatedId, updatedUsername, updatedWa, updatedNama, updatedAlamat } = req.body;
        try {
            const [checkDuplicate] = await db.query('SELECT username FROM tbl_user WHERE username = ? AND id != ?', [updatedUsername, updatedId]);
            if (checkDuplicate.length > 0) {
                return res.status(409).json({ error: 'Username sudah digunakan' });
            }

            await db.query('UPDATE tbl_user SET username = ?, no_wa = ?, nama_lengkap = ?, alamat = ? WHERE tbl_user.id = ?', [updatedUsername, updatedWa, updatedNama, updatedAlamat, updatedId]);
            res.status(200).json({ message: 'Akun berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal memperbarui akun' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}