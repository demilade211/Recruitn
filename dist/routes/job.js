"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const jobController_1 = require("../controllers/jobController");
const router = express_1.default.Router();
router.route('/job/create').post(authMiddleware_1.authenticateUser, jobController_1.createJob);
router.route('/job/close/:jobId').post(authMiddleware_1.authenticateUser, jobController_1.closeJob);
router.route('/job/open/:jobId').post(authMiddleware_1.authenticateUser, jobController_1.openJob);
router.route('/job/apply/:jobId').post(jobController_1.applyForJob);
router.route('/job/jobs').get(jobController_1.getJobs);
router.route('/job/:jobId').get(authMiddleware_1.authenticateUser, jobController_1.getJobById)
    .delete(authMiddleware_1.authenticateUser, jobController_1.deleteJob);
router.route('/jobs/me').get(authMiddleware_1.authenticateUser, jobController_1.getCompanyJobs);
exports.default = router;
