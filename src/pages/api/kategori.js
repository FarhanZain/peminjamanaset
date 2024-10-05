import db from '../../lib/db';

export default async function handler(req, res) {
    const apiKey = req.headers['apikey'];
    const envApiKey = process.env.NEXT_PUBLIC_API_KEY;
    
    if (req.method == 'GET') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        try {
            const [rows] = await db.query('SELECT * FROM tbl_kategori');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Gagal fetching data' });
        }
    }else if (req.method == 'POST') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { textKategori } = req.body;
        try {
            await db.query('INSERT INTO tbl_kategori (kategori) VALUES (?)', [textKategori]);
            res.status(200).json({ message: 'Kategori berhasil ditambahkan' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menambahkan kategori' });
        }
    }else if (req.method == 'PUT') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { updatedId, updatedKategori} = req.body;
        try {
            await db.query('UPDATE tbl_kategori SET kategori = ? WHERE tbl_kategori.id = ?', [updatedKategori, updatedId]);
            res.status(200).json({ message: 'Kategori berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal memperbarui kategori' });
        }
    }else if (req.method == 'DELETE') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        const { deletedId } = req.body;
        try {
            await db.query('DELETE FROM tbl_kategori WHERE id = ?', [deletedId]);
            res.status(200).json({ message: 'Kategori berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ error: 'Gagal menghapus kategori' });
        }
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}