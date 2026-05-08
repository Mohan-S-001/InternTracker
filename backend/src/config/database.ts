import mongoose from 'mongoose';
import { env } from './env';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
    try {
        // Try connecting to the provided URI
        const conn = await mongoose.connect(env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Short timeout for fallback
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        
        if (env.NODE_ENV === 'development') {
            console.log('🔄 Attempting to start Local Memory Database...');
            try {
                mongod = await MongoMemoryServer.create();
                const uri = mongod.getUri();
                await mongoose.connect(uri);
                console.log('✅ Local Memory Database Started and Connected');
            } catch (err) {
                console.error('❌ Failed to start Local Memory Database:', err);
            }
        }
    }
};


mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});
