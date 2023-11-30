"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./database/db"));
// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
});
process.on('SIGTERM', err => {
    process.exit(1);
});
dotenv_1.default.config({ path: "src/config/config.env" });
(0, db_1.default)();
const port = process.env.PORT || 8000;
const server = app_1.default.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port} in ${process.env.NODE_ENV} MODE`);
});
//Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});
