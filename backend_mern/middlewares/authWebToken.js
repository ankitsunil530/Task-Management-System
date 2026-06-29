import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Cache valid user objects in memory for 1 minute to reduce database load
// on consecutive API calls (dashboard updates, statistics fetches, socket polls).
const userCache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

// Periodically clean up expired cache entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of userCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      userCache.delete(key);
    }
  }
}, 5 * 60 * 1000).unref(); // Runs every 5 minutes in background without keeping process alive

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

    // 4️⃣ Check memory cache first to save DB queries
    const cached = userCache.get(decoded.id);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL) {
      req.user = cached.user;
    } else {
      // Fetch fresh user from DB
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      req.user = user;
      // Populate memory cache
      userCache.set(decoded.id, {
        user,
        timestamp: now,
      });
    }

    // 5️⃣ Block users who are not active even if their JWT is valid
    if (req.user.status && req.user.status !== "active") {
      return res.status(403).json({
        message: "Account inactive. Contact admin.",
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
