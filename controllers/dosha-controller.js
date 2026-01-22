import DoshaResult from '../models/doshaResult.js';
import Dosha from '../models/dosha.js';
import { analyzeDosha } from '../utils/dosha-analyzer.js';

// 🔹 Helper: Format dosha type consistently
const formatDoshaType = (type) =>
  type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

// 📌 Submit Dosha Quiz
export const submitDoshaQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers array' });
    }

    const { doshaType, scoreBreakdown } = analyzeDosha(answers);

    const result = new DoshaResult({
      user: userId,
      doshaType,
      scoreBreakdown,
    });

    await result.save();

    res.status(201).json({
      message: 'Dosha quiz submitted successfully',
      doshaType,
      scoreBreakdown,
    });
  } catch (error) {
    console.error('❌ Error in submitDoshaQuiz:', error);
    res.status(500).json({ message: 'Server error while submitting quiz' });
  }
};

// 📌 Get Dosha History
export const getDoshaHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await DoshaResult.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error in getDoshaHistory:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

// 📌 Get Latest Dosha Result
export const getLatestDoshaResult = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await DoshaResult.findOne({ user: userId }).sort({ createdAt: -1 });

    if (!result) {
      return res.status(404).json({ message: 'No dosha result found' });
    }

    res.status(200).json({
      message: 'Latest Dosha Result',
      doshaType: result.doshaType,
      scoreBreakdown: result.scoreBreakdown,
      createdAt: result.createdAt,
    });
  } catch (error) {
    console.error('🚨 Error in getLatestDoshaResult:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// 📌 Get All Dosha Info
export const getAllDoshaInfo = async (req, res) => {
  try {
    const doshas = await Dosha.find();
    res.status(200).json(doshas);
  } catch (err) {
    console.error('❌ Error fetching all dosha info:', err);
    res.status(500).json({ message: 'Failed to fetch dosha info' });
  }
};

// 📌 Get Remedies by Dosha
export const getRemediesByDosha = async (req, res) => {
  try {
    const dosha = await Dosha.findOne({ dosha: formatDoshaType(req.params.type) });
    if (!dosha) return res.status(404).json({ message: 'Dosha not found' });

    res.status(200).json({ remedies: dosha.remedies });
  } catch (err) {
    console.error('❌ Error fetching remedies:', err);
    res.status(500).json({ message: 'Server error fetching remedies' });
  }
};

// 📌 Get Herbs by Dosha
export const getHerbsByDosha = async (req, res) => {
  try {
    const dosha = await Dosha.findOne({ dosha: formatDoshaType(req.params.type) });
    if (!dosha) return res.status(404).json({ message: 'Dosha not found' });

    res.status(200).json({ herbs: dosha.herbs });
  } catch (err) {
    console.error('❌ Error fetching herbs:', err);
    res.status(500).json({ message: 'Server error fetching herbs' });
  }
};

// 📌 Get Lifestyle Tips by Dosha
export const getLifestyleTipsByDosha = async (req, res) => {
  try {
    const dosha = await Dosha.findOne({ dosha: formatDoshaType(req.params.type) });
    if (!dosha) return res.status(404).json({ message: 'Dosha not found' });

    res.status(200).json({ lifestyleTips: dosha.lifestyleTips });
  } catch (err) {
    console.error('❌ Error fetching lifestyle tips:', err);
    res.status(500).json({ message: 'Server error fetching lifestyle tips' });
  }
};

// 📌 Get All Remedies (Combined)
export const getAllRemedies = async (req, res) => {
  try {
    const doshas = await Dosha.find();
    const allRemedies = doshas.flatMap((d) => d.remedies || []);
    res.status(200).json({ remedies: allRemedies });
  } catch (err) {
    console.error('❌ Error fetching all remedies:', err);
    res.status(500).json({ message: 'Failed to fetch remedies' });
  }
};

// 📌 Get All Herbs (Combined)
export const getAllHerbs = async (req, res) => {
  try {
    const doshas = await Dosha.find();
    const allHerbs = doshas.flatMap((d) => d.herbs || []);
    res.status(200).json({ herbs: allHerbs });
  } catch (err) {
    console.error('❌ Error fetching all herbs:', err);
    res.status(500).json({ message: 'Failed to fetch herbs' });
  }
};

// 📌 Get All Lifestyle Tips (Combined)
export const getAllLifestyleTips = async (req, res) => {
  try {
    const doshas = await Dosha.find();
    const allTips = doshas.flatMap((d) => d.lifestyleTips || []);
    res.status(200).json({ lifestyleTips: allTips });
  } catch (err) {
    console.error('❌ Error fetching lifestyle tips:', err);
    res.status(500).json({ message: 'Failed to fetch lifestyle tips' });
  }
};
