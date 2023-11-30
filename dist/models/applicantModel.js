"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const Schema = mongoose_1.default.Schema;
const ApplicantSchema = new Schema({
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
        unique: true,
        validate: [validator_1.default.isEmail, "Please enter valid email address"],
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Applicant", ApplicantSchema);
