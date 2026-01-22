import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth-route.js';
import doshaRoutes from './routes/dosha-route.js';
import remedyRoutes from './routes/remedy-route.js';
import herbRoutes from './routes/herb-route.js';
import lifestyleRoutes from './routes/lifestyle-route.js';
import symptomRoutes from './routes/symptom-route.js';
import reminderRoutes from './routes/reminder-route.js';
import ayurFeedRoutes from './routes/ayurFeed-route.js';
import dashboardRoutes from './routes/dashBoard-route.js';

dotenv.config();

const app = express();

// ✅ Configure CORS for credentialed requests
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true               // allow cookies/auth credentials
}));

app.use(express.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🌿 Welcome to AyurMate Backend API');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/dosha', doshaRoutes);
app.use('/api/remedies', remedyRoutes);
app.use('/api/herbs', herbRoutes);
app.use('/api/lifestyle', lifestyleRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/feed', ayurFeedRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});