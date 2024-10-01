import { isAuthenticated } from '../../middleware/auth';

export default async function handler(req, res) {
    const auth = isAuthenticated(req);

    if (!auth) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    res.status(200).json({ message: 'Authenticated', role: auth.role, id: auth.id, unit: auth.unit });
}
