import express from 'express';
import { getUserDashboard } from '../controllers/dashBoard-controller.js';

const router = express.Router();

router.get('/summary/:userId', getUserDashboard);

export default router;
