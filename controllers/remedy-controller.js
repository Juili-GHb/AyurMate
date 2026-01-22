import Remedy from '../models/remedy.js';

export const getRemediesByDosha = async (req, res) => {
  const { type } = req.params;
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  try {
    const remedies = await Remedy.find({ doshaType: formattedType }).populate('source');
    if (!remedies.length) {
      return res.status(404).json({ message: 'No remedies found' });
    }
    res.status(200).json(remedies);
  } catch (err) {
    console.error('❌ Error fetching remedies:', err);
    res.status(500).json({ message: 'Server error fetching remedies' });
  }
};

export const getAllRemedies = async (req, res) => {
  try {
    const remedies = await Remedy.find().populate('source');
    res.status(200).json(remedies);
  } catch (err) {
    console.error('❌ Error fetching all remedies:', err);
    res.status(500).json({ message: 'Failed to fetch remedies' });
  }
};
