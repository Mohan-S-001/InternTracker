import { Router, Response } from 'express';
import { Application } from '../models/Application';
import { Internship } from '../models/Internship';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sendApplicationConfirmation } from '../services/emailService';

const router = Router();
router.use(authenticate);

// POST /api/applications/:internshipId (Apply for internship)
router.post('/:internshipId', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const internship = await Internship.findById(req.params.internshipId);
        if (!internship) {
            res.status(404).json({ success: false, message: 'Internship not found' });
            return;
        }

        const existingApplication = await Application.findOne({
            user: req.userId,
            internship: internship._id,
        });

        if (existingApplication) {
            res.status(400).json({ success: false, message: 'You have already applied for this internship' });
            return;
        }

        const { personalInfo, education, experience, skills, coverLetter, portfolio, github, linkedin, resumeUrl } = req.body;

        const application = await Application.create({
            user: req.userId,
            internship: internship._id,
            companyName: internship.companyName,
            internshipTitle: internship.title,
            personalInfo,
            education,
            experience,
            skills,
            coverLetter,
            portfolio,
            github,
            linkedin,
            resumeUrl,
            timeline: [{ status: 'applied', note: 'Application submitted successfully', date: new Date() }],
        });

        // Increment apply count asynchronously
        internship.applyCount += 1;
        internship.save().catch(console.error);

        // Send confirmation email asynchronously
        if (personalInfo?.email) {
            sendApplicationConfirmation(
                personalInfo.name,
                personalInfo.email,
                internship.title,
                internship.companyName
            ).catch(console.error);
        }

        res.status(201).json({ success: true, application });
    } catch (err: any) {
        console.error('Application error:', err);
        res.status(500).json({ success: false, message: 'Failed to submit application. Please check all required fields.' });
    }
});

// GET /api/applications/me (Get user's applications)
router.get('/me', async (req: AuthRequest, res: Response) => {
    try {
        const applications = await Application.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .populate('internship', '_id title companyName type location');

        res.json({ success: true, applications });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/applications/:id (Get specific application)
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.userId,
        }).populate('internship');

        if (!application) {
            res.status(404).json({ success: false, message: 'Application not found' });
            return;
        }

        res.json({ success: true, application });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
