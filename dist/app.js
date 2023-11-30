"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const errorsMiddleware_1 = __importDefault(require("./middlewares/errorsMiddleware"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const user_1 = __importDefault(require("./routes/user"));
const job_1 = __importDefault(require("./routes/job"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); //to handle url encoded data
app.use("/api/v1", authRoute_1.default);
app.use('/api/v1', user_1.default);
app.use('/api/v1', job_1.default);
app.use(errorsMiddleware_1.default);
exports.default = app;
