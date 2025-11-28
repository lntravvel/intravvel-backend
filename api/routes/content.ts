import express from 'express';
import SiteContent from '../models/SiteContent';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get content by section
router.get('/', async (req, res) => {
    try {
        const { section } = req.query;
        if (section) {
            const content = await SiteContent.findOne({ section });
            return res.json(content || {});
        }
        const allContent = await SiteContent.find();
        res.json(allContent);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching content', error });
    }
});

// Update/Create content (Protected)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { section, data } = req.body;
        const content = await SiteContent.findOneAndUpdate(
            { section },
            { data, lastUpdated: Date.now() },
            { new: true, upsert: true }
        );
        res.json(content);
    } catch (error) {
        res.status(400).json({ message: 'Error updating content', error });
    }
});

export default router;
