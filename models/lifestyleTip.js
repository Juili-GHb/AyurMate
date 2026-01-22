import mongoose from 'mongoose';
import VerifiedSource from './verifiedSource.js'; // ✅ Required

const lifestyleSchema = new mongoose.Schema({
  tip: { type: String, required: true },
  description: { type: String, required: true },
  doshaType: {
    type: String,
    enum: ['Vata', 'Pitta', 'Kapha'],
    required: true
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerifiedSource'
  }
}, { timestamps: true });

export default mongoose.model('LifestyleTip', lifestyleSchema);
