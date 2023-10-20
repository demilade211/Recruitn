import app from "./app";
import dotenv from 'dotenv';


dotenv.config({ path: "config/config.env" });

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});