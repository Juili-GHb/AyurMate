// for fetching remedies individually from remedy model:-
// routes/remedy-route.js

import express from 'express';
import { getRemediesByDosha, getAllRemedies } from '../controllers/remedy-controller.js';

const router = express.Router();

router.get('/', getAllRemedies);              // 🔹 GET all remedies
router.get('/:type', getRemediesByDosha);     // 🔹 GET by dosha

export default router;

// for fetching remedies from dosha model:-
// import express from 'express';
// import Dosha from '../models/dosha.js';

// const router = express.Router();

// router.get('/', async (req, res) => {
//   try {
//     const doshas = await Dosha.find();
//     const allRemedies = doshas.flatMap(d => d.remedies);
//     const uniqueRemedies = [...new Set(allRemedies)];
//     res.json(uniqueRemedies);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch remedies', error: err });
//   }
// });

// export default router;
