import { Router, Response } from 'express';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/users/profile
router.get('/profile', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/users/profile
router.put('/profile', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, avatar, profile } = req.body;

        // Validate email updates if needed in future (requires re-verification)

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                $set: {
                    ...(name && { name }),
                    ...(avatar && { avatar }),
                    ...(profile && { profile }), // merge deep in a real scenario, this overrides full profile section
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

// POST /api/users/saved-internships/:id
router.post('/saved-internships/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.userId);

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const index = user.savedInternships.indexOf(id as any);
        if (index > -1) {
            // Remove
            user.savedInternships.splice(index, 1);
        } else {
            // Add
            user.savedInternships.push(id as any);
        }

        await user.save();
        res.json({ success: true, savedInternships: user.savedInternships });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
