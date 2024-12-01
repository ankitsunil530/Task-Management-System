import express from 'express';
import {login,register,logout, deleteUser} from '../controllers/auth.js';

const router = express.Router();

router.post('/register',register);


router.post('/login',login);


router.post('/logout',logout);

router.post('/delete/:user_id',deleteUser);
export default router;