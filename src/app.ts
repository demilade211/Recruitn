import express, { Express, Request, Response, Application } from "express";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorsMiddleware";
import auth from "./routes/authRoute";
import user from "./routes/user"
import job from "./routes/job"

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to handle url encoded data

app.use("/api/v1", auth);
app.use('/api/v1',user);
app.use('/api/v1',job);

app.use(errorMiddleware);

export default app;
