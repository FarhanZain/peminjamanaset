import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const [rows] = await db.query('SELECT b.id AS id_beranda, a.id AS id_aset, b.*, a.* FROM tbl_beranda b JOIN tbl_aset a ON b.id_aset = a.id');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else if (req.method == 'POST') {
        const { pinjamIdBeranda, pinjamIdAset, pinjamIdUser, pinjamPengajuan, pinjamMulai, pinjamSelesai, pinjamAlasan, pinjamUnit } = req.body;
        try {
            await db.query('INSERT INTO tbl_riwayat (id_aset, id_user, tgl_mulai, tgl_selesai, tgl_pengajuan, alasan, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [pinjamIdAset, pinjamIdUser, pinjamMulai, pinjamSelesai, pinjamPengajuan, pinjamAlasan, "Menunggu Konfirmasi"]);

            await db.query('UPDATE tbl_beranda SET stok = ? WHERE tbl_beranda.id = ?', ["Tidak Tersedia", pinjamIdBeranda]);

            const [nomor] = await db.query('SELECT no_wa FROM tbl_user WHERE unit = ?', [pinjamUnit]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal meminjam aset' });
        }
    }else if (req.method == 'PUT') {
        const { idRiwayat, idAset, unitAset } = req.body;
        try {
            await db.query('UPDATE tbl_riwayat SET status = ? WHERE tbl_riwayat.id = ?', ["Dibatalkan", idRiwayat]);

            await db.query('UPDATE tbl_beranda SET stok = ? WHERE tbl_beranda.id_aset = ?', ["Tersedia", idAset]);

            const [nomor] = await db.query('SELECT no_wa FROM tbl_user WHERE unit = ?', [unitAset]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal membatalkan peminjaman aset' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}