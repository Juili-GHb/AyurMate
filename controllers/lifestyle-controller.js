import Lifestyle from '../models/lifestyleTip.js';

// ✅ Get Lifestyle Tips by Dosha Type
export const getLifestyleTipsByDosha = async (req, res) => {
  const { type } = req.params;
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  try {
    const tips = await Lifestyle.find({ doshaType: formattedType }).populate('source');

    if (!tips.length) {
      return res.status(404).json({ message: 'No lifestyle tips found for this dosha' });
    }

    res.status(200).json(tips);
  } catch (err) {
    console.error('❌ Error fetching lifestyle tips:', err);
    res.status(500).json({ message: 'Server error fetching lifestyle tips' });
  }
};

// ✅ Get All Lifestyle Tips
export const getAllLifestyleTips = async (req, res) => {
  try {
    const tips = await Lifestyle.find().populate('source');
    res.status(200).json(tips);
  } catch (err) {
    console.error('❌ Error fetching all lifestyle tips:', err);
    res.status(500).json({ message: 'Failed to fetch tips' });
  }
};
