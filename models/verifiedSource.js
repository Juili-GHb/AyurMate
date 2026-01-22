import mongoose from 'mongoose';

const verifiedSourceSchema = new mongoose.Schema({
  title: { type: String, required: true },        // e.g. "Charaka Samhita"
  sourceName: { type: String, required: true },   // e.g. "Ancient Ayurvedic Text"
  type: {
    type: String,
    enum: ['book', 'journal', 'website'],
    required: true
  },
  // url: {
  //   type: String,
  //   required: false
  // } 
  // url -> optional to give link of reference
});

export default mongoose.model('VerifiedSource', verifiedSourceSchema);
