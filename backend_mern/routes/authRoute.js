import express from "express";
import { deleteUser, getAllUsers, getUser, loginUser, logoutUser, registerUser,userProfile } from "../controllers/authController.js";
import auth from "../middlewares/authWebToken.js";

const router=express.Router();
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/register",registerUser);
router.get("/profile",auth,userProfile);
router.delete("/delete/:user_id",auth,deleteUser);
router.get("/user",getUser);
router.get("/all",getAllUsers);

export default router;