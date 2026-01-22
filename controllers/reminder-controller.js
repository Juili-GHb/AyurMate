import Reminder from '../models/reminder.js';

// 📌 Create a new reminder
export const addReminder = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Reminder data is required' });
    }

    const { userId, title, time, frequency, intervalDays } = req.body;

    // 🔍 Validate intervalDays only if frequency is every_n_days
    if (frequency === "every_n_days" && (!intervalDays || intervalDays < 1)) {
      return res.status(400).json({ success: false, message: 'intervalDays is required and must be >= 1 for every_n_days' });
    }

    const reminder = await Reminder.create({
      userId,
      title,
      time: new Date(time).toISOString(), // ✅ store as ISO
      frequency,
      intervalDays: frequency === "every_n_days" ? intervalDays : null
    });

    res.status(201).json({ success: true, reminder });
  } catch (err) {
    console.error('❌ Error adding reminder:', err);
    res.status(500).json({ success: false, message: 'Error adding reminder', error: err.message });
  }
};

// 📌 Get all reminders for a specific user
export const getReminders = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const reminders = await Reminder.find({ userId: id });
    res.status(200).json({ success: true, reminders });
  } catch (err) {
    console.error('❌ Error fetching reminders:', err);
    res.status(500).json({ success: false, message: 'Error fetching reminders', error: err.message });
  }
};

// 📌 Delete a reminder by ID
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Reminder ID is required' });
    }

    const deleted = await Reminder.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    res.status(200).json({ success: true, message: 'Reminder deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting reminder:', err);
    res.status(500).json({ success: false, message: 'Error deleting reminder', error: err.message });
  }
};

// 📌 Update a reminder by ID
export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Reminder ID is required' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Update data is required' });
    }

    const { time, frequency, intervalDays } = req.body;

    // 🔍 Validate intervalDays again here
    if (frequency === "every_n_days" && (!intervalDays || intervalDays < 1)) {
      return res.status(400).json({ success: false, message: 'intervalDays is required and must be >= 1 for every_n_days' });
    }

    const updated = await Reminder.findByIdAndUpdate(
      id,
      {
        ...req.body,
        time: time ? new Date(time).toISOString() : undefined,
        intervalDays: frequency === "every_n_days" ? intervalDays : null
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    res.status(200).json({ success: true, updated });
  } catch (err) {
    console.error('❌ Error updating reminder:', err);
    res.status(500).json({ success: false, message: 'Error updating reminder', error: err.message });
  }
};