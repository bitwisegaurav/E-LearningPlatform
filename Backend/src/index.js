// require('dotenv').config({ path: "../.env" });
import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./database/connection.db.js";

dotenv.config();

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server is running at", process.env.PORT || 3000);
        });
    })
    .catch((err) => {
        console.log("Database connection failed. Error : ", err);
    });