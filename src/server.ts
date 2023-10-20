import app from "./app";
import dotenv from 'dotenv';
import connectDb from "./database/db"


dotenv.config({ path: "src/config/config.env" });
connectDb();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port} in ${process.env.NODE_ENV} MODE`);
});