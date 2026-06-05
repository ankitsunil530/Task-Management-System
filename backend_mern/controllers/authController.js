import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Derive a unique, mention-friendly username at registration. Based on the email
// local-part, lowercased and stripped to [a-z0-9_] so it matches the @(\w+)
// tokens parsed from task comments. Falls back to "user" when the local part has
// no usable characters, and appends a numeric suffix on collision. The sparse
// unique index on User.username is the hard guarantee of uniqueness.
const generateUniqueUsername = async (email, name) => {
  const source = (String(email).split("@")[0] || name || "user").toLowerCase();
  const base = source.replace(/[^a-z0-9_]/g, "").slice(0, 20) || "user";

  let candidate = base;
  let suffix = 0;
  // eslint-disable-next-line no-await-in-loop
  while (await User.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
  return candidate;
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

  const username = await generateUniqueUsername(normalizedEmail, name);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    username,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
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
        username: user.username,
        role: user.role,
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

// ================= LOGOUT =================
export const logoutUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// ================= ADMIN: GET ALL USERS =================
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({
    success: true,
    count: users.length,
    data: users,
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
