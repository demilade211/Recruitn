import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const InterviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,//gets the  _id from user model
            ref: "User",
        },
        job: {
            type: Schema.Types.ObjectId,//gets the  _id from user model
            ref: "Job",
        },
        interviewType: {
            type: String,
            required: [true, "Please enter your job requirements"],
            enum: ["cultural", "technical", "cultural and technical"], // specifies the only values that will be in role
        },
        applicants: [
            {
                applicant: {
                    type: Schema.Types.ObjectId,//gets the  _id from user model
                    ref: "Applicant"
                },
                score: {
                    type: Number,
                    required: [true, "Please enter your job requirements"],
                    enum: ["cultural", "technical", "cultural and technical"], // specifies the only values that will be in role
                }
            }
        ],
        expiretoken: { type: Date },
    },
    { timestamps: true }
);



export default mongoose.model("Interview", InterviewSchema);
