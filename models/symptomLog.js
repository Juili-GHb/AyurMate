import mongoose from 'mongoose';

const symptomLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    symptoms: {
      type: [String],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

export default mongoose.model('SymptomLog', symptomLogSchema);
