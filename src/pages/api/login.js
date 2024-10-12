import db from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    const apiKey = req.headers['apikey'];
    const envApiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (req.method === 'POST') {
        if (apiKey !== envApiKey) {
            return res.status(403).json({ error: 'Akses ditolak !' });
        }
        
        const { username, password } = req.body;

        try {
            const [rows] = await db.query('SELECT u.*, un.id AS id_units, un.unit FROM tbl_user u LEFT JOIN tbl_unit un ON u.id_unit = un.id WHERE username = ?', [username]);

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Username Salah !' });
            }

            const user = rows[0];

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Password Salah !' });
            }

            if (user.status === "Aktif") {
                const token = jwt.sign({ id: user.id, role: user.role, unit: user.unit }, '!iniTokenRAHASIApeminjaman@set?', { expiresIn: '30d' });
    
                res.setHeader('Set-Cookie', serialize('auth', token, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/'
                }));
            }

            return res.status(200).json({ message: 'Login successful',data: {role: user.role, status: user.status} });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
