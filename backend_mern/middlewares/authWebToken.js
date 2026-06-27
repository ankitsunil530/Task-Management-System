import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  try {
    // 1️⃣ Token from cookies OR headers
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ No token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 5️⃣ Block users who are not active even if their JWT is valid
    if (req.user.status !== "active" || req.user.emailVerified === false) {
      return res.status(403).json({
        message: "Email not verified. Please check your inbox.",
      });
    } 

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export default protect;
