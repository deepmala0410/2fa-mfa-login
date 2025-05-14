import Passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

Passport.use(new LocalStrategy(async (username, password, done) =>{
    try {
        const user = await User.findOne({ username })
        if (!user) return done(null, false, {message: "User not found"})
        const isValid = await bcrypt.compare(password, user.password)
        if (isValid) return done(null, user)
        return done(null, false, {message:  "Invalid password"})
    } catch (error) {
        return done(error)
    }
}))
Passport.serializeUser(function (user, done) {
    console.log("We are inside serializeUser")
    done(null, user._id)
})
Passport.deserializeUser(async function (_id, done) {
    console.log("We are inside deserializeUser")
    try {
        const user= await User.findById(_id)
        done(null, user)
    } catch (error) {
        done(error)
    }
   
})