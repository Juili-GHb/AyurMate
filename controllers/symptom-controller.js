import SymptomLog from '../models/symptomLog.js';

// Add new symptom log
export const addSymptomLog = async (req, res) => {
  try {
    const { userId, symptoms } = req.body;

    // Basic validation
    if (!userId || !symptoms) {
      return res.status(400).json({ message: 'User ID and symptoms are required' });
    }

    const newLog = await SymptomLog.create({ userId, symptoms });

    res.status(201).json({
      message: 'Symptom log added successfully',
      data: newLog
    });
  } catch (error) {
    console.error('❌ Error adding symptom log:', error);
    res.status(500).json({ message: 'Error adding symptom log', error: error.message });
  }
};

// Get all symptom logs for a user
export const getUserSymptomLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await SymptomLog.find({ userId: id }).sort({ date: -1 });

    res.status(200).json(logs);
  } catch (error) {
    console.error('❌ Error fetching symptom logs:', error);
    res.status(500).json({ message: 'Error fetching symptom logs', error: error.message });
  }
};
