import express from 'express';
import { doshaQuizSchema } from '../schemas/dosha-schema.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';
import { validate } from '../middlewares/validate-middleware.js';
import {
    submitDoshaQuiz,
    getDoshaHistory,
    getLatestDoshaResult,
    getAllDoshaInfo,
    getRemediesByDosha,
    getHerbsByDosha,
    getLifestyleTipsByDosha,
    getAllRemedies,
    getAllHerbs
} from '../controllers/dosha-controller.js';
import Dosha from '../models/dosha.js';

const router = express.Router();

// ✅ Submit Dosha Quiz (protected + validated)
router.post('/quiz', authMiddleware, validate(doshaQuizSchema), submitDoshaQuiz);

// ✅ Get User's Dosha Quiz History
router.get('/history', authMiddleware, getDoshaHistory);

// ✅ Get Latest Dosha Result
router.get('/latest', authMiddleware, getLatestDoshaResult);

// ✅ Get All Dosha Info (remedies, herbs, lifestyle tips)
router.get('/', getAllDoshaInfo);

// ✅ Get All Remedies for All Doshas
router.get('/remedies', getAllRemedies);

// ✅ Get All Herbs for All Doshas
router.get('/herbs', getAllHerbs);

// ✅ Get Specific Dosha Info (Vata, Pitta, Kapha)
router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        const dosha = await Dosha.findOne({ dosha: formattedType });

        if (!dosha) {
            return res.status(404).json({ message: 'Dosha type not found' });
        }

        res.status(200).json(dosha);
    } catch (err) {
        console.error('❌ Error fetching dosha info:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ✅ Specific Remedies, Herbs, Lifestyle Tips by Dosha
router.get('/remedies/:type', getRemediesByDosha);
router.get('/herbs/:type', getHerbsByDosha);
router.get('/lifestyle/:type', getLifestyleTipsByDosha);

export default router;