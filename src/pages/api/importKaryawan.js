import db from '../../lib/db';
import multer from "multer";
import { read, utils } from 'xlsx'
import bcrypt from 'bcryptjs';

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

                    const templatePassword = "karyawanYUAB";
                    const passwordKaryawan = await bcrypt.hash(templatePassword, 10);

                    const [rows] = await db.query(`SELECT username FROM tbl_user WHERE username LIKE 'karyawan%' ORDER BY CAST(SUBSTRING(username, 9) AS UNSIGNED) DESC LIMIT 1`);
                    let lastNumber = 0;
                    if (rows.length > 0) {
                        const lastUsername = rows[0].username;
                        lastNumber = parseInt(lastUsername.replace('karyawan', ''), 10);
                    }
                    
                    const query = 'INSERT INTO tbl_user (username, password, no_wa, role, status, nama_lengkap, alamat) VALUES ?';
                    const values = data.map((row, index) => {
                        const usernameKaryawan = `karyawan${lastNumber + index + 1}`;
                        return [usernameKaryawan, passwordKaryawan, row.wa_karyawan, "karyawan", "Aktif", row.nama_karyawan, row.alamat_karyawan]
                    });

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