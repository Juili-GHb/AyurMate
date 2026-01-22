import Herb from '../models/herb.js';

export const getHerbsByDosha = async (req, res) => {
  const { type } = req.params;
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  try {
    const herbs = await Herb.find({ doshaType: formattedType }).populate('source');

    if (!herbs.length) {
      return res.status(404).json({ message: 'No herbs found for this dosha' });
    }

    res.status(200).json(herbs);
  } catch (err) {
    console.error('❌ Error fetching herbs:', err);
    res.status(500).json({ message: 'Server error fetching herbs' });
  }
};

export const getAllHerbs = async (req, res) => {
  try {
    const herbs = await Herb.find().populate('source');
    res.status(200).json(herbs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch herbs', err });
  }
};
