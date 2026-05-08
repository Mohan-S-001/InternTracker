import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';

import { env } from './config/env';
import { connectDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import { InternshipAggregator } from './services/internshipAggregator';

import authRoutes from './routes/auth';
import internshipRoutes from './routes/internships';
import applicationRoutes from './routes/applications';
import aiRoutes from './routes/ai';
import userRoutes from './routes/users';
import companyRoutes from './routes/companies';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, mobile apps, etc.)
        if (!origin) return callback(null, true);
        // In development, allow any localhost port
        if (env.NODE_ENV === 'development' && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        // In production, check against the configured FRONTEND_URL
        if (origin === env.FRONTEND_URL) {
            return callback(null, true);
        }
        callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    limit: 100, // Limit each IP to 100 reqs per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Background Scheduling
const startScheduler = () => {
    // Run every night at midnight to fetch latest internships
    cron.schedule('0 0 * * *', async () => {
        console.log('⏰ Running daily internship aggregation cron job...');
        await InternshipAggregator.aggregate();
    });
};

// Start Server & Connect to DB
const startServer = async () => {
    try {
        app.listen(env.PORT, () => {
            console.log(`🚀 InternTracker API running in ${env.NODE_ENV} mode on port ${env.PORT}`);

            // Connect to DB asynchronously
            connectDB().catch(err => console.error('DB Initial Connection Error:', err));

            // Auto-seed MNC internships on startup
            InternshipAggregator.seedMNCInternships().catch(console.error);

            // Start cron jobs
            startScheduler();
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Log and manually exit in production if needed
});

startServer();
