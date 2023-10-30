import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/userModel';
import ErrorHandler from '../utils/errorHandler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import newOTP from 'otp-generator';
import createToken from '../utils/createToken';  

export const registerUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const {companyName, email, password, confirmPassword } = req.body;

        if (!companyName || !email || !password || !confirmPassword) return next(new ErrorHandler('All fields required', 400));

        if (password !== confirmPassword) return next(new ErrorHandler('Passwords do not match', 200));

        if (password.length < 6) return next(new ErrorHandler('Password cannot be less than 6 characters', 200));

        const user = await UserModel.findOne({ email: email.toLowerCase() });

        if (user) return next(new ErrorHandler('User already registered', 200));

        const savedUser = await UserModel.create({
            companyName,
            email: email.toLowerCase(),
            password, 
        });

        let profileFields: any = {}; 

        const payload = { userid: savedUser._id };

        let authToken = await createToken(payload,process.env.SECRETE as string)

        res.status(200).json({
            success: true,
            token: authToken,
            name: savedUser.companyName,
        });
    } catch (error) {
        return next(error);
    }
};
