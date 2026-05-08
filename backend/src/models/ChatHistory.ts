import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface IChatHistory extends Document {
    user: mongoose.Types.ObjectId;
    sessionId: string;
    messages: IChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const chatHistorySchema = new Schema<IChatHistory>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        sessionId: { type: String, required: true, unique: true },
        messages: [
            {
                role: { type: String, enum: ['user', 'assistant'], required: true },
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

chatHistorySchema.index({ user: 1 });
chatHistorySchema.index({ sessionId: 1 });

export const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', chatHistorySchema);
