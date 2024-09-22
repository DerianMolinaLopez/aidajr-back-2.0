import { CoursesInter } from "../models/Courses";
export type CourseShort = Pick<CoursesInter, "name" | "description" | "tipoCurso" | "valoration"|"id">;