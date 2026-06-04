import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  "Invalid date format"
).optional(),

});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  deadline: z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  "Invalid date format"
).optional(),

});

export const assignTaskSchema = z.object({
  userIds: z
    .array(z.string().min(1, "Each userId must be a non-empty string"))
    .min(1, "userIds must contain at least one user"),
});

export const addCommentSchema = z.object({
  text: z
    .string()
    .min(1, "Comment text is required")
    .max(500, "Comment must be 500 characters or fewer"),
});
