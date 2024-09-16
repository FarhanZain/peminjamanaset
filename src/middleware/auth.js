import jwt from 'jsonwebtoken';

export const isAuthenticated = (req) => {
    const token = req.cookies.auth; // Ambil token dari cookie
    if (!token) {
        return false;
    }

    try {
        const decoded = jwt.verify(token, '!iniTokenRAHASIApeminjaman@set?');
        return decoded; // Kembalikan data user jika token valid
    } catch (error) {
        return false;
    }
};
