import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lifestyle from '../models/lifestyleTip.js';
import VerifiedSource from '../models/verifiedSource.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ayurmate';

const seedLifestyleTips = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Lifestyle.deleteMany();

    const charaka = await VerifiedSource.findOne({ title: "Charaka Samhita" });

    const tips = [
      // --- Vata Tips ---
      {
        tip: "Warm Oil Massage",
        doshaType: "Vata",
        source: charaka?._id,
        description: "Vata types benefit from warm oil massages and regular meals to maintain balance and reduce anxiety."
      },
      {
        tip: "Consistent Routine",
        doshaType: "Vata",
        source: charaka?._id,
        description: "Maintain a consistent daily routine to reduce anxiety and stabilize energy."
      },
      {
        tip: "Warm Foods",
        doshaType: "Vata",
        source: charaka?._id,
        description: "Prefer warm, cooked, and moist foods over dry and cold foods to balance Vata."
      },
      {
        tip: "Gentle Yoga",
        doshaType: "Vata",
        source: charaka?._id,
        description: "Practice gentle yoga and stretching to keep joints flexible and calm the mind."
      },
      {
        tip: "Stay Warm",
        doshaType: "Vata",
        source: charaka?._id,
        description: "Stay warm and avoid cold drafts, especially during winter."
      },
      {
        tip: "Warm Herbal Teas",
        doshaType: "Vata",
        source: charaka?._id,
        description: "Drink warm herbal teas like ginger or chamomile for digestion and relaxation."
      },

      // --- Pitta Tips ---
      {
        tip: "Avoid Spicy Food",
        doshaType: "Pitta",
        source: charaka?._id,
        description: "Pitta types should avoid spicy food and stay cool to prevent overheating."
      },
      {
        tip: "Calming Meditation",
        doshaType: "Pitta",
        source: charaka?._id,
        description: "Practice calming meditation and cooling breathing exercises to reduce irritability."
      },
      {
        tip: "Limit Sun Exposure",
        doshaType: "Pitta",
        source: charaka?._id,
        description: "Avoid excessive sun exposure and hot environments to keep Pitta balanced."
      },
      {
        tip: "Cooling Diet",
        doshaType: "Pitta",
        source: charaka?._id,
        description: "Eat sweet, bitter, and astringent foods to balance Pitta."
      },
      {
        tip: "Moderate Exercise",
        doshaType: "Pitta",
        source: charaka?._id,
        description: "Engage in moderate, non-competitive exercise like swimming to stay active without overheating."
      },
      {
        tip: "Adequate Rest",
        doshaType: "Pitta",
        source: charaka?._id,
        description: "Get enough rest and avoid overworking to prevent irritability."
      },

      // --- Kapha Tips ---
      {
        tip: "Morning Exercise",
        doshaType: "Kapha",
        source: charaka?._id,
        description: "Kapha types benefit from morning exercise and avoiding heavy foods."
      },
      {
        tip: "Light Foods",
        doshaType: "Kapha",
        source: charaka?._id,
        description: "Prefer light, dry, and warm foods to stimulate metabolism."
      },
      {
        tip: "Stimulating Activities",
        doshaType: "Kapha",
        source: charaka?._id,
        description: "Incorporate stimulating activities to avoid lethargy."
      },
      {
        tip: "Avoid Daytime Naps",
        doshaType: "Kapha",
        source: charaka?._id,
        description: "Avoid daytime naps to maintain energy levels."
      },
      {
        tip: "Digestive Spices",
        doshaType: "Kapha",
        source: charaka?._id,
        description: "Use spices like ginger, black pepper, and turmeric to aid digestion."
      },
      {
        tip: "Invigorating Exercise",
        doshaType: "Kapha",
        source: charaka?._id,
        description: "Practice invigorating exercise like jogging or brisk walking."
      },
    ];

    await Lifestyle.insertMany(tips);
    console.log('✅ Lifestyle tips seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding lifestyle tips:', err);
    process.exit(1);
  }
};

seedLifestyleTips();