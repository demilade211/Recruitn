import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { createJob, getJobs,closeJob,openJob, getJobById, getCompanyJobs, deleteJob, applyForJob } from "../controllers/jobController"

const router = express.Router()

router.route('/job/create').post(authenticateUser, createJob);
router.route('/job/close/:jobId').post(authenticateUser, closeJob);
router.route('/job/open/:jobId').post(authenticateUser, openJob);
router.route('/job/apply/:jobId').post(applyForJob);

router.route('/job/jobs').get(getJobs);
router.route('/job/:jobId').get(authenticateUser, getJobById)
    .delete(authenticateUser, deleteJob);
router.route('/jobs/me').get(authenticateUser, getCompanyJobs);







export default router;