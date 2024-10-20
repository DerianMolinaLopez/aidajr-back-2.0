import { CoursesInter } from "../models/Courses";
import { UserInter } from "../models/User";
import { SectionsInter } from "../models/Sections";
export type CourseShort = Pick<CoursesInter, "name" | "description" | "tipoCurso" | "valoration"|"id">;
export type UserAux = Pick<UserInter, "name" | "email" | "type_user" |"password">;
export type Section = Pick<SectionsInter, "name" | "description" | "course">;
export type Sections = {sections:Section[]};
/*
"user_Id": {
            "_id": "670421bcf168e5fda8de9250",
            "name": "Angel Martin Gastellum Borbon",
            "email": "borbon@gmail.com"
        },
*/
export type InstructorUsuario =Pick<UserInter, "name" | "email" | "_id">;