import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

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

  const user = await User.create({ name, email: normalizedEmail, password });

  res.status(201).json({
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
    if (user.status !== "active") {
      res.status(403);
      throw new Error("Account inactive. Contact admin.");
    }

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

  await user.deleteOne();

  res.json({
    success: true,
    message: "User removed",
  });
});
