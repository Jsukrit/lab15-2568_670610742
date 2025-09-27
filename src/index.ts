import express from "express";
import morgan from "morgan";
import { type Request, type Response } from "express";
import studentRouter from "./routes/studentRoutes.js";
import courseRouter from "./routes/courseRoutes.js";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "lab 15 API service successsfully",
  });
});

app.get("/me", (_req: any, res: any) => {
  res.status(200)({
    success: true,
    massage: "Student Information",
    data: {
      studentId: "670610742",
      firstName: "Sukrit",
      lastName: "Jitaree",
      program: "CPE",
      section: "001",
    },
  });
});

app.use("/api/v2/students", studentRouter);
app.use("/api/v2/courses", courseRouter);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;
