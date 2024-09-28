import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const [rows] = await db.query('SELECT r.*, a.nama, a.unit, u.nama_lengkap, u.no_wa FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_user u ON r.id_user = u.id ORDER BY r.tgl_pengajuan DESC');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else if (req.method == 'PUT') {
        const { idRiwayat, idUser } = req.body;
        try {
            await db.query('UPDATE tbl_riwayat SET status = ? WHERE tbl_riwayat.id = ?', ["Sedang Dipinjam", idRiwayat]);

            const [nomor] = await db.query('SELECT no_wa FROM tbl_user WHERE id = ?', [idUser]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal membatalkan peminjaman aset' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}