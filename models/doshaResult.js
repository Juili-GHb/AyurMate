import mongoose from 'mongoose';

const doshaResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doshaType: { type: String, required: true },
  scoreBreakdown: {
    vata: Number,
    pitta: Number,
    kapha: Number
  },
  
},
{ timestamps : true }
);

export default mongoose.model('DoshaResult', doshaResultSchema);
