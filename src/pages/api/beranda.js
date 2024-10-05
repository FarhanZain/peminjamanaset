import db from '../../lib/db';

export default async function handler(req, res) {
    const apiKey = req.headers['apikey'];
    const envApiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (req.method == 'GET') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        try {
            const [rows] = await db.query('SELECT a.*, un.id AS id_units, un.unit, k.id AS id_kategoris, k.kategori FROM tbl_aset a JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_kategori k ON a.id_kategori = k.id');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else if (req.method == 'POST') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { pinjamIdAset, pinjamIdUser, pinjamPengajuan, pinjamMulai, pinjamSelesai, pinjamKeperluan, pinjamUnit } = req.body;
        try {
            await db.query('INSERT INTO tbl_riwayat (id_aset, id_user, tgl_mulai, tgl_selesai, tgl_pengajuan, keperluan, status_pinjam) VALUES (?, ?, ?, ?, ?, ?, ?)', [pinjamIdAset, pinjamIdUser, pinjamMulai, pinjamSelesai, pinjamPengajuan, pinjamKeperluan, "Menunggu Konfirmasi"]);

            const [nomor] = await db.query('SELECT no_wa FROM tbl_user WHERE id_unit = ?', [pinjamUnit]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal meminjam aset' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}