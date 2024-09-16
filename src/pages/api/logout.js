import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Hapus cookie auth
        res.setHeader('Set-Cookie', serialize('auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1, // Hapus cookie segera
        path: '/'
        }));

        return res.status(200).json({ message: 'Logged out successfully' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
