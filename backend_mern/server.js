import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import db from "./db/db.js";
import connectDB from "./db/db.js";
const app = express();
import cors from "cors";
import authRoute from "./routes/authRoute.js";
app.use(cors(
     {
          origin: ["http://localhost:5173","https://task-management-syste-git-96807b-sunil-kumars-projects-0e93c9f4.vercel.app"],
          credentials: true
     }
));
const port = process.env.PORT || 5000;
connectDB();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded(
     { 
          extended: true 
     }));

app.use("/api/user",authRoute);

app.get("/", (req, res) => {
    res.send("Backend is running");
}
);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    });