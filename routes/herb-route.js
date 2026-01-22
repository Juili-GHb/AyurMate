import express from 'express';
import { getAllHerbs, getHerbsByDosha } from '../controllers/herb-controller.js';

const router = express.Router();

router.get('/', getAllHerbs);
router.get('/:type', getHerbsByDosha);

export default router;

// for fetching herbs from dosha model:-
// import express from 'express';
// import Dosha from '../models/dosha.js';

// const router = express.Router();

// router.get('/', async (req, res) => {
//   try {
//     const doshas = await Dosha.find();
//     const allHerbs = doshas.flatMap(d => d.herbs);
//     const uniqueHerbs = [...new Set(allHerbs)];
//     res.json(uniqueHerbs);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch herbs', error: err });
//   }
// });

// export default router;
