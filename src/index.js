import express, { urlencoded } from "express";
import session from "express-session";
import Passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import cors from "cors"
import dbConnect from "./config/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passportConfig.js"

dotenv.config();
dbConnect();

const app = express();

//middleware
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json({limit: "100mb"}));
app.use(urlencoded({limit: "100mb", extended : true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60 
        }
        }));
app.use(Passport.initialize());
app.use(Passport.session());

//routes
app.use("/api/auth", authRoutes)

//listen app 
const PORT = process.env.PORT || 7002
app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
);