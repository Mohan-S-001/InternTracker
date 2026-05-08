import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
    user: mongoose.Types.ObjectId;
    internship: mongoose.Types.ObjectId;
    companyName: string;
    internshipTitle: string;
    status: 'applied' | 'under_review' | 'interview' | 'selected' | 'rejected';
    personalInfo: {
        name: string;
        email: string;
        phone: string;
        location: string;
    };
    education: {
        college: string;
        degree: string;
        branch: string;
        year: string;
        cgpa: string;
    };
    experience?: string;
    skills: string[];
    coverLetter: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
    resumeUrl?: string;
    availableFrom?: Date;
    notes?: string;
    adminNotes?: string;
    timeline: {
        status: string;
        date: Date;
        note?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        internship: { type: Schema.Types.ObjectId, ref: 'Internship', required: true },
        companyName: { type: String, required: true },
        internshipTitle: { type: String, required: true },
        status: {
            type: String,
            enum: ['applied', 'under_review', 'interview', 'selected', 'rejected'],
            default: 'applied',
        },
        personalInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            location: { type: String, required: true },
        },
        education: {
            college: { type: String, required: true },
            degree: { type: String, required: true },
            branch: { type: String, required: true },
            year: { type: String, required: true },
            cgpa: { type: String, required: true },
        },
        experience: String,
        skills: [String],
        coverLetter: { type: String, required: true },
        portfolio: String,
        github: String,
        linkedin: String,
        resumeUrl: String,
        availableFrom: Date,
        notes: String,
        adminNotes: String,
        timeline: [
            {
                status: String,
                date: { type: Date, default: Date.now },
                note: String,
            },
        ],
    },
    { timestamps: true }
);

applicationSchema.index({ user: 1, createdAt: -1 });
applicationSchema.index({ internship: 1 });
applicationSchema.index({ status: 1 });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
