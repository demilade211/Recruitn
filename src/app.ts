import express, { Express, Request, Response , Application } from 'express';  
import cors from "cors";

const app: Application = express(); 


app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});



export default app;