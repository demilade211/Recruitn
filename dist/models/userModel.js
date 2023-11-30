"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    firstName: {
        type: String,
        maxlength: [30, "Your name cannot exceed 30 characters"],
    },
    lastName: {
        type: String,
        maxlength: [30, "Your name cannot exceed 30 characters"],
    },
    numOfEmployees: {
        type: Number,
        maxlength: [30, "Your name cannot exceed 30 characters"],
    },
    phoneNumber: {
        type: String,
        maxlength: [30, "Your name cannot exceed 30 characters"],
    },
    companyName: {
        type: String,
        maxlength: [30, "Your name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator_1.default.isEmail, "Please enter valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Your password must be longer than 6 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            default: "App/user_mklcpl.png",
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png",
        },
    },
    role: {
        type: String,
        default: "company",
        enum: ["company", "staff", "admin"], // specifies the only values that will be in role
    },
    resettoken: { type: String },
    expiretoken: { type: Date },
}, { timestamps: true });
// Encrypting password before saving user
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            // a check to confirm if the password is modified before encrypting it
            next();
        }
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
    });
});
exports.default = mongoose_1.default.model("User", UserSchema);
