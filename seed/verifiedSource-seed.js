// seed/verifiedSource-seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import VerifiedSource from '../models/verifiedSource.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ayurmate';

const seedVerifiedSources = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    // Optional: Clear existing ones
    await VerifiedSource.deleteMany();

    await VerifiedSource.insertMany([
      {
        title: "Charaka Samhita",
        sourceName: "Ancient Ayurvedic Text",
        type: "book"
      },
      {
        title: "Sushruta Samhita",
        sourceName: "Classical Surgical Text",
        type: "book"
      },
      {
        title: "Journal of Ayurveda & Integrative Medicine",
        sourceName: "Peer-reviewed Journal",
        type: "journal"
      }
    ]);

    console.log('✅ Verified sources seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding verified sources:', err);
    process.exit(1);
  }
};

seedVerifiedSources();
