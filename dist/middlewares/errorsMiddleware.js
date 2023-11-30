"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const errors = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        console.log(err);
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    }
    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = Object.assign({}, err);
        error.message = err.message;
        // Wrong Mongoose Object ID Error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new errorHandler_1.default(message, 400);
        }
        // Handling Mongoose Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map((value) => value.message);
            error = new errorHandler_1.default(message, 400);
        }
        // Handling Mongoose duplicate key errors
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new errorHandler_1.default(message, 400);
        }
        // Handling wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token is invalid. Try Again!!!';
            error = new errorHandler_1.default(message, 400);
        }
        // Handling Expired JWT error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token is expired. Try Again!!!';
            error = new errorHandler_1.default(message, 200);
        }
        if (err.response) {
            if (err.response.data.message === 'Could not resolve account name. Check parameters or try again.') {
                const message = 'Please check account number';
                error = new errorHandler_1.default(message, 200);
            }
            if (err.response.data.status === false) {
                const message = err.response.data.message;
                error = new errorHandler_1.default(message, 200);
            }
        }
        console.log("status code", error.statusCode, "message", error.message);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};
exports.default = errors;
