import { Router, Request, Response } from 'express';
import { Company } from '../models/Company';
import { Internship } from '../models/Internship';

const router = Router();

// GET /api/companies
router.get('/', async (req: Request, res: Response) => {
    try {
        const { search, limit = 20, page = 1 } = req.query;
        const query: any = { isActive: true };

        if (search) {
            query.$text = { $search: search as string };
        }

        const companies = await Company.find(query)
            .sort({ rating: -1, name: 1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Company.countDocuments(query);

        res.json({
            success: true,
            companies,
            total,
            pages: Math.ceil(total / Number(limit)),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/companies/featured
router.get('/featured', async (req: Request, res: Response) => {
    try {
        const companies = await Company.find({ isVerified: true, isActive: true })
            .sort({ rating: -1 })
            .limit(8);

        res.json({ success: true, companies });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/companies/:slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
    try {
        const company = await Company.findOne({ slug: req.params.slug, isActive: true });

        if (!company) {
            res.status(404).json({ success: false, message: 'Company not found' });
            return;
        }

        res.json({ success: true, company });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/companies/:id/internships
router.get('/:id/internships', async (req: Request, res: Response) => {
    try {
        const internships = await Internship.find({
            company: req.params.id,
            isActive: true
        }).sort({ postedAt: -1 });

        res.json({ success: true, internships });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
