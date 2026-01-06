import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;

  const connect = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log("✅ Connected to MongoDB");
      return conn;
    } catch (err) {
      retryCount++;
      console.error(`❌ MongoDB connection failed (Attempt ${retryCount}/${maxRetries}):`, err.message);

      if (retryCount < maxRetries) {
        const delay = 2000 * retryCount; // Exponential backoff
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return connect();
      } else {
        console.error("❌ Failed to connect to MongoDB after multiple retries");
        process.exit(1);
      }
    }
  };

  return connect();
};

export default connectDB;
