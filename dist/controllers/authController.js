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
exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createToken_1 = __importDefault(require("../utils/createToken"));
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, numOfEmployees, phoneNumber, companyName, email, password, confirmPassword } = req.body;
        if (!firstName || !lastName || !numOfEmployees || !phoneNumber || !companyName || !email || !password || !confirmPassword)
            return next(new errorHandler_1.default("All fields required", 400));
        if (password !== confirmPassword)
            return next(new errorHandler_1.default("Passwords do not match", 200));
        if (password.length < 6)
            return next(new errorHandler_1.default("Password cannot be less than 6 characters", 200));
        const user = yield userModel_1.default.findOne({ email: email.toLowerCase() });
        if (user)
            return next(new errorHandler_1.default("User already registered", 200));
        const savedUser = yield userModel_1.default.create({
            firstName,
            lastName,
            numOfEmployees,
            phoneNumber,
            companyName,
            email: email.toLowerCase(),
            password,
        });
        const payload = { userid: savedUser._id };
        let authToken = yield (0, createToken_1.default)(payload);
        res.status(200).json({
            success: true,
            token: authToken,
            name: savedUser.companyName,
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password)
            return next(new errorHandler_1.default("Email and password is required", 400));
        const user = yield userModel_1.default.findOne({ email }).select("+password");
        const checkPassword = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!user || !checkPassword) {
            return next(new errorHandler_1.default("Email or password is incorrect", 401));
        }
        const payload = { userid: user._id };
        let authToken = yield (0, createToken_1.default)(payload);
        res.status(201).json({
            success: true,
            token: authToken,
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.loginUser = loginUser;
