import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Herb from '../models/herb.js';
import VerifiedSource from '../models/verifiedSource.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ayurmate';

const seedHerbs = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    // Clear existing herbs
    await Herb.deleteMany();

    // Get source
    const charaka = await VerifiedSource.findOne({ title: "Charaka Samhita" });

    const herbs = [
      // --- Vata Herbs ---
      {
        name: "Ashwagandha",
        doshaType: "Vata",
        uses: "Supports nervous system balance and reduces anxiety.",
        benefits: "Helps reduce Vata imbalances such as dryness and restlessness.",
        source: charaka?._id
      },
      {
        name: "Tulsi",
        doshaType: "Vata",
        uses: "Supports respiratory health and boosts immunity.",
        benefits: "Calms stress, improves vitality, balances Vata energy.",
        source: charaka?._id      
      },
      {
        name: "Shatavari",
        doshaType: "Vata",
        uses: "Supports female reproductive health and strengthens digestion.",
        benefits: "Nourishes tissues, reduces dryness and nervous system tension.",
        source: charaka?._id
      },
      {
        name: "Bala",
        doshaType: "Vata",
        uses: "Strengthens muscles and nerves.",
        benefits: "Helps with joint stiffness and fatigue.",
        source: charaka?._id
      },
      {
        name: "Licorice",
        doshaType: "Vata",
        uses: "Supports digestion and respiratory health.",
        benefits: "Reduces dryness and supports mucous membranes.",
        source: charaka?._id
      },
      {
        name: "Cardamom",
        doshaType: "Vata",
        uses: "Aids digestion and warms the body.",
        benefits: "Balances Vata by stimulating digestion and circulation.",
        source: charaka?._id
      },

      // --- Pitta Herbs ---
      {
        name: "Brahmi",
        doshaType: "Pitta",
        uses: "Cools the mind and improves focus and memory.",
        benefits: "Balances heat, irritation, and mental stress.",
        source: charaka?._id
      },
      {
        name: "Neem",
        doshaType: "Pitta",
        uses: "Purifies blood and supports skin health.",
        benefits: "Reduces inflammation and cools excess Pitta.",
        source: charaka?._id
      },
      {
        name: "Amla",
        doshaType: "Pitta",
        uses: "Boosts immunity and supports digestion.",
        benefits: "Reduces acidity, cools the body, balances Pitta dosha.",
        source: charaka?._id    
      },
      {
        name: "Guduchi",
        doshaType: "Pitta",
        uses: "Detoxifies and supports liver health.",
        benefits: "Balances Pitta, promotes longevity and immunity.",
        source: charaka?._id
      },
      {
        name: "Coriander",
        doshaType: "Pitta",
        uses: "Supports digestion and cools the body.",
        benefits: "Reduces excess heat and acidity in the body.",
        source: charaka?._id
      },
      {
        name: "Fennel",
        doshaType: "Pitta",
        uses: "Aids digestion and reduces heartburn.",
        benefits: "Cooling effect, balances Pitta dosha.",
        source: charaka?._id
      },

      // --- Kapha Herbs ---
      {
        name: "Ginger",
        doshaType: "Kapha",
        uses: "Stimulates digestion and warms the body.",
        benefits: "Reduces mucus and heaviness associated with Kapha.",
        source: charaka?._id
      },
      {
        name: "Triphala",
        doshaType: "Kapha",
        uses: "Supports digestion and detoxification.",
        benefits: "Promotes bowel regularity, balances Kapha.",
        source: charaka?._id
      },
      {
        name: "Cinnamon",
        doshaType: "Kapha",
        uses: "Improves metabolism and enhances circulation.",
        benefits: "Reduces sluggishness, mucus, and Kapha-related lethargy.",
        source: charaka?._id
      },
      {
        name: "Black Pepper",
        doshaType: "Kapha",
        uses: "Stimulates digestion and circulation.",
        benefits: "Reduces mucus, heaviness, and Kapha imbalances.",
        source: charaka?._id
      },
      {
        name: "Mustard",
        doshaType: "Kapha",
        uses: "Supports metabolism and warms the body.",
        benefits: "Balances Kapha by stimulating digestion.",
        source: charaka?._id
      },
      {
        name: "Clove",
        doshaType: "Kapha",
        uses: "Supports respiratory and digestive health.",
        benefits: "Reduces Kapha-related congestion and heaviness.",
        source: charaka?._id
      }
    ];

    await Herb.insertMany(herbs);
    console.log('✅ Herbs seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding herbs:', err);
    process.exit(1);
  }
};

seedHerbs();