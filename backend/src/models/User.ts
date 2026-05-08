import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    clerkId?: string;
    email: string;
    password?: string;
    name: string;
    avatar?: string;
    role: 'student' | 'admin';
    profile: {
        bio?: string;
        phone?: string;
        location?: string;
        college?: string;
        degree?: string;
        graduationYear?: number;
        cgpa?: number;
        skills: string[];
        github?: string;
        linkedin?: string;
        portfolio?: string;
        resumeUrl?: string;
        resumePublicId?: string;
    };
    savedInternships: mongoose.Types.ObjectId[];
    notifications: {
        email: boolean;
        push: boolean;
    };
    emailVerified: boolean;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        clerkId: { type: String, unique: true, sparse: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, select: false },
        name: { type: String, required: true, trim: true },
        avatar: { type: String },
        role: { type: String, enum: ['student', 'admin'], default: 'student' },
        profile: {
            bio: String,
            phone: String,
            location: String,
            college: String,
            degree: String,
            graduationYear: Number,
            cgpa: Number,
            skills: [{ type: String }],
            github: String,
            linkedin: String,
            portfolio: String,
            resumeUrl: String,
            resumePublicId: String,
        },
        savedInternships: [{ type: Schema.Types.ObjectId, ref: 'Internship' }],
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
        },
        emailVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        lastLogin: Date,
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ clerkId: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
