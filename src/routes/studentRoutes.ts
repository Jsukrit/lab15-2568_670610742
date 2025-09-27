import { Router } from "express";
import { type Request, type Response } from "express";
import { zStudentId } from "../schemas/studentValidator.js";
import { students, courses } from "../db/db.js";
import type { Student, Course } from "../libs/types.js";

const router = Router();

router.get("/:studentId/courses", (req: Request, res: Response) => {
  const studentId = req.params.studentId;
  const result = zStudentId.safeParse(studentId);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: result.error.issues[0]?.message,
    });
  }

  const found = students.findIndex(
    (std: Student) => std.studentId === studentId
  );

  if (found === -1) {
    return res.status(404).json({
      success: false,
      message: "Student does not exists",
    });
  }

  const foundcourseId = students[found]?.courses;
  const courseId = courses.filter((objA) =>
    foundcourseId?.some((objB) => objB === objA.courseId)
  );
  const lastcoures = courseId.map((c) => ({
    courseId: c.courseId,
    courseTitle: c.courseTitle,
  }));

  return res.json({
    success: true,
    message: `Get course detail of student ${students[found]?.studentId}`,
    data: {
      studentId: students[found]?.studentId,
      course: lastcoures,
    },
  });
});

export default router;
