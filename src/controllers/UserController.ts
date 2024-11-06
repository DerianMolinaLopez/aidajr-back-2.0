import { Request,Response } from "express";
import Student from "../models/Student";
import Student_Courses from "../models/Student_courses";
import { CourseShort } from "../type/type";
import User from "../models/User";
import Courses, { CoursesInter } from "../models/Courses";
import { formatearCurso } from "../helpers/formatearCursos";

import bcrypt from "bcrypt";
import { Curso } from "../type/type";
import EmailAuth, { EnvioConfirmarCurso } from "../email/EmailAuth";
import { populate } from "dotenv";
import UnionCode from "../models/UnionCode";
import { ObjectId } from "mongoose";
import Instructor from "../models/Instructor";
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

  



    


    static async agregarAlumnoPago(req:Request,res:Response){
      try{
      //1- el id del alumno esta en el autenticado
      //2- el id del curso esta en el body
      //3- busscar el estudiante
      //4- buscar el curso
      //5- crear el detalle del curso
      //6- agregar el detalle al estudiante
      //7- guardar el estudiante
      //8- enviar respuesta
      const {id_course,password} = req.body
      const student = req.user?.studentId
      const userExist = await User.findById(req.user?.id)
      const studentExist = await Student.findById(student)
      const courseExist = await Courses.findById(id_course)
     
      if(!studentExist)return res.status(400).json({message:"Estudiante no encontrado"})
      if(!userExist) return res.status(400).json({message:"Usuario no encontrado"})
       const passwordMatch = await bcrypt.compare(password,userExist?.password)
      if(!passwordMatch) return res.status(400).json({message:"Contraseña incorrecta"})
      if(!courseExist)return res.status(400).json({message:"Curso no encontrado"})
      const studentCourse = await Student_Courses.create({student:studentExist,course:courseExist})
       courseExist.course_students.push(studentCourse.id)
        studentExist.cursos.push(studentCourse.id)
        console.log("enviando el email de factura")
        EmailAuth.facturaCompra({
          email: userExist.email,
          curso: courseExist.name,
          costo: req.body.costo,
          intructor: req.body.instructor,
          user:userExist.name
        })

        
      await Promise.all([courseExist.save(),studentExist.save(), studentCourse.save()])

       
      res.send("Hemos enviado un ticket a tu correo electronico")
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
    /********eventos para el proceso de agregar un curso por medio de codigo de union */
    static async decodigfyUnionCode(req:Request,res:Response){
      try{
        const {unionCode} = req.params
        const unionCodeExist = await UnionCode.findOne({code:unionCode})
        if(!unionCodeExist) return res.status(400).send("Codigo de union no valido")
      //    console.log(unionCodeExist)
        const instructor = unionCodeExist.instructorId
          const grupo = unionCodeExist.group
          const instructorDetalle = await User.findOne({ instructorId:instructor}).select("name")
        //  console.log(instructorDetalle)
          const cursos = await Courses.findById(grupo)
          const cursoEncontrado = {
            tipoCurso : cursos?.tipoCurso,
            name: cursos?.name,
            description: cursos?.description,
            instructor:{
              name: instructorDetalle?.name,
              _id: instructorDetalle?._id
            }
          }
        //console.log(cursoEncontrado)
        
      res.json(cursoEncontrado)
      }catch(err){
        console.log(err)
        res.send("Error en el servidor")
      }
    }
    

    static async addCourseStudent(req:Request,res:Response){
      try{
      //* 1- el id del alumno esta en el autenticado
      //* 2- el id del curso esta en el body
      //* 3- busscar el estudiante
      //* 4- buscar el curso
      //* 5- crear el detalle del curso
      //* 6- agregar el detalle al estudiante
      //* 7- guardar el estudiante
      //* 8- enviar respuesta
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

    /********eventos para el proceso de agregar un curso por medio de codigo de union */
   
    static async getCourseByStudentID(req: Request, res: Response) {
      let cursosUsuarioDatos = []
      try {
          const idusuario = req.user?.studentId;
          const cursosUsuario = await Student.findById(idusuario)
          const cursos = cursosUsuario?.cursos
          if(cursos){
          //  console.log(cursos.length)
             for(let i=0; i<cursos.length; i++){
              const cursoDetalle = await Student_Courses.findById(cursos[i])
              const curso = cursoDetalle?.course
              const cursoCurso = await Courses.findById(curso)
              //name
              //description
              //tipoCurso
        //      console.log("desde curso")
          //    console.log(cursoCurso)
              const instructor = await Instructor.findById(cursoCurso?.instructor_Id)
          //    console.log(instructor)
              const usuarioInstructor = await User.findById(instructor?.user_Id)
            //  console.log(usuarioInstructor)
              const data = {
                _id: cursoCurso?._id,
                name: cursoCurso?.name,
                description: cursoCurso?.description,
                tipoCurso: cursoCurso?.tipoCurso,
                instructor: usuarioInstructor?.name
              }

              cursosUsuarioDatos.push(data)
           
          }
          console.log(cursosUsuarioDatos)
          }
         


         res.json(cursosUsuarioDatos)
  
      } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error en el servidor" });
      }
  }
    

}
