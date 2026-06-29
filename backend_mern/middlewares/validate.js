import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0]?.message || "Invalid request data";
      return res.status(400).json({
        success: false,
        message: firstError,
        errors: error.issues.map((e) => e.message),
      });
    }

    // fallback (unknown error)
    console.error("Validation error:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
    });
  }
};
