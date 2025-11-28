import express from 'express';
import Service from '../models/Service';
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

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services', error });
    }
});

// Create service (Protected)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: 'Error creating service', error });
    }
});

// Update service (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(service);
    } catch (error) {
        res.status(400).json({ message: 'Error updating service', error });
    }
});

// Delete service (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service', error });
    }
});

export default router;
