// pages/api/users.js
import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const [rows] = await db.query('SELECT * FROM tbl_aset');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    }else if (req.method == 'POST') {
        
    }else if (req.method == 'DELETE') {
        
    }else if (req.method == 'PUT') {
        
    }else{
        res.status(405).json({ error: 'Method tidak sesuai' });
    }
}