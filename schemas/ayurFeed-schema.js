import { z } from "zod";

export const ayurFeedSchema = z.object({
  userId: z.string(),
  content: z.string().min(5, "Content must be at least 5 characters"),
  hashtags: z.array(z.string().regex(/^[a-zA-Z0-9_]+$/, "Invalid hashtag")).optional(),
});