import { Request,Response } from "express";
import Student from "../models/Student";
import Student_Courses from "../models/Student_courses";
import { CourseShort } from "../type/type";
import User from "../models/User";
import Courses, { CoursesInter } from "../models/Courses";
export class Usercontroller{
    static async getStudent(req:Request,res:Response){
    res.json({estudiante:req.user})
    }

    //!este queda pendiente
    static async getCoursesByStudent(req:Request,res:Response){
      try{
        console.log(req.user)
        const student = req.user?.studentId
        const studentExist = await Student.findById(student)
        let cursos:CourseShort[] = []
    
        if(!studentExist)return res.status(400).json({message:"Estudiante no encontrado"})
        if (studentExist.cursos.length === 0) return res.status(400).json({message:"No hay cursos"})
            //en caso de haber cursos, vamos a iterar sobre el array trallendo el documento de detalle yparte del documento de curso
        for(const curso of studentExist.cursos){
            //curso sera el id que viene del arreglo de cursos de estudiante
            const cursoExist = await Student_Courses.findById(curso)
                                                    .populate(
                                                      {
                                                        path:"course",
                                                        select:"_id name description tipoCurso valoration",
                                                        options:{limit:3}
                                                      })
                                                   
            console.log(cursoExist?.course)
            if(cursoExist?.course){
             cursos.push(cursoExist.course as CourseShort)
            }
            
            

        }
       res.send({cursos})
      }catch(err){
        console.log(err)
        res.send("Error en el servidor")
      }
    }
    static async addCourseStudent(req:Request,res:Response){
      try{
      //1- el id del alumno esta en el autenticado
      //2- el id del curso esta en el body
      //3- busscar el estudiante
      //4- buscar el curso
      //5- crear el detalle del curso
      //6- agregar el detalle al estudiante
      //7- guardar el estudiante
      //8- enviar respuesta
      const {id_course} = req.body
      const student = req.user?.studentId
      const studentExist = await Student.findById(student)
      const courseExist = await Courses.findById(id_course)
      if(!studentExist)return res.status(400).json({message:"Estudiante no encontrado"})
      if(!courseExist)return res.status(400).json({message:"Curso no encontrado"})
      const studentCourse = await Student_Courses.create({student:studentExist,course:courseExist})
       courseExist.course_students.push(studentCourse.id)
        studentExist.cursos.push(studentCourse.id)
      await Promise.all([courseExist.save(),studentExist.save(), studentCourse.save()])

      console.log(studentCourse)
      res.send("Estudiante agregado al curso con exito")
      }catch(err){
        console.log(err)
        res.send("Error en el servidor")
      }
    }

}