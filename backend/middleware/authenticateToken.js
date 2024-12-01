import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(403).json("Token is required");
  }

  // Use the secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Invalid or expired token");

    req.user = user;
    next();
  });
};

export default verifyToken;
