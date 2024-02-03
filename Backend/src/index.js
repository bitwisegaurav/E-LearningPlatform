// require('dotenv').config({ path: "../.env" });
import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./database/connection.db.js";

dotenv.config();

connectDB();