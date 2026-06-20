import { z } from "zod";

const emailSchema = z.string().trim().email("Email must be valid");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long");

export const registerAuthSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginAuthSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});