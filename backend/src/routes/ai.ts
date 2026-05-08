import { Router, Response } from 'express';
import { chatWithAI, analyzeResume, getInternshipRecommendations } from '../services/aiService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { ChatHistory } from '../models/ChatHistory';

const router = Router();
router.use(authenticate);

// POST /api/ai/chat
router.post('/chat', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message, sessionId = 'default' } = req.body;

        if (!message) {
            res.status(400).json({ success: false, message: 'Message is required' });
            return;
        }

        let history = await ChatHistory.findOne({ user: req.userId, sessionId });
        if (!history) {
            history = await ChatHistory.create({ user: req.userId, sessionId, messages: [] });
        }

        // Add user message
        history.messages.push({ role: 'user', content: message, timestamp: new Date() });

        // Get AI response (using last 10 messages for context mapping inside the service)
        const formattedMessages = history.messages.map(m => ({ role: m.role, content: m.content }));
        const aiResponse = await chatWithAI(formattedMessages);

        // Add AI response
        history.messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });
        await history.save();

        res.json({ success: true, message: aiResponse });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to process chat message' });
    }
});

// POST /api/ai/resume/analyze
router.post('/resume/analyze', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { resumeText } = req.body;

        if (!resumeText) {
            res.status(400).json({ success: false, message: 'Resume text is required for analysis' });
            return;
        }

        const analysis = await analyzeResume(resumeText);
        res.json({ success: true, analysis });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to analyze resume' });
    }
});

// POST /api/ai/recommendations
router.post('/recommendations', async (req: AuthRequest, res: Response) => {
    try {
        const { skills, preferences } = req.body;
        const recommendations = await getInternshipRecommendations(skills || [], preferences || {});
        res.json({ success: true, recommendations });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get recommendations' });
    }
});

export default router;
