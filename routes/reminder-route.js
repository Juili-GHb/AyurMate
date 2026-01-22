import express from 'express';
import { addReminder, getReminders, deleteReminder, updateReminder } from '../controllers/reminder-controller.js';
import { reminderSchema } from '../schemas/reminder-schema.js';
import { validate } from '../middlewares/validate-middleware.js';

const router = express.Router();

// 📌 Create reminder
router.post('/add', validate(reminderSchema), addReminder);

// 📌 Get reminders for a user
router.get('/user/:id', getReminders);

// 📌 Delete reminder
router.delete('/:id', deleteReminder);

// 📌 Update reminder
router.put('/:id', validate(reminderSchema), updateReminder);

export default router;