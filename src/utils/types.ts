import { Request, Response, NextFunction } from 'express';
import mongoose, { Document } from 'mongoose';

export interface CustomRequest extends Request {
    user?: any | null,
    headers: any
}

export interface IJob {
    user: any,
    title: string,
    description: string,
    responsibility: string,
    requirements: string,
    salary: number,
    status: string,
    mode: string,
    applicants?: any,
    customQuestions?: any;
}
export interface Applicants { 
    applicant: Applicant,  
}
export interface Applicant { 
    firstName: string,
    lastName: string,
    resume?: string, 
    yearsOfEperience: number,  
}