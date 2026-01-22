import DoshaResult from '../models/doshaResult.js';
import Remedy from '../models/remedy.js';
import Herb from '../models/herb.js';
import Lifestyle from '../models/lifestyleTip.js';
import Reminder from '../models/reminder.js';
import Post from '../models/ayurFeedPost.js';
import Symptom from '../models/symptomLog.js';

// 📌 Get user dashboard data
export const getUserDashboard = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // 1️⃣ Get latest Dosha result for user
    const doshaResult = await DoshaResult.findOne({ user: userId }).sort({ createdAt: -1 });
    if (!doshaResult) {
      return res.status(404).json({ success: false, message: 'Dosha result not found' });
    }

    const { scoreBreakdown } = doshaResult;

    // Find the highest score(s) (tie support)
    const maxScore = Math.max(...Object.values(scoreBreakdown));
    const dominantDoshas = Object.keys(scoreBreakdown).filter(
      (dosha) => scoreBreakdown[dosha] === maxScore
    );

    // 2️⃣ Fetch data for each dominant dosha (case-insensitive)
    const remedies = [];
    const herbs = [];
    const lifestyles = [];

    for (const dosha of dominantDoshas) {
      const [remedy, herb, lifestyle] = await Promise.all([
        Remedy.findOne({ doshaType: new RegExp(`^${dosha}$`, 'i') }).populate('source'),
        Herb.findOne({ doshaType: new RegExp(`^${dosha}$`, 'i') }).populate('source'),
        Lifestyle.findOne({ doshaType: new RegExp(`^${dosha}$`, 'i') }).populate('source'),
      ]);

      if (remedy) remedies.push(remedy);
      if (herb) herbs.push(herb);
      if (lifestyle) lifestyles.push(lifestyle);
    }

    // 3️⃣ Fetch all logs, reminders, posts
    const [symptomTimeline, reminders, posts] = await Promise.all([
      Symptom.find({ userId }).sort({ createdAt: -1 }),
      Reminder.find({ userId }),
      Post.find({ userId }),
    ]);

    // 4️⃣ Send response
    res.status(200).json({
      success: true,
      dominantDoshas, // Could be 1 or 2 in case of tie
      scores: scoreBreakdown,
      remedies,
      herbs,
      lifestyleTips: lifestyles,
      symptomTimeline,
      reminders,
      posts,
    });
  } catch (err) {
    console.error('❌ Dashboard error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data',
      error: err.message,
    });
  }
};
