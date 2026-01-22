import mongoose from 'mongoose';
import VerifiedSource from './verifiedSource.js'; // ✅ Ensure this is here

const remedySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  doshaType: {
    type: String,
    enum: ['Vata', 'Pitta', 'Kapha'],
    required: true
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerifiedSource',
    required: false
  }
}, { timestamps: true });

export default mongoose.model('Remedy', remedySchema);
