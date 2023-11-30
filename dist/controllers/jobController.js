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
exports.openJob = exports.closeJob = exports.applyForJob = exports.deleteJob = exports.getCompanyJobs = exports.getJobById = exports.getJobs = exports.createJob = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jobModel_1 = __importDefault(require("../models/jobModel"));
const InterviewModel_1 = __importDefault(require("../models/InterviewModel"));
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const helpers_1 = require("../utils/helpers");
const createJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, responsibility, requirements, salary, status, interviewType, mode, customQuestions } = req.body;
    const { _id } = req.user;
    try {
        if (!title || !description || !responsibility || !requirements || !salary || !status || !interviewType || !mode)
            return next(new errorHandler_1.default("All fields required", 400));
        const newJob = {
            user: _id,
            title,
            description,
            responsibility,
            requirements,
            salary,
            status,
            mode,
        };
        if (customQuestions) {
            newJob.customQuestions = [...customQuestions];
        }
        const job = yield jobModel_1.default.create(newJob);
        let interview = {
            user: _id,
            job: job._id,
            interviewType,
            applicants: []
        };
        const savedInterview = yield InterviewModel_1.default.create(interview);
        const jobCreated = yield jobModel_1.default.findById(job._id).populate("user");
        return res.status(200).json({
            success: true,
            message: "Job Created Successfully",
            jobCreated,
            savedInterview
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.createJob = createJob;
const getJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 8;
    try {
        let jobs;
        if (number === 1) {
            jobs = yield jobModel_1.default.find().sort({ createdAt: -1 })
                .limit(size)
                .populate('user');
        }
        else {
            const skips = size * (number - 1);
            jobs = yield jobModel_1.default.find()
                .skip(skips) //to skip previously fetched Jobs
                .limit(size)
                .sort({ createdAt: -1 })
                .populate('user');
        }
        return res.status(200).json({
            success: true,
            jobs
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.getJobs = getJobs;
const getJobById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    try {
        const job = yield jobModel_1.default.findById(jobId)
            .populate('user');
        if (!job)
            return next(new errorHandler_1.default("Job not found", 404));
        return res.status(200).json({
            success: true,
            job
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.getJobById = getJobById;
const getCompanyJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { pageNumber } = req.query;
    const size = 8;
    try {
        const user = yield userModel_1.default.findOne({ _id: userId });
        if (!user)
            return next(new errorHandler_1.default("User not found", 404));
        console.log(user);
        const jobs = yield jobModel_1.default.find()
            .sort({ createdAt: -1 })
            .populate("user");
        let paginatedJobs = (0, helpers_1.paginate)(jobs, Number(pageNumber), size);
        return res.status(200).json({
            success: true,
            jobs: paginatedJobs
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.getCompanyJobs = getCompanyJobs;
const deleteJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.user;
    const { jobId } = req.params;
    try {
        const job = yield jobModel_1.default.findById(jobId);
        if (!job)
            return next(new errorHandler_1.default("job not found", 404));
        const user = yield userModel_1.default.findById(id);
        if (((_a = job.user) === null || _a === void 0 ? void 0 : _a.toString()) !== id) {
            if ((user === null || user === void 0 ? void 0 : user.role) === "admin") { //check if u are administrator
                yield job.deleteOne();
                yield InterviewModel_1.default.deleteMany({ job: job === null || job === void 0 ? void 0 : job._id });
                return res.status(200).json({
                    success: true,
                    message: "job deleted successfully"
                });
            }
            else {
                return next(new errorHandler_1.default("You Dont have authority to delete this job", 401));
            }
        }
        yield job.deleteOne();
        yield InterviewModel_1.default.deleteMany({ job: job === null || job === void 0 ? void 0 : job._id });
        return res.status(200).json({
            success: true,
            message: "job deleted successfully"
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteJob = deleteJob;
const applyForJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    const { firstName, lastName, email, resume, yearsOfExperience } = req.body;
    try {
        const job = yield jobModel_1.default.findById(jobId).populate("applicants.applicant");
        if (!job)
            return next(new errorHandler_1.default("job not found", 404));
        if (!email || !yearsOfExperience || !firstName || !lastName || !resume)
            return next(new errorHandler_1.default("All fields required", 400));
        let newApplicant = {
            firstName,
            lastName,
            email,
            resume,
            yearsOfExperience
        };
        const existingApplicant = yield applicantModel_1.default.findOne({ email: email.toLowerCase() });
        let applicant;
        if (existingApplicant) {
            applicant = existingApplicant;
            console.log("yes");
        }
        else {
            applicant = yield applicantModel_1.default.create(newApplicant);
        }
        console.log(job.applicants);
        const alreadyApplied = job.applicants.filter((val) => val.applicant.email === email).length > 0;
        if (alreadyApplied)
            return next(new errorHandler_1.default("Already applied", 400));
        yield job.applicants.unshift({ applicant: applicant._id });
        yield job.save();
        return res.status(200).json({
            success: true,
            message: "Applied Successfully"
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.applyForJob = applyForJob;
const closeJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    try {
        const job = yield jobModel_1.default.findById(jobId).populate("applicants.applicant");
        if (!job)
            return next(new errorHandler_1.default("job not found", 404));
        job.status = "closed";
        yield job.save();
        return res.status(200).json({
            success: true,
            message: "Job Closed Successfully"
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.closeJob = closeJob;
const openJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    try {
        const job = yield jobModel_1.default.findById(jobId).populate("applicants.applicant");
        if (!job)
            return next(new errorHandler_1.default("job not found", 404));
        job.status = "open";
        yield job.save();
        return res.status(200).json({
            success: true,
            message: "Job Opened Successfully"
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.openJob = openJob;
