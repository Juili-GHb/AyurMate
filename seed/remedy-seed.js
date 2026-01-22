import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Remedy from '../models/remedy.js';
import VerifiedSource from '../models/verifiedSource.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ayurmate';

const seedRemedies = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Remedy.deleteMany();

    const source = await VerifiedSource.findOne({ title: "Charaka Samhita" });

    const remedies = [
      // VATA Remedies
      {
        title: "Warm Oil Massage (Abhyanga)",
        description:
          "Daily warm sesame oil massage calms the nervous system, improves blood circulation, and helps relieve joint stiffness, balancing aggravated Vata dosha.",
        doshaType: "Vata",
        source: source?._id,
      },
      {
        title: "Ghee-Enriched Diet",
        description:
          "Include warm, moist foods cooked with ghee to nourish dry tissues, improve digestion, and soothe excess air element in Vata.",
        doshaType: "Vata",
        source: source?._id,
      },
      {
        title: "Golden Milk at Night",
        description:
          "A cup of warm milk with turmeric and a pinch of nutmeg before bed promotes relaxation, better sleep, and strengthens immunity.",
        doshaType: "Vata",
        source: source?._id,
      },
      {
        title: "Steamed Vegetables",
        description:
          "Favor warm, cooked vegetables over raw salads to reduce bloating and gas while aiding smooth digestion for Vata.",
        doshaType: "Vata",
        source: source?._id,
      },
      {
        title: "Ashwagandha Tonic",
        description:
          "Take Ashwagandha with warm milk or water to build strength, reduce anxiety, and stabilize fluctuating energy levels.",
        doshaType: "Vata",
        source: source?._id,
      },
      {
        title: "Warm Herbal Decoction",
        description:
          "Herbal teas with cinnamon, cardamom, and ginger help balance Vata, stimulate digestion, and promote a calming effect on the mind.",
        doshaType: "Vata",
        source: source?._id,
      },

      // PITTA Remedies
      {
        title: "Cooling Cucumber Juice",
        description:
          "Fresh cucumber juice with mint and coriander helps cool down body heat, soothes acidity, and balances the fiery Pitta dosha.",
        doshaType: "Pitta",
        source: source?._id,
      },
      {
        title: "Aloe Vera Gel",
        description:
          "Consume 1–2 teaspoons of pure aloe vera gel daily to reduce internal inflammation, improve liver function, and calm Pitta-related skin issues.",
        doshaType: "Pitta",
        source: source?._id,
      },
      {
        title: "Coconut Water Hydration",
        description:
          "Drink fresh coconut water to cool the body naturally, maintain hydration, and reduce excessive heat during summer.",
        doshaType: "Pitta",
        source: source?._id,
      },
      {
        title: "Fennel-Cardamom Tea",
        description:
          "Warm fennel tea with a pinch of cardamom aids digestion, soothes acid reflux, and reduces excessive body heat.",
        doshaType: "Pitta",
        source: source?._id,
      },
      {
        title: "Rose Petal Jam (Gulkand)",
        description:
          "A teaspoon of Gulkand helps calm the mind, cools the stomach, and promotes emotional balance in aggravated Pitta.",
        doshaType: "Pitta",
        source: source?._id,
      },
      {
        title: "Mint-Coriander Chutney",
        description:
          "A refreshing chutney made with mint and coriander cools body heat, aids digestion, and helps balance Pitta naturally.",
        doshaType: "Pitta",
        source: source?._id,
      },

      // KAPHA Remedies
      {
        title: "Dry Ginger Tea",
        description:
          "A warm cup of dry ginger tea stimulates metabolism, clears respiratory congestion, and energizes sluggish Kapha.",
        doshaType: "Kapha",
        source: source?._id,
      },
      {
        title: "Honey-Lemon Warm Water",
        description:
          "Drinking warm water with honey and lemon in the morning promotes fat metabolism and clears mucus buildup.",
        doshaType: "Kapha",
        source: source?._id,
      },
      {
        title: "Spiced Buttermilk",
        description:
          "Light buttermilk with roasted cumin and black salt supports digestion, reduces heaviness, and removes excess water retention.",
        doshaType: "Kapha",
        source: source?._id,
      },
      {
        title: "Light Fasting Days",
        description:
          "Occasional light fasting with herbal teas and soups helps detoxify the system and prevent Kapha stagnation.",
        doshaType: "Kapha",
        source: source?._id,
      },
      {
        title: "Tulsi & Black Pepper Decoction",
        description:
          "A warm herbal decoction made with Tulsi and black pepper clears sinuses, boosts immunity, and relieves cold symptoms.",
        doshaType: "Kapha",
        source: source?._id,
      },
      {
        title: "Spicy Stir-Fried Vegetables",
        description:
          "Incorporating pungent and bitter spices in light stir-fried vegetables aids digestion, reduces heaviness, and stimulates Kapha metabolism.",
        doshaType: "Kapha",
        source: source?._id,
      },
    ];

    await Remedy.insertMany(remedies);
    console.log("✅ Remedies seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding remedies:", err);
    process.exit(1);
  }
};

seedRemedies();