import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import contentRoutes from './routes/content';
import messageRoutes from './routes/messages';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true,
}));
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('MONGO_URI is not defined in environment variables');
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB connection error:', err));
}

// Routes
app.get('/', (req, res) => {
    res.send('Intravvel Backend is running');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/site-content', contentRoutes);
app.use('/api/v1/contact', messageRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
