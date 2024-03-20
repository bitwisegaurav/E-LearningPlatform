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
import moduleRoutes from "./routers/module.routes.js";
import roadmapRoutes from "./routers/roadmap.routes.js";
import followerRoutes from "./routers/follower.routes.js";
import articleRoutes from "./routers/article.routes.js";
import assignmentRoutes from "./routers/assignment.routes.js";

// setting routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/module", moduleRoutes);
app.use("/api/v1/roadmap", roadmapRoutes);
app.use("/api/v1/follower", followerRoutes);
app.use("/api/v1/article", articleRoutes);
app.use("/api/v1/assignment", assignmentRoutes);

export { app };