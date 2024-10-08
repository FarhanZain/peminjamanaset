import db from '../../lib/db';
import multer from "multer";
import { read, utils } from 'xlsx'

const storage = multer.memoryStorage();
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

                    const query = 'INSERT INTO tbl_aset (no_aset, nama, id_unit, lokasi, gambar, id_kategori, status_aset, detail) VALUES ?';
                    const values = data.map((row) => [row.nomor_aset, row.nama_aset, row.id_unit, row.lokasi_aset, null, row.id_kategori, "Tersedia", row.detail_aset]);

                    const queryDuplicate = 'SELECT no_aset FROM tbl_aset WHERE no_aset IN (?)';
                    const valuesDuplicate = data.map((row) => [row.nomor_aset]);                    

                    const [checkDuplicate] = await db.query(queryDuplicate, [valuesDuplicate]);
                    const duplicateData = checkDuplicate.map(item => item.no_aset)

                    if (checkDuplicate.length > 0) {
                        return res.status(409).json({ error: `Nomor aset ${duplicateData} sudah ada di database` });
                    }

                    await db.query(query, [values]);
                    
                    res.status(200).json({ message: 'Aset berhasil ditambahkan' });
                })
            } catch (error) {
                res.status(500).json({ error: "Gagal menambah data" });
            }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}