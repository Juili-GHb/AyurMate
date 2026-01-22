import User from '../models/user.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generate-token.js';
import { registerSchema, loginSchema } from '../schemas/auth-schema.js';

export const register = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error('❌ Validation failed on register:', parsed.error.errors[0].message);
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { name, email, password } = parsed.data; // ✅ Use validated data

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.warn('⚠️ User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    console.log('✅ User registered:', { name: user.name, email: user.email, _id: user._id });

    // Send back user info along with success message
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('🚨 Server error in register:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error('❌ Validation failed on login:', parsed.error.errors[0].message);
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { email, password } = parsed.data; // ✅ Use validated data

    const user = await User.findOne({ email });
    if (!user) {
      console.warn('⚠️ Login failed: User not found:', email);
      return res.status(401).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn('⚠️ Login failed: Password mismatch for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ User logged in:', { email: user.email, _id: user._id });

    // Send back token and user info
    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('🚨 Server error in login:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn("⚠️ Reset failed: User not found:", email);
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("✅ Password updated for:", email);
    res.json({ message: "Password updated successfully. Please login with your new password." });
  } catch (err) {
    console.error("🚨 Error resetting password:", err);
    res.status(500).json({ error: "Server error" });
  }
};
