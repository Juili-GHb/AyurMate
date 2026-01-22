import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dosha from '../models/dosha.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });


const doshaData = [
  {
    dosha: "Vata",
    remedies: [
      "Warm sesame oil massage (Abhyanga)",
      "Drink warm milk with nutmeg at bedtime",
      "Eat soupy, oily, and cooked root vegetables",
      "Apply warm compress to ease joint discomfort"
    ],
    herbs: [
      "Ashwagandha",
      "Shatavari",
      "Licorice (Yashtimadhu)",
      "Dashamoola"
    ],
    lifestyleTips: [
      "Stick to a consistent daily routine",
      "Avoid cold and windy environments",
      "Practice slow, grounding yoga",
      "Take frequent warm baths"
    ]
  },
  {
    dosha: "Pitta",
    remedies: [
      "Drink rose water or coconut water",
      "Apply aloe vera gel to soothe skin heat",
      "Avoid spicy, fried, and sour foods",
      "Use cooling sandalwood or mint oil in baths"
    ],
    herbs: [
      "Brahmi",
      "Guduchi",
      "Neem",
      "Shatavari"
    ],
    lifestyleTips: [
      "Avoid exposure to direct midday sun",
      "Practice Sheetali or Chandra Bhedana pranayama",
      "Use calming colors like blue and white",
      "Spend time in natural, cool environments"
    ]
  },
  {
    dosha: "Kapha",
    remedies: [
      "Start day with warm lemon or honey water",
      "Use dry brushing to stimulate circulation",
      "Avoid dairy, heavy sweets, and cold foods",
      "Eat light, spiced, warm meals like khichdi"
    ],
    herbs: [
      "Trikatu (Ginger, Black Pepper, Pippali)",
      "Turmeric",
      "Cinnamon",
      "Guggulu"
    ],
    lifestyleTips: [
      "Wake up early and avoid daytime naps",
      "Exercise daily—preferably in the morning",
      "Declutter home and workspace regularly",
      "Stay mentally engaged and avoid inactivity"
    ]
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => Dosha.insertMany(doshaData))
  .then(() => {
    console.log("✅ Dosha remedies, herbs, and lifestyle tips seeded successfully!");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Seeding error:", err);
  });
