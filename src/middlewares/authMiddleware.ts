import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from "../models/userModel"
import ErrorHandler from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express'; 
import {CustomRequest} from "../utils/types"



export const authenticateUser = async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const token = req.headers.authorization
        if(!token){
            return next(new ErrorHandler("Login first to access this resource",401))
        }
        const {userid}=jwt.verify(req.headers.authorization,process.env.SECRETE as string) as JwtPayload; 

        let testUser = await UserModel.findById(userid);

        if(!testUser) return next(new ErrorHandler("This user does not exist",404))
        
        req.user = testUser;
        next(); 
    } catch (error) {
        next(error)
    }
}

export const allowedRoles = (...roles: string[])=>{
    return (req: CustomRequest, res: Response, next: NextFunction)=>{
        const {user} = req;

        if(!roles.includes(user.role)){
            return next(new ErrorHandler(`Role ${user.role} is not allowed to access this resource`,401))
        }
        next();
    }
}