import { z } from 'zod';

// validationRules.js
export const NAME_MIN_LENGTH = 5; // change to 3, 4... anytime
export const PASSWORD_MIN_LENGTH = 6; // set your preferred min length

export const registerSchema = z.object({
  name: z.string().min(NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters long`),
  email: z.string().email('Invalid email format'),
  password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
});