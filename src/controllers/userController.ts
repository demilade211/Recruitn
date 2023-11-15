import UserModel from "../models/userModel" 
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import {CustomRequest} from "../utils/types"

export const getLoggedInUser = async(req: CustomRequest, res: Response, next: NextFunction)=>{
    const {_id} = req.user;

    try {  
        const user = await UserModel.findById(_id);  


        return res.status(200).json({
            success: true,
            user 
            
        })

    } catch (error) {
        return next(error)
    }
} 

 
 