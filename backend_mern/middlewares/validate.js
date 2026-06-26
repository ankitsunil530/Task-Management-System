import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    // Parse combined body, query parameters, and route params to allow schema
    // validations to examine the complete context of the request if needed.
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Map validation errors into a key-value format { field: message } so the
      // frontend client can display errors directly under their respective inputs.
      const formattedErrors = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (path) {
          formattedErrors[path] = issue.message;
        } else {
          formattedErrors.general = issue.message;
        }
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
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
