import db from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const token = req.cookies.auth;
    const decoded = jwt.verify(token, '!iniTokenRAHASIApeminjaman@set?');

    if (req.method == 'GET') {
        try {
            if (decoded.unit) {
                const [rows] = await db.query('SELECT r.*, a.id AS id_asets, a.nama, un.id AS id_units, un.unit, u.id AS id_users, u.nama_lengkap, u.no_wa FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_user u ON r.id_user = u.id WHERE r.status_pinjam = ? AND un.unit = ? ORDER BY r.tgl_pengajuan ASC', ['Dikembalikan', decoded.unit]);
            res.status(200).json(rows);
            } else {
                const [rows] = await db.query('SELECT r.*, a.id AS id_asets, a.nama, un.id AS id_units, un.unit, u.id AS id_users, u.nama_lengkap, u.no_wa FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_user u ON r.id_user = u.id WHERE r.status_pinjam = ? ORDER BY r.tgl_pengajuan ASC', ['Dikembalikan']);
                res.status(200).json(rows);
            }
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else if (req.method == 'PATCH') {
        const { idRiwayat } = req.body;
        try {
            await db.query('UPDATE tbl_riwayat SET status_pinjam = ? WHERE tbl_riwayat.id = ?', ["Selesai", idRiwayat]);

            res.status(200).json({message: 'Berhasil menyelesaikan peminjaman'});
        } catch (error) {
            res.status(500).json({ error: 'Gagal menyelesaikan peminjaman aset' });
        }
    }else if (req.method == 'PUT') {
        const { idMasalah, textCatatan, idUser } = req.body;
        try {
            await db.query('UPDATE tbl_riwayat SET status_pinjam = ?, catatan = ? WHERE tbl_riwayat.id = ?', ["Bermasalah", textCatatan, idMasalah]);

            const [nomor] = await db.query('SELECT no_wa, nama_lengkap FROM tbl_user WHERE id = ?', [idUser]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal menyelesaikan peminjaman' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}