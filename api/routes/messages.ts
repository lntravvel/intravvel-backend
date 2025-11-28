import express from 'express';
import Message from '../models/Message';
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

// Submit message (Public)
router.post('/', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error sending message', error });
    }
});

// Get all messages (Protected)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

// Update message status (Protected)
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const message = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(message);
    } catch (error) {
        res.status(400).json({ message: 'Error updating message', error });
    }
});

export default router;
