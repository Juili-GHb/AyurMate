import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  time: {
    type: String, // stored as ISO string
    required: true
  },
  frequency: {
    type: String,
    enum: ["once", "daily", "weekly", "monthly", "every_n_days"],
    required: true
  },
  intervalDays: {
    type: Number, // used only if frequency = every_n_days
    default: null
  }
}, { timestamps: true });

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder;