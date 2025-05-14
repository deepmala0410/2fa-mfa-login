import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isMfaActive: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String,
    },
    },
    {
        timestamps: true
    }

)
const USER = mongoose.model("User", userSchema)
export default USER;