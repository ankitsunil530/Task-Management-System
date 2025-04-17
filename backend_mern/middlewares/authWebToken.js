import jwt from 'jsonwebtoken';
const auth = (request, response, next) => {
  try {
    const token =
      request.cookies.accessToken ||
      (bearerToken &&
        bearerToken.startsWith("Bearer ") &&
        bearerToken.split(" ")[1]);
    if (!token) {
      return response.status(401).json({
        message: "Token not provided",
        error: true,
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return response.status(401).json({
        message: "Unauthorized access",
        error: true,
        success: false,
      });
    }
    request.user = decoded;
    next();
  } catch (error) {
    return response.status(401).json({
      message: "Invalid or expired token",
      error: true,
      success: false,
    });
  }
};

export default auth;
