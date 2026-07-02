export const EMAIL_NOT_VERIFIED_MESSAGE =
  "Email not verified. Please check your inbox.";

export const ensureVerifiedUser = (user) => {
  if (user.emailVerified === false) {
    const error = new Error(EMAIL_NOT_VERIFIED_MESSAGE);
    error.status = 403;
    throw error;
  }
};
