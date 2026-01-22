import { z } from "zod";

export const reminderSchema = z.object({
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  time: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  frequency: z.enum(["once", "daily", "weekly", "monthly", "every_n_days"]),
  intervalDays: z.number().int().positive().optional().nullable()
}).refine(data => {
  if (data.frequency === "every_n_days" && (!data.intervalDays || data.intervalDays < 1)) {
    return false;
  }
  return true;
}, {
  message: "intervalDays must be provided and >= 1 when frequency is every_n_days",
  path: ["intervalDays"]
});