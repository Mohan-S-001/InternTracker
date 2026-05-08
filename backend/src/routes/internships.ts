import { Router, Request, Response } from 'express';
import { Internship } from '../models/Internship';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth';
import { InternshipAggregator } from '../services/internshipAggregator';

const router = Router();

// GET /api/internships (List with search and filters)
router.get('/', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { search, domain, type, location, limit = 20, page = 1 } = req.query;
        const query: any = { isActive: true };

        if (search) {
            query.$text = { $search: search as string };
        }
        if (domain) query.domain = domain;
        if (type) query.type = type;
        if (location) query.location = new RegExp(location as string, 'i');

        const internships = await Internship.find(query)
            .sort({ isFeatured: -1, postedAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate('company', 'name logo slug');

        const total = await Internship.countDocuments(query);

        res.json({
            success: true,
            internships,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/internships/trending
router.get('/trending', async (req: Request, res: Response) => {
    try {
        const internships = await Internship.find({ isActive: true })
            .sort({ viewCount: -1, applyCount: -1, postedAt: -1 })
            .limit(6)
            .populate('company', 'name logo slug');

        res.json({ success: true, internships });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/internships/:id
router.get('/:id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
    try {
        const internship = await Internship.findById(req.params.id)
            .populate('company')
            .populate('savedBy', '_id name');

        if (!internship) {
            res.status(404).json({ success: false, message: 'Internship not found' });
            return;
        }

        // Increment view count asynchronously
        internship.viewCount += 1;
        internship.save().catch(console.error);

        res.json({ success: true, internship });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/internships/refresh (Admin only)
router.post('/refresh', authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        // Run asynchronously to not block response
        InternshipAggregator.aggregate().catch(console.error);

        res.json({ success: true, message: 'Internship aggregation process started' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
