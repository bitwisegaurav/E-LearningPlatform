import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = ['http://127.0.0.1:3000', 'http://127.0.0.1:5500', 'http://127.0.0.1:5501', 'http://localhost:3000', 'http://localhost:5500', 'http://localhost:5501'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// setting middlewares
// app.use(
//     cors({
//         origin: "http://localhost:3000",
//         credentials: true,
//     }),
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// importing routes
import imageRoutes from "./routers/image.routes.js";
import userRoutes from "./routers/user.routes.js";
import courseRoutes from "./routers/course.routes.js";
import moduleRoutes from "./routers/module.routes.js";
import roadmapRoutes from "./routers/roadmap.routes.js";
import followerRoutes from "./routers/follower.routes.js";
import articleRoutes from "./routers/article.routes.js";
import assignmentRoutes from "./routers/assignment.routes.js";
import degreeRoutes from "./routers/degree.routes.js";
import subjectRoutes from "./routers/subject.routes.js";
import interviewQuestionRoutes from "./routers/interviewQuestion.routes.js";

// setting routes
app.use("/api/v1/image", imageRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/module", moduleRoutes);
app.use("/api/v1/roadmap", roadmapRoutes);
app.use("/api/v1/follower", followerRoutes);
app.use("/api/v1/article", articleRoutes);
app.use("/api/v1/assignment", assignmentRoutes);
app.use("/api/v1/degree", degreeRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/interview-question", interviewQuestionRoutes);

export { app };