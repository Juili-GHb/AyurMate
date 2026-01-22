import express from 'express';
import { getAllLifestyleTips, getLifestyleTipsByDosha } from '../controllers/lifestyle-controller.js';

const router = express.Router();

router.get('/', getAllLifestyleTips);
router.get('/:type', getLifestyleTipsByDosha);

export default router;

// for fetching lifestyleTips from dosha model:-
// import express from "express";
// import Dosha from "../models/dosha.js";

// const router = express.Router();

// // GET all lifestyle tips (grouped by dosha)
// router.get("/", async (req, res) => {
//   try {
//     const allTips = await Dosha.find({}, "dosha lifestyleTips");

//     if (!allTips || allTips.length === 0) {
//       return res.status(404).json({ message: "No lifestyle tips found" });
//     }

//     res.status(200).json({ lifestyleTips: allTips });
//   } catch (err) {
//     res.status(500).json({ message: "Server error while fetching tips" });
//   }
// });

// // GET lifestyle tips for specific dosha
// router.get("/:type", async (req, res) => {
//   const type = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1).toLowerCase();

//   try {
//     const dosha = await Dosha.findOne({ dosha: type });

//     if (!dosha || !dosha.lifestyleTips || dosha.lifestyleTips.length === 0) {
//       return res.status(404).json({ message: `No lifestyle tips found for ${type} dosha` });
//     }

//     res.status(200).json({ lifestyleTips: dosha.lifestyleTips });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching lifestyle tips" });
//   }
// });

// export default router;
