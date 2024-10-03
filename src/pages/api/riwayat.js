import db from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const token = req.cookies.auth;
    const decoded = jwt.verify(token, '!iniTokenRAHASIApeminjaman@set?');
    
    if (req.method == 'GET') {
        try {
            const [rows] = await db.query('SELECT r.id AS id_riwayat, a.id AS id_aset, un.id AS id_units, k.id AS id_kategoris, r.*, a.*, un.*, k.* FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_kategori k ON a.id_kategori = k.id WHERE r.id_user = ?', [decoded.id]);
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else if (req.method == 'PUT') {
        const { idRiwayat, unitAset, tglPengembalian } = req.body;
        try {
            await db.query('UPDATE tbl_riwayat SET tgl_pengembalian = ?, status_pinjam = ? WHERE tbl_riwayat.id = ?', [tglPengembalian, "Dikembalikan", idRiwayat]);

            const [nomor] = await db.query('SELECT no_wa FROM tbl_user WHERE id_unit = ?', [unitAset]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal membatalkan peminjaman aset' });
        }
    }else if (req.method == 'PATCH') {
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