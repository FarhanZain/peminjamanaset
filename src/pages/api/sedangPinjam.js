import db from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const token = req.cookies.auth;
    const decoded = jwt.verify(token, '!iniTokenRAHASIApeminjaman@set?');

    if (req.method == 'GET') {
        try {
            if (decoded.unit) {
                const [rows] = await db.query('SELECT r.*, a.id AS id_asets, a.nama, un.id AS id_units, un.unit, u.id AS id_users, u.nama_lengkap, u.no_wa FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_user u ON r.id_user = u.id WHERE r.status_pinjam IN (?, ?) AND un.unit = ? ORDER BY r.tgl_pengajuan ASC', ['Disetujui', 'Jatuh Tempo', decoded.unit]);
                res.status(200).json(rows);
            } else {
                const [rows] = await db.query('SELECT r.*, a.id AS id_asets, a.nama, un.id AS id_units, un.unit, u.id AS id_users, u.nama_lengkap, u.no_wa FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_user u ON r.id_user = u.id WHERE r.status_pinjam IN (?, ?) ORDER BY r.tgl_pengajuan ASC', ['Disetujui', 'Jatuh Tempo']);
                res.status(200).json(rows);
            }
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}