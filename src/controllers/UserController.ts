import { Request,Response } from "express";
import Student from "../models/Student";
import Student_Courses from "../models/Student_courses";
import { CourseShort } from "../type/type";
import User from "../models/User";
import Courses, { CoursesInter } from "../models/Courses";
import { CursoShort } from "../type/type";
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
       res.send({cursos:cursos})
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
       //!cambair el id de detalle a directamente al id del curso
        studentExist.cursos.push(courseExist.id)
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
       
        console.log(tipoCurso)
        if(tipoCurso==='word'|| tipoCurso==='excel'||tipoCurso==='power'){
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

           //agregamos validacion de traer cursos que solo sean valorables
           //y cursos que el alumno no tenga
           const cursosFiltrados = cursos.filter((curso)=>{
            if(curso.valorable && !student?.cursos.includes(curso._id)){
              return curso
            }
           })
            console.log(cursosFiltrados)
           return res.send({cursos:cursosFiltrados})
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
        console.log(unionCode)
        const unionCodeExist = await UnionCode.findOne({code:unionCode})
        console.log(unionCodeExist)
 
        if(!unionCodeExist || unionCodeExist===null) return res.status(400).send("Codigo de union no valido")
      //    console.log(unionCodeExist)
        const instructor = unionCodeExist.instructorId
          const grupo = unionCodeExist.group
          const instructorDetalle = await User.findOne({ instructorId:instructor}).select("name")
        //  console.log(instructorDetalle)
          const cursos = await Courses.findById(grupo)
          const cursoEncontrado = {
            _idCurso: cursos?._id,//!modificacion
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
    console.log(req.user
     
    )
    
  
      try{
        const infoAlumno = await Student.findById(req.user?.studentId).select("cursos")
        const cursos = infoAlumno?.cursos
        const cursosUsuarioDatos:CursoShort[] = []
        console.log("antes de el for",cursos)
        if(cursos && cursos.length>0){
          console.log("dentord el for")
            for(let i = 0; i<cursos?.length; i++){

              const cursoDetalle = await Courses.findById(cursos[i])
              console.log(cursoDetalle)
              const instructor =  cursoDetalle?.instructor_Id
              console.log(instructor)
              const instructorDetalle = await Instructor.findById(instructor).select("user_Id")
              const usuarioInstructor = await User.findById(instructorDetalle?.user_Id)
              const name =usuarioInstructor?.name
              const cursoId = cursoDetalle?._id.toString()
              console.log(name)
              
              const description = cursoDetalle?.description
              if(cursoDetalle?.name && description && name && cursoId){
                const data : CursoShort = {
                  _id:cursoId,
                  name:cursoDetalle?.name,
                  description:description,
                  valoracion:cursoDetalle?.valoration,
                  tipoCurso:cursoDetalle?.tipoCurso,
                  instructor:name
                }
               console.log(data)
               cursosUsuarioDatos.push(data)
              }
           
          
            }
            return res.json(cursosUsuarioDatos)
        }
      res.send(" ")
      } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error en el servidor" });
      }
  }
/*
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
              console.log("despues de formar el data:"+data)
              cursosUsuarioDatos.push(data)
              console.log(cursosUsuarioDatos)
           
          }
          console.log(cursosUsuarioDatos)
          }
         
               console.log(cursosUsuarioDatos)

         res.json(cursosUsuarioDatos)
  
      } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error en el servidor" });
      }
*/
  static async unirsePorCodigoUNION(req: Request, res: Response) {
    try {
        const { _idCurso } = req.body;

        // Verificamos si el curso existe en el arreglo de cursos del usuario
        const usuarioExist = await Student.findById(req.user?.studentId);
        if(usuarioExist?.cursos.includes(_idCurso)) return res.status(400).send("Ya estás inscrito en este curso");


        const courseExist = await Courses.findById(_idCurso);

        if (!courseExist) {
            return res.status(400).json({ message: "Curso no encontrado" });
        }

        console.log("CURSO SELECCIONADO:", courseExist);

        // Crear el detalle de inscripción en el curso
        const cursoDetalle = await Student_Courses.create({
            student: req.user?.studentId,
            course: courseExist._id
        });

        console.log("Detalle de curso creado con ID:", cursoDetalle._id);

        // Añadir el ID del curso a `course_students` y al usuario sin usar `toString()`
        courseExist.course_students.push(cursoDetalle.id);
        usuarioExist?.cursos.push(courseExist.id);

        // Guardar los cambios de manera simultánea
        await Promise.all([courseExist.save(), usuarioExist?.save(), cursoDetalle.save()]);

        console.log("Curso actualizado:", courseExist);
        res.send("Estudiante agregado al curso con éxito");

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
}


    

}
