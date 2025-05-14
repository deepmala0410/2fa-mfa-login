import { Router } from "express";
import passport from "passport";
import { register, login, logout, setup2FA, verify2FA, reset2FA, authStatus } from "../controllers/authController.js";

const router = Router();

//register
router.post("/register", register);

//login 
router.post("/login", passport.authenticate("local"), login);

//status
router.get("/status", authStatus);

//logout
router.post("/logout", logout);

//2Fa
router.post("/setup2FA", (req,res,next)=>{
    if(req.isAuthenticated()) next();
    else res.status(401).json({message:"Unauthorized"});
}, setup2FA);

//verify2fa
router.post("/verify2FA",(req,res,next)=>{
    if(req.isAuthenticated()) next();
    else res.status(401).json({message:"Unauthorized"});
}, verify2FA);

//reset 2fa
router.post("/reset2FA",(req,res,next)=>{
    if(req.isAuthenticated()) next();
    else res.status(401).json({message:"Unauthorized"});
}, reset2FA);

export default router;