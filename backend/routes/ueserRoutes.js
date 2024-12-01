import express from 'express';
import { getUserInfoController } from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticateToken.js';  

const router = express.Router();


router.get('/user', authenticateToken, getUserInfoController);

export default router;
