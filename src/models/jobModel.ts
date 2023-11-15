import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const JobSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,//gets the  _id from user model
            ref: "User",
        },
        title: {
            type: String,
            required: [true, "Enter job title"],
        },
        description: {
            type: String,
            required: [true, "Please enter your job description"],
        },
        responsibility: {
            type: String,
            required: [true, "Please enter your job responsibility"],
        },
        requirements: {
            type: String,
            required: [true, "Please enter your job requirements"],
        },
        salary: {
            type: Number,
            required: [true, "Please enter your salary"],
        },
        status: {
            type: String,
            default: "open",
            enum: ["open", "closed"], // specifies the only values that will be in role
        }, 
        mode: {
            type: String, 
            enum: ["onsite", "hybrid","remote"], // specifies the only values that will be in role
        },
        applicants:[
            {
                applicant: {
                    type: Schema.Types.ObjectId,//gets the  _id from user model
                    ref: "Applicant"
                }
            }
        ],
        customQuestions:[
            {
                type: {
                    type: String, 
                    required: [true, "Please enter your question type"],
                },
                question: {
                    type: String, 
                    required: [true, "Please enter your question"],
                }
            }
        ],
    },
    { timestamps: true }
);



export default mongoose.model("Job", JobSchema);
