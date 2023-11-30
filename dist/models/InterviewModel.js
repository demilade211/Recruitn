"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const InterviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    job: {
        type: Schema.Types.ObjectId,
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
                type: Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Interview", InterviewSchema);
