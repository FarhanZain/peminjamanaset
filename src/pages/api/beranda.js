import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const [rows] = await db.query('SELECT a.*, un.id AS id_units, un.unit, k.id AS id_kategoris, k.kategori FROM tbl_aset a JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_kategori k ON a.id_kategori = k.id');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else if (req.method == 'POST') {
        const { pinjamIdAset, pinjamIdUser, pinjamPengajuan, pinjamMulai, pinjamSelesai, pinjamKeperluan, pinjamUnit } = req.body;
        try {
            await db.query('INSERT INTO tbl_riwayat (id_aset, id_user, tgl_mulai, tgl_selesai, tgl_pengajuan, keperluan, status_pinjam) VALUES (?, ?, ?, ?, ?, ?, ?)', [pinjamIdAset, pinjamIdUser, pinjamMulai, pinjamSelesai, pinjamPengajuan, pinjamKeperluan, "Menunggu Konfirmasi"]);

            const [nomor] = await db.query('SELECT no_wa FROM tbl_user WHERE id_unit = ?', [pinjamUnit]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal meminjam aset' });
        }
    }else if (req.method == 'PUT') {
        const { idRiwayat, unitAset } = req.body;
        try {
            await db.query('UPDATE tbl_riwayat SET status_pinjam = ? WHERE tbl_riwayat.id = ?', ["Dibatalkan", idRiwayat]);

            const [nomor] = await db.query('SELECT no_wa FROM tbl_user WHERE id_unit = ?', [unitAset]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal membatalkan peminjaman aset' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}