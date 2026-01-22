import mongoose from 'mongoose';
import VerifiedSource from './verifiedSource.js'; // ✅ Required

const herbSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uses: { type: [String], required: true },
  benefits: { type: [String], required: true },
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

export default mongoose.model('Herb', herbSchema);
