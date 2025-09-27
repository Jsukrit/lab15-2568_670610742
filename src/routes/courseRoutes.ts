import { Router } from "express";
import { type Request, type Response } from "express";
import {
  zCoursePostBody,
  zCoursePutBody,
  zCourseDeleteBody,
  zCourseId,
} from "../schemas/courseValidator.js";
import { students, courses } from "../db/db.js";
import type { Course } from "../libs/types.js";

const router: Router = Router();

// READ all
router.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: courses,
  });
});

// Params URL
router.get("/:courses", (req: Request, res: Response) => {
  const courseId = Number(req.params.courses);
  const result = zCourseId.safeParse(courseId);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: result.error.issues[0]?.message,
    });
  }

  const found = courses.findIndex((cou: Course) => cou.courseId === courseId);

  if (found === -1) {
    return res.status(404).json({
      success: false,
      message: "Course does not exists",
    });
  }
  return res.json({
    success: true,
    message: `Get course ${courses[found]?.courseId} successfully`,
    data: courses[found],
  });
});

router.post("/", (req: Request, res: Response) => {
  const body = req.body;
  const result = zCoursePostBody.safeParse(body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: result.error.issues[0]?.message,
    });
  }

  const found = courses.find((cou: Course) => cou.courseId === body.courseId);

  if (found) {
    return res.status(409).json({
      success: false,
      message: "Course Id already exists",
    });
  }
  courses.push(body);
  res.json({
    success: true,
    message: `Course ${body.courseId} has been add successfully`,
    data: body,
  });
});

router.put("/", (req: Request, res: Response) => {
  const body = req.body;
  const result = zCoursePutBody.safeParse(body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: result.error.issues[0]?.message,
    });
  }

  const found = courses.findIndex(
    (cou: Course) => cou.courseId === body.courseId
  );
  if (found === -1) {
    return res.status(404).json({
      success: false,
      message: "Course Id does not exists",
    });
  }
  courses[found] = { ...students[found], ...body };
  res.json({
    success: true,
    message: `Course ${body.courseId} has been update successfully`,
    data: body,
  });
});

router.delete("/", (req: Request, res: Response) => {
  const body = req.body;
  const result = zCourseDeleteBody.safeDecode(body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: result.error.issues[0]?.message,
    });
  }

  const found = courses.findIndex(
    (cou: Course) => cou.courseId === body.courseId
  );
  if (found === -1) {
    return res.status(404).json({
      success: false,
      message: "Course Id does not exists",
    });
  }

  const deleted = courses[found];
  courses.splice(found, found + 1);
  res.json({
    success: true,
    message: `Course ${body.courseId} has been delete successfully`,
    data: deleted,
  });
});

export default router;
