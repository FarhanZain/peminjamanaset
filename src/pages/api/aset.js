import db from '../../lib/db';
import multer from "multer";


const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

// Konfigurasi multer untuk upload file
const upload = multer({
    storage: multer.diskStorage({
        destination: "./public/image",
        filename: (req, file, cb) => {
        cb(null, file.originalname);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only images are allowed"), false);
        }
        cb(null, true);
    },
});

// Middleware untuk menangani multipart form
const uploadMiddleware = upload.single("gambarAset")
const updateMiddleware = upload.single("updatedGambar")
const deleteMiddleware = upload.none()
const patchMiddleware = upload.none()

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const [rows] = await db.query('SELECT a.*, un.id AS id_units, un.unit, k.id AS id_kategoris, k.kategori FROM tbl_aset a JOIN tbl_unit un ON a.id_unit = un.id JOIN tbl_kategori k ON a.id_kategori = k.id');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    }else if (req.method == 'POST') {
        uploadMiddleware(req, res, async () => {
            const { nomorAset, namaAset, unitAset, lokasiAset, kategoriAset, detailAset } = req.body;
            const gambarAset = req.file ? `/image/${req.file.filename}` : null;
            try {
                const [checkDuplicate] = await db.query('SELECT no_aset FROM tbl_aset WHERE no_aset = ?', [nomorAset]);
                if (checkDuplicate.length > 0) {
                    return res.status(409).json({ error: 'Nomor aset sudah digunakan' });
                }
                await db.query(`INSERT INTO tbl_aset (no_aset, nama, id_unit, lokasi, gambar, id_kategori, detail, status_aset) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [nomorAset, namaAset, unitAset, lokasiAset, gambarAset, kategoriAset, detailAset, "Tersedia"]);
                res.status(200).json({ message: "Aset berhasil ditambahkan" });
            } catch (error) {
                res.status(500).json({ error: "Gagal menambah aset" });
            }
        });
    }else if (req.method == 'DELETE') {
        deleteMiddleware(req, res, async () => {
            const { deletedId } = req.body;
            try {
                const [pathGambar] = await db.query('SELECT gambar FROM tbl_aset WHERE id = ?', [deletedId]);
                const hasilPath = pathGambar[0].gambar;
                const [jumlahPath] = await db.query('SELECT COUNT(*) as count FROM tbl_aset WHERE gambar = ?', [hasilPath]);
                const hasil = jumlahPath[0].count;

                if (hasil === 1) {
                    const filePath = `./public${hasilPath}`;
                    await unlinkAsync(filePath);
                }
                await db.query('DELETE FROM tbl_aset WHERE id = ?', [deletedId]);

                res.status(200).json({ message: 'Aset berhasil dihapus' });
            } catch (error) {
                res.status(500).json({ error: 'Gagal menghapus aset' });
            }
        });
    }else if (req.method == 'PUT') {
        updateMiddleware(req, res, async () => {
            const { updatedId, updatedNomor, updatedNama, updatedUnit, updatedLokasi, updatedKategori, updatedDetail } = req.body;
            const updatedGambar = req.file ? `/image/${req.file.filename}` : null;
            try {
                const [pathGambar] = await db.query('SELECT gambar FROM tbl_aset WHERE id = ?', [updatedId]);
                const hasilPath = pathGambar[0].gambar;
                const [jumlahPath] = await db.query('SELECT COUNT(*) as count FROM tbl_aset WHERE gambar = ?', [hasilPath]);
                const hasil = jumlahPath[0].count;

                if (hasil === 1) {
                    const filePath = `./public${hasilPath}`;
                    await unlinkAsync(filePath);
                }

                const [checkDuplicate] = await db.query('SELECT no_aset FROM tbl_aset WHERE no_aset = ? AND id != ?', [updatedNomor, updatedId]);
                if (checkDuplicate.length > 0) {
                    return res.status(409).json({ error: 'Nomor aset sudah digunakan' });
                }
                await db.query(`UPDATE tbl_aset SET no_aset = ?, nama = ?, id_unit = ?, lokasi = ?, gambar = ?, id_kategori = ?, detail = ? WHERE id = ?`, [updatedNomor, updatedNama, updatedUnit, updatedLokasi, updatedGambar, updatedKategori, updatedDetail, updatedId]);
                res.status(200).json({ message: "Aset berhasil diperbarui" });
            } catch (error) {
                res.status(500).json({ error: "Gagal memperbarui aset" });
            }
        });
    }else if (req.method == 'PATCH') {
        patchMiddleware(req, res, async () => {
            const { updatedId, updatedStatus } = req.body;
            try {
                await db.query(`UPDATE tbl_aset SET status_aset = ? WHERE id = ?`, [updatedStatus, updatedId]);
                res.status(200).json({ message: "Status Aset berhasil diperbarui" });
            } catch (error) {
                res.status(500).json({ error: "Gagal memperbarui status aset" });
            }
        });
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}