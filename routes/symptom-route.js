import express from 'express';
import { addSymptomLog, getUserSymptomLogs } from '../controllers/symptom-controller.js';
import { symptomSchema } from '../schemas/symptom-schema.js';
import { validate } from '../middlewares/validate-middleware.js';

const router = express.Router();

router.post('/add', validate(symptomSchema), addSymptomLog);
router.get('/user/:id', getUserSymptomLogs);

export default router;
