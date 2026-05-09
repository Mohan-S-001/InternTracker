import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    slug: string;
    logo: string;
    website: string;
    about: string;
    industry: string;
    size: string;
    founded?: number;
    headquarters: string;
    culture: string[];
    techStack: string[];
    benefits: string[];
    averageStipend?: string;
    rating?: number;
    totalReviews?: number;
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        logo: { type: String, default: '' },
        website: { type: String, required: true },
        about: { type: String, required: true },
        industry: { type: String, required: true },
        size: { type: String },
        founded: Number,
        headquarters: { type: String, required: true },
        culture: [String],
        techStack: [String],
        benefits: [String],
        averageStipend: String,
        rating: { type: Number, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0 },
        socialLinks: {
            linkedin: String,
            twitter: String,
            github: String,
        },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

companySchema.index({ name: 'text', about: 'text' });
companySchema.index({ slug: 1 });

export const Company = mongoose.model<ICompany>('Company', companySchema);
