import app from "./app";
import dotenv from 'dotenv';
import connectDb from "./database/db"


// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1)
})

process.on('SIGTERM', err => {
    process.exit(1)
})


dotenv.config({ path: "src/config/config.env" });
connectDb();

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port} in ${process.env.NODE_ENV} MODE`);
});

//Handle unhandled promise rejections
process.on("unhandledRejection",(err: Error)=>{
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})