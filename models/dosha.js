import mongoose from 'mongoose';

const doshaSchema = new mongoose.Schema(
  {
    dosha: { type: String, required: true },
    remedies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Remedy' }],
    herbs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Herb' }],
    lifestyleTips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LifestyleTip' }]
  },
  { timestamps: true }
);

const Dosha = mongoose.model('Dosha', doshaSchema);
export default Dosha;
