import asyncHandler from "express-async-handler";
import crypto from "crypto";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { ensureVerifiedUser } from "../utils/ensureVerifiedUser.js";
import getBaseUrl from "../utils/getBaseUrl.js";
import generateToken from "../utils/generateToken.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

// Accepts only an https URL served from Cloudinary's media host, so the stored
// profilePicture field can never be set to arbitrary text or a non-image origin.
const isValidCloudinaryUrl = (value) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      url.pathname.includes("/image/upload/")
    );
  } catch {
    return false;
  }
};

// ================= REGISTER =================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name || !normalizedEmail || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(409);
    throw new Error("User already exists");
  }

  const rawVerificationToken = crypto.randomBytes(32).toString("hex");
  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(rawVerificationToken)
    .digest("hex");

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    emailVerified: false,
    emailVerificationToken: hashedVerificationToken,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const baseUrl = getBaseUrl(req);
  const verificationUrl = `${baseUrl}/api/user/verify-email/${rawVerificationToken}`;

  try {
    const emailResult = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl,
    });

    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      emailVerified: user.emailVerified,
    };

    if (process.env.NODE_ENV !== "production" && emailResult?.previewUrl) {
      responseData.verificationPreviewUrl = emailResult.previewUrl;
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email address.",
      data: responseData,
    });

    return;
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    res.status(500);
    throw new Error("Unable to send verification email");
  }
});

// ================= LOGIN =================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    res.status(400);
    throw new Error("Email and password required");
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (user && (await user.matchPassword(password))) {
    ensureVerifiedUser(user);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// ================= VERIFY EMAIL =================
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    res.status(400);
    throw new Error("Verification token is required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification link");
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Email verified successfully",
  });
});

// ================= PROFILE =================
export const userProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// ================= UPDATE PROFILE PICTURE =================
// The image is uploaded directly from the client to Cloudinary via an unsigned
// upload preset; only the resulting secure_url reaches this endpoint, so no
// large file payloads or storage credentials pass through the server. Sending
// an empty string clears the picture (the UI falls back to an initials avatar).
export const updateProfilePicture = asyncHandler(async (req, res) => {
  const { profilePicture } = req.body;

  if (typeof profilePicture !== "string") {
    res.status(400);
    throw new Error("profilePicture must be a string");
  }

  const trimmed = profilePicture.trim();

  if (trimmed !== "" && !isValidCloudinaryUrl(trimmed)) {
    res.status(400);
    throw new Error("Invalid image URL");
  }

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: trimmed },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updated) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      profilePicture: updated.profilePicture,
    },
  });
});

// ================= LOGOUT =================
export const logoutUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// ================= ADMIN: GET ALL USERS =================
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  // The User model has no `username` field, but the @mention feature keys off
  // one (dropdown + comment mention resolution). Derive a stable username from
  // the email local-part so mentions work for all existing users without a DB
  // migration. If a real `username` is ever added, it takes precedence.
  const data = users.map((u) => ({
    ...u,
    username: u.username || (u.email ? u.email.split("@")[0] : ""),
  }));

  res.json({
    success: true,
    count: data.length,
    data,
  });
});

// ================= ADMIN: DELETE USER =================
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Guard 1: Prevent an admin from deleting their own account.
  // Self-deletion would lock the admin out immediately.
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  // Guard 2: Prevent deletion of the last admin.
  // If the target is an admin and no other admin exists, reject — deleting
  // them would leave the system with no way to perform admin operations.
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      res.status(400);
      throw new Error("Cannot delete the last admin account — promote another user first");
    }
  }

  // Guard 3: Clean up task references before deleting the user.
  // Pull the deleted user from assignedTo and watchers on every task they
  // appear in, so tasks remain visible and intact for other participants.
  // createdBy is left unchanged — the task stays readable by other assignees
  // and admins, and populated views already handle a null creator gracefully.
  await Task.updateMany(
    { $or: [{ assignedTo: user._id }, { watchers: user._id }] },
    { $pull: { assignedTo: user._id, watchers: user._id } }
  );

  await user.deleteOne();

  res.json({
    success: true,
    message: "User removed",
  });
});
