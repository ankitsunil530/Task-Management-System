import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues.map((e) => e.message),
      });
    }

    // fallback (unknown error)
    console.error("Validation error:", error);
    return res.status(400).json({
      success: false,
      error: "Invalid request data",
    });
  }
};
