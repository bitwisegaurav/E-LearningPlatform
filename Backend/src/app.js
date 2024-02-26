import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// setting middlewares
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }),
);
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// importing routes
import userRoutes from "./routers/user.routes.js";
import courseRoutes from "./routers/course.routes.js";

// setting routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);

export { app };