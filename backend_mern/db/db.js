import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;

  const connect = async () => {
    try {
      let mongoUri = process.env.MONGO_URI;

      // If no MONGO_URI or in development, use in-memory MongoDB
      if (!mongoUri || process.env.NODE_ENV === "development") {
        if (!mongoServer) {
          mongoServer = await MongoMemoryServer.create();
          mongoUri = mongoServer.getUri();
          console.log(`🗄️ Using in-memory MongoDB at: ${mongoUri}`);
        }
      }

      const conn = await mongoose.connect(mongoUri, {
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

// Gracefully stop in-memory MongoDB on shutdown
process.on("SIGTERM", async () => {
  if (mongoServer) {
    await mongoServer.stop();
    console.log("🗄️ In-memory MongoDB stopped");
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  if (mongoServer) {
    await mongoServer.stop();
    console.log("🗄️ In-memory MongoDB stopped");
  }
  process.exit(0);
});

export default connectDB;
