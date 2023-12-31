import { Request, Response, NextFunction } from "express";
import UserModel from "../models/userModel";
import ErrorHandler from "../utils/errorHandler";
import jwt, { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";
import newOTP from "otp-generator";
import createToken from "../utils/createToken";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, numOfEmployees, phoneNumber, companyName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !numOfEmployees || !phoneNumber || !companyName || !email || !password || !confirmPassword) return next(new ErrorHandler("All fields required", 400));

    if (password !== confirmPassword) return next(new ErrorHandler("Passwords do not match", 200));

    if (password.length < 6) return next(new ErrorHandler("Password cannot be less than 6 characters", 200));

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (user) return next(new ErrorHandler("User already registered", 200));

    const savedUser = await UserModel.create({
      firstName,
      lastName,
      numOfEmployees,
      phoneNumber,
      companyName,
      email: email.toLowerCase(),
      password,
    });

    const payload = { userid: savedUser._id };

    let authToken = await createToken(payload);

    res.status(200).json({
      success: true,
      token: authToken,
      name: savedUser.companyName,
    });

  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return next(new ErrorHandler("Email and password is required", 400));

    if (password.length < 6) return next(new ErrorHandler("Password cannot be less than 6 characters", 200))


    const user = await UserModel.findOne({ email: email.toLowerCase() }).select("+password")


    if (!user) return next(new ErrorHandler("Invalid Credentials", 200)) 
     

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid Credentials", 200))
    }

    const payload = { userid: user._id };

    let authToken = await createToken(payload);

    res.status(201).json({
      success: true,
      token: authToken,
    });

  } catch (error) {
    return next(error);
  }
};
