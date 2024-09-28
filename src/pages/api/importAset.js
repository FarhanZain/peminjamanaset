import db from '../../lib/db';
import multer from "multer";
import { read, utils } from 'xlsx'

const storage = multer.memoryStorage(); // Simpan file di memory
const upload = multer({ storage: storage });

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method == 'POST') {
            try {
                upload.single('file')(req, {}, async () => {
                    const workbook = read(req.file.buffer, { type: 'buffer' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const data = utils.sheet_to_json(sheet);

                    const query = 'INSERT INTO tbl_aset (no_aset, nama, unit, lokasi, gambar) VALUES ?';
                    const values = data.map((row) => [row.nomor_aset, row.nama_aset, row.unit_aset, row.lokasi_aset, null]);

                    const queryDuplicate = 'SELECT no_aset FROM tbl_aset WHERE no_aset IN (?)';
                    const valuesDuplicate = data.map((row) => [row.nomor_aset]);                    

                    const [checkDuplicate] = await db.query(queryDuplicate, [valuesDuplicate]);
                    const duplicateData = checkDuplicate.map(item => item.no_aset)

                    if (checkDuplicate.length > 0) {
                        return res.status(409).json({ error: `Nomor aset ${duplicateData} sudah ada di database` });
                    }

                    const [result] = await db.query(query, [values]);

                    const insertedId = result.insertId;
                    const rowsInserted = result.affectedRows;

                    for (let i = 0; i < rowsInserted; i++) {
                        const id_aset = insertedId + i;
                        await db.query(`INSERT INTO tbl_beranda (id_aset, stok) VALUES (?, 'Tersedia')`, [id_aset]);
                    }
                    res.status(200).json({ message: 'Aset berhasil ditambahkan' });
                })
            } catch (error) {
                res.status(500).json({ error: "Gagal menambah data" });
            }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}