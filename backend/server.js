import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.js';
import UserRoute from './routes/ueserRoutes.js';
import taskRoutes from './routes/task.js';
import cors from 'cors';
import usersRoutes from './routes/users.js';
import cookieParser from 'cookie-parser';
import verifyToken from './middleware/authenticateToken.js';

const app = express();

// Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-credentials', true);
    next();
});
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5000",
}));
app.use(cookieParser());

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", verifyToken, UserRoute);  
app.use("/api/tasks", verifyToken, taskRoutes);  

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
