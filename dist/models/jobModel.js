"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const JobSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
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
        enum: ["onsite", "hybrid", "remote"], // specifies the only values that will be in role
    },
    applicants: [
        {
            applicant: {
                type: Schema.Types.ObjectId,
                ref: "Applicant"
            }
        }
    ],
    customQuestions: [
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Job", JobSchema);
