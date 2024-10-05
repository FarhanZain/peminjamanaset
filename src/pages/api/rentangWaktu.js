import db from '../../lib/db';

export default async function handler(req, res) {
    const apiKey = req.headers['apikey'];
    const envApiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (req.method == 'GET') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        try {
            const [rows] = await db.query('SELECT r.id AS id_riwayat, a.id AS id_aset, un.id AS id_units, k.id AS id_kategoris, r.*, a.*, un.*, k.* FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_kategori k ON a.id_kategori = k.id ORDER BY r.tgl_mulai ASC');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
    
}