import UserModel from "../models/userModel"
import JobModel from "../models/jobModel"
import InterviewModel from "../models/InterviewModel"
import ApplicantModel from "../models/applicantModel"
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { paginate } from "../utils/helpers"
import { CustomRequest } from "../utils/types"
import {IJob,Applicants} from "../utils/types"


export const createJob = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { title, description, responsibility, requirements, salary, status, interviewType, mode,customQuestions } = req.body;
    const { _id } = req.user


    try {

        if (!title || !description || !responsibility || !requirements || !salary || !status || !interviewType || !mode) return next(new ErrorHandler("All fields required", 400));

        const newJob:IJob = {
            user: _id,//gotten from the middleware
            title,
            description,
            responsibility,
            requirements,
            salary,
            status,
            mode,
        }

        if (customQuestions){
            newJob.customQuestions=[...customQuestions]
        }

        const job = await JobModel.create(newJob);

        let interview = {
            user: _id,
            job: job._id,
            interviewType,
            applicants: []
        };


        const savedInterview = await InterviewModel.create(interview);


        const jobCreated = await JobModel.findById(job._id).populate("user")

        return res.status(200).json({
            success: true,
            message: "Job Created Successfully",
            jobCreated,
            savedInterview
        })

    } catch (error) {
        return next(error)

    }
}

export const getJobs = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 8;

    try {
        let jobs;

        if (number === 1) {
            jobs = await JobModel.find().sort({ createdAt: -1 })
                .limit(size)
                .populate('user')
        } else {
            const skips = size * (number - 1)
            jobs = await JobModel.find()
                .skip(skips)//to skip previously fetched Jobs
                .limit(size)
                .sort({ createdAt: -1 })
                .populate('user')
        }

        return res.status(200).json({
            success: true,
            jobs
        })

    } catch (error) {
        return next(error)
    }
}

export const getJobById = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { jobId } = req.params;
    try {
        const job = await JobModel.findById(jobId)
            .populate('user')
            .populate("applicants.applicant")

        if (!job) return next(new ErrorHandler("Job not found", 404))

        return res.status(200).json({
            success: true,
            job
        })

    } catch (error) {
        return next(error)
    }
}

export const getCompanyJobs = async (req: CustomRequest, res: Response, next: NextFunction) => {
     
    const { pageNumber } = req.query;
    const size = 8;
    const {_id} = req.user;

    try {

        const user = await UserModel.findOne({ _id })

        if (!user) return next(new ErrorHandler("User not found", 404))

        console.log(user);
        
        const jobs = await JobModel.find({ user: _id })
            .sort({ createdAt: -1 })
            .populate("user")
            .populate("applicants.applicant")


        let paginatedJobs = paginate(jobs, Number(pageNumber), size)

        return res.status(200).json({
            success: true,
            jobs: paginatedJobs
        })

    } catch (error) {
        return next(error)
    }
}

export const deleteJob = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.user
    const { jobId } = req.params;
    try {
        const job = await JobModel.findById(jobId);
        

        if (!job) return next(new ErrorHandler("job not found", 404))

        const user = await UserModel.findById(id)

        if (job.user?.toString() !== id) {
            if (user?.role === "admin") {//check if u are administrator

                await job.deleteOne();
                await InterviewModel.deleteMany({ job: job?._id })

                return res.status(200).json({
                    success: true,
                    message: "job deleted successfully"
                })
            } else {
                return next(new ErrorHandler("You Dont have authority to delete this job", 401))
            }
        }

        await job.deleteOne();
        await InterviewModel.deleteMany({ job: job?._id })

        return res.status(200).json({
            success: true,
            message: "job deleted successfully"
        })
    } catch (error) {
        return next(error)
    }
}

export const applyForJob = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { jobId } = req.params;
    const { firstName, lastName, email, resume, yearsOfExperience } = req.body
    try {
        const job = await JobModel.findById(jobId).populate("applicants.applicant")
        if (!job) return next(new ErrorHandler("job not found", 404))

        if (!email || !yearsOfExperience || !firstName || !lastName || !resume  ) return next(new ErrorHandler("All fields required", 400));

        let newApplicant = {
            firstName,
            lastName,
            email,
            resume,
            yearsOfExperience
        }

        const existingApplicant = await ApplicantModel.findOne({ email: email.toLowerCase() });

        let applicant 

        if (existingApplicant) {
            applicant = existingApplicant;
            console.log("yes");
            
        }else{
            applicant= await ApplicantModel.create(newApplicant);
        } 
        console.log(job.applicants);
        
        const alreadyApplied = job.applicants.filter((val:any) => val.applicant.email === email).length>0; 
        
        if (alreadyApplied) return next(new ErrorHandler("Already applied", 400));

        await job.applicants.unshift({ applicant: applicant._id })
        await job.save()

        return res.status(200).json({
            success: true,
            message: "Applied Successfully"
        })

    } catch (error) {
        return next(error)
    }
}

export const closeJob = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { jobId } = req.params; 
    try {
        const job = await JobModel.findById(jobId).populate("applicants.applicant")
        if (!job) return next(new ErrorHandler("job not found", 404)) 

        job.status = "closed"
        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job Closed Successfully"
        })

    } catch (error) {
        return next(error)
    }
}

export const openJob = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { jobId } = req.params; 
    try {
        const job = await JobModel.findById(jobId).populate("applicants.applicant")
        if (!job) return next(new ErrorHandler("job not found", 404)) 

        job.status = "open"
        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job Opened Successfully"
        })

    } catch (error) {
        return next(error)
    }
}