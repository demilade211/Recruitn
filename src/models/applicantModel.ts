import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const ApplicantSchema = new Schema(
    {
        firstName: {
            type: String,
            maxlength: [30, "Your name cannot exceed 30 characters"],
        },
        lastName: {
            type: String,
            maxlength: [30, "Your name cannot exceed 30 characters"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true, // cant have more than one if this
            validate: [validator.isEmail, "Please enter valid email address"],
        },
        phoneNumber: {
            type: String, 
        },
        resume: {
            public_id: {
                type: String,
                default: "App/user_mklcpl.png",
            },
            url: {
                type: String, 
            },
        },
        yearsOfExperience: {
            type: Number, 
            required: [true, "Please enter your years of experience"],
        },
    },
    { timestamps: true }
);



export default mongoose.model("Applicant", ApplicantSchema);
