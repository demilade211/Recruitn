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
exports.allowedRoles = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return next(new errorHandler_1.default("Login first to access this resource", 401));
        }
        const { userid } = jsonwebtoken_1.default.verify(req.headers.authorization, process.env.SECRETE);
        let testUser = yield userModel_1.default.findById(userid);
        if (!testUser)
            return next(new errorHandler_1.default("This user does not exist", 404));
        req.user = testUser;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authenticateUser = authenticateUser;
const allowedRoles = (...roles) => {
    return (req, res, next) => {
        const { user } = req;
        if (!roles.includes(user.role)) {
            return next(new errorHandler_1.default(`Role ${user.role} is not allowed to access this resource`, 401));
        }
        next();
    };
};
exports.allowedRoles = allowedRoles;
