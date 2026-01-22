import { z } from 'zod';

export const symptomSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  symptoms: z.array(z.string().min(1, "Symptom cannot be empty"))
});
