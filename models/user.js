import mongoose from 'mongoose';

// Define the user schema structure
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true // Removes whitespace from both ends
    },
    email: {
      type: String,
      required: true,
      unique: true,   // Ensures no duplicate emails
      lowercase: true // Stores emails in lowercase
    },
    password: {
      type: String,
      required: true, // Hashed password expected
    },
    doshaType: {
      type: String,
      default: 'unknown', // Can be 'vata', 'pitta', 'kapha', or 'unknown'
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export User model
const User = mongoose.model('User', userSchema);
export default User;
