import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const [rows] = await db.query('SELECT * FROM tbl_unit');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else if (req.method == 'POST') {
        const { textUnit } = req.body;
        try {
            await db.query('INSERT INTO tbl_unit (unit) VALUES (?)', [textUnit]);
            res.status(200).json({ message: 'Unit berhasil ditambahkan' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menambahkan unit' });
        }
    }else if (req.method == 'PUT') {
        const { updatedId, updatedUnit} = req.body;
        try {
            await db.query('UPDATE tbl_unit SET unit = ? WHERE tbl_unit.id = ?', [updatedUnit, updatedId]);
            res.status(200).json({ message: 'Unit berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal memperbarui unit' });
        }
    }else if (req.method == 'DELETE') {
        const { deletedId } = req.body;
        try {
            await db.query('DELETE FROM tbl_unit WHERE id = ?', [deletedId]);
            res.status(200).json({ message: 'Unit berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menghapus unit' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}