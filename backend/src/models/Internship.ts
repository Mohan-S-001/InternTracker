import mongoose, { Document, Schema } from 'mongoose';

export interface IInternship extends Document {
    externalId?: string;
    source: 'adzuna' | 'jsearch' | 'remotive' | 'manual';
    title: string;
    company: mongoose.Types.ObjectId | string;
    companyName: string;
    companyLogo?: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    skills: string[];
    domain: string;
    location: string;
    type: 'remote' | 'hybrid' | 'onsite';
    duration: string;
    stipend: {
        min?: number;
        max?: number;
        currency: string;
        period: string;
    };
    applyUrl: string;
    deadline?: Date;
    startDate?: Date;
    openings?: number;
    eligibility?: string;
    isActive: boolean;
    isFeatured: boolean;
    viewCount: number;
    applyCount: number;
    savedBy: mongoose.Types.ObjectId[];
    postedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const internshipSchema = new Schema<IInternship>(
    {
        externalId: { type: String, unique: true, sparse: true },
        source: { type: String, enum: ['adzuna', 'jsearch', 'remotive', 'manual'], required: true },
        title: { type: String, required: true, trim: true },
        company: { type: Schema.Types.ObjectId, ref: 'Company' },
        companyName: { type: String, required: true },
        companyLogo: String,
        description: { type: String, required: true },
        responsibilities: [String],
        requirements: [String],
        skills: [String],
        domain: { type: String, required: true },
        location: { type: String, required: true },
        type: { type: String, enum: ['remote', 'hybrid', 'onsite'], default: 'onsite' },
        duration: { type: String, default: '3 months' },
        stipend: {
            min: Number,
            max: Number,
            currency: { type: String, default: 'USD' },
            period: { type: String, default: 'month' },
        },
        applyUrl: { type: String, required: true },
        deadline: Date,
        startDate: Date,
        openings: Number,
        eligibility: String,
        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        viewCount: { type: Number, default: 0 },
        applyCount: { type: Number, default: 0 },
        savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        postedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

internshipSchema.index({ title: 'text', description: 'text', companyName: 'text', skills: 'text' });
internshipSchema.index({ domain: 1, type: 1, isActive: 1 });
internshipSchema.index({ createdAt: -1 });

export const Internship = mongoose.model<IInternship>('Internship', internshipSchema);
