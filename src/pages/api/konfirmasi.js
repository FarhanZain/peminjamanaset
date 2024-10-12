import db from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const token = req.cookies.auth;
    const decoded = jwt.verify(token, '!iniTokenRAHASIApeminjaman@set?');

    if (!token) {
        return res.status(401).json({ message: 'JWT must be provided' });
    }

    const apiKey = req.headers['apikey'];
    const envApiKey = process.env.NEXT_PUBLIC_API_KEY;
    
    if (req.method == 'GET') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        try {
            if (decoded.unit) {
                const [rows] = await db.query('SELECT r.*, a.id AS id_asets, a.nama, un.id AS id_units, un.unit, u.id AS id_users, u.nama_lengkap, u.no_wa FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_user u ON r.id_user = u.id WHERE r.status_pinjam = ? AND un.unit = ? ORDER BY r.tgl_pengajuan ASC', ['Menunggu Konfirmasi', decoded.unit]);
            res.status(200).json(rows);
            } else {
                const [rows] = await db.query('SELECT r.*, a.id AS id_asets, a.nama, un.id AS id_units, un.unit, u.id AS id_users, u.nama_lengkap, u.no_wa FROM tbl_riwayat r JOIN tbl_aset a ON r.id_aset = a.id JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_user u ON r.id_user = u.id WHERE r.status_pinjam = ? ORDER BY r.tgl_pengajuan ASC', ['Menunggu Konfirmasi']);
                res.status(200).json(rows);
            }
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else if (req.method == 'PATCH') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { idRiwayat, idUser } = req.body;
        try {
            await db.query('UPDATE tbl_riwayat SET status_pinjam = ? WHERE tbl_riwayat.id = ?', ["Disetujui", idRiwayat]);

            const [nomor] = await db.query('SELECT no_wa FROM tbl_user WHERE id = ?', [idUser]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal menyetujui peminjaman aset' });
        }
    }else if (req.method == 'PUT') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { idTolak, textCatatan, idUser, tglPengembalian } = req.body;
        try {
            await db.query('UPDATE tbl_riwayat SET tgl_pengembalian = ?, status_pinjam = ?, catatan = ? WHERE tbl_riwayat.id = ?', [tglPengembalian, "Ditolak", textCatatan, idTolak]);

            const [nomor] = await db.query('SELECT no_wa, nama_lengkap FROM tbl_user WHERE id = ?', [idUser]);

            res.status(200).json(nomor);
        } catch (error) {
            res.status(500).json({ error: 'Gagal menolak peminjaman aset' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}