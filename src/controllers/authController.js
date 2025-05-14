import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password:hashedPassword, isMfaActive:false });
        await newUser.save();
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error creating user", message: error });
    }
}
export const login = async (req,res) => { 
    console.log("The authenticated user is : ", req.user);
    res.status(200).json({
        message: "User logged in successfully",
        user: req.user.username,
        isMfaActive:req.user.isMfaActive
    })
}
export const logout = async (req,res) => {
    if(!req.user)  return res.status(401).json({message: "Unauthorized User"})
    req.logout((err)=>{
        if(err) return res.status(400).json({message: "User not logged In"});
        res.status(200).json({message: "User logged out successfully"});
    });
 }
export const authStatus = async (req,res) => {
    if(req.user){
    res.status(200).json({
        message: "User logged in successfully",
        username: req.user.username,
        isMfaActive:req.user.isMfaActive,
        })
    }
    else{
        res.status(401).json({message: "Unauthorized User"})
        }
 }
export const setup2FA = async (req,res) => { 
    try {
        console.log("The req.user is : ", req.user);
        const user = req.user;
        var secret = speakeasy.generateSecret();
        console.log("The secret object is : ", secret)
        user.twoFactorSecret=secret.base32;
        user.isMfaActive=true
        await user.save();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${req.user.username}`,
            issuer: "My App",
            encoding:'base32'
        })
        const qrImageUrl= await qrCode.toDataURL(url)
        res.status(200).json({message: "2FA setup successfully", secret: secret.base32, qrCode:qrImageUrl});
    } catch (error) {
        res.status(500).json({error: "Error setting up 2FA", message : error.message});
    }
}
export const verify2FA = async (req, res) => {
    try {
        console.log("The req.user is : ", req.user);
        const user = req.user;
        const token = req.body.token;
        const result = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });
        if (result) {
            const jwtToken = jwt.sign({username: user.username}, process.env.JWT_SECRET, {expiresIn : "1hr"})
            res.status(200).json({ message: "2FA verified successfully", token:jwtToken });
        }
        else {
            res.status(400).json({ message: "Invalid 2FA token" });
        }
    } catch (error) {
        res.status(500).json({error: "Error verifying 2FA", message: error.message});
    }
}
export const reset2FA = async (req, res) => {
    try {
        console.log("The req.user is : ", req.user);
        const user = req.user;
        user.isMfaActive = false
        user.twoFactorSecret = ""
        await user.save();
        res.status(200).json({ message: "2FA reset successfully" });
    } catch (error) {
        res.status(500).json({error: "Error resetting 2FA", message: error.message});
    }
}
