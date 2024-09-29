import { Request,Response } from "express";
import Student from "../models/Student";
import Student_Courses from "../models/Student_courses";
import { CourseShort } from "../type/type";
import User from "../models/User";
import Courses, { CoursesInter } from "../models/Courses";
import { formatearCursos } from "../helpers/formatearCursos";
import { populate } from "dotenv";
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
        if (studentExist.cursos.length === 0) return res.status(200).json({message:"No hay cursos", cursos:[]})
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

    static async getCoursesByStudentDetail(req: Request, res: Response): Promise<void> {
      try {
          // 1- id del usuario para extraer sus detalles de cursos
          const user = await Student.findById(req.user?.studentId)
              .populate({
                  path: "cursos",
                  select: "course process",
                  populate: {
                      path: "course",
                      select: "name description instructor_Id valoration tipoCurso",
                      populate: {
                          path: "instructor_Id",
                          select: "user_Id",
                          populate: { path: "user_Id", select: "name" }
                      }
                  }
              });

          // 2- de cada detalle de curso, lo procesamos para traer el curso y el instructor
          const cursos = user?.cursos;
          if (cursos) {
              const formattedCourses = cursos.map(curso => {
                  const formateado = formatearCursos(curso )
                  console.log(formateado)
                 return formateado
              });

              // 3- enviar respuesta formateada a un nivel
              res.status(200).json({cursos:formattedCourses});
          } else {
              res.status(404).json({ message: 'No se encontraron cursos para el usuario' });
          }
      } catch (err) {
          console.log(err);
          res.status(500).json({ message: 'Error en el servidor' });
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
    //obtener los cursos por tipos
    /**
     * modificacion
     * !solo mandaremos los cursos por tipo y que el usuario no lo tenga en su lista de cursos
     */
    static async getCoursesByType(req:Request,res:Response){
      try{
        const {tipoCurso} = req.params
        console.log(req.user)
        const student = await Student.findById(req.user?.studentId)
       
        console.log(student)
        if(tipoCurso==='word'|| tipoCurso==='excel'||tipoCurso==='powerpoint'){
          const cursos = await Courses.find({ tipoCurso }).select("-course_students")
          .populate({
              path: 'instructor_Id',
              select:"-courses -__v ",
              populate: {
                  path: 'user_Id',
                  select:"name"
              },
              options:{limit:4}
          });
          console.log("-------------------")
          console.log(cursos)
           return res.send({cursos})
        }
        
      res.send("Tipo de curso no valido")
      }catch(err){
        console.log(err)
        res.send("Error en el servidor")
      }
    }

}
/*
static async getCoursesByType(req:Request,res:Response){
      try{
        const {tipoCurso} = req.params
        console.log(req.user)
        const student = await Student.findById(req.user?.studentId)
        console.log(student)



        if(tipoCurso==='word'|| tipoCurso==='excel'||tipoCurso==='powerpoint'){
          const cursos = await Courses.find({ tipoCurso }).select("-course_students")
          .populate({
              path: 'instructor_Id',
              select:"-courses -__v ",
              populate: {
                  path: 'user_Id',
                  select:"name"
              }
          });
           return res.send({cursos})
        }
        
      res.send("Tipo de curso no valido")
      }catch(err){
        console.log(err)
        res.send("Error en el servidor")
      }
    }
*/