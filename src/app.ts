import express, { Express, Request, Response, Application } from "express";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorsMiddleware";
import auth from "./routes/authRoute";

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to handle url encoded data

app.use("/api/v1/user", auth);

app.use(errorMiddleware);

export default app;
