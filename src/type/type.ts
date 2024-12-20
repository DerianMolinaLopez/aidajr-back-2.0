import { CoursesInter } from "../models/Courses";
import { ObjectId } from "mongoose";
import { UserInter } from "../models/User";
import z from "zod";
import {IUnionCode } from "../models/UnionCode";
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

export type UserId = {
    _id: ObjectId;
    // Agrega aquí los campos adicionales que pueda tener el objeto user_Id
};

export type InstructorId = {
    _id: ObjectId;
    user_Id: UserId;
};

export type Course = {
    _id: ObjectId;
    name: string;
    description: string;
    instructor_Id: InstructorId;
    tipoCurso: string;
    valoration: number;
};

export type Curso = {
    _id: ObjectId;
    course: Course;
};

export type CursoShort = {
    _id:string
    name: string;
    description : string;
    valoracion: number;
    tipoCurso: string;
    instructor:string;
};
export type UnionCodeObj = {
    _id:IUnionCode["_id"];
    code: IUnionCode["code"];
    name:string;
}
export const IntegranteSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
}
)
export type Integrante = z.infer<typeof IntegranteSchema>;