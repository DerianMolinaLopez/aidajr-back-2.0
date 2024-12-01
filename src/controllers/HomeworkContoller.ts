import Courses from "../models/Courses"
import Homework from "../models/Homework"
import { Request,Response } from "express"
class HomeworkController{

    static async createHomework(req:Request,res:Response){
        const{course}= req.body

        const CourseExist = await Courses.findById(course)
        if(!CourseExist) return res.status(400).json({message:"El curso no existe"})
            //verificamos si ese curso contiene los id de la seccion
        if(!CourseExist.sections.includes(req.body.Section)) return res.status(400).json({message:"No fue posible agregar esa tareamla seccion no pertenece al cursoi"})
            const tareaCreada = await Homework.create(req.body)
           tareaCreada.save()
            return res.status(201).json({message:"Tarea creada con exito"})
        /*
         1-necesitamos el id del curso
         2-titulo
         3-descripcion de la tarea
         4-la fecha de inicio por default es en el momento en el que se crea
         5- la fecha de finalizacion ese si lo vamos a recibir del frontened
        */
    }

}
export default HomeworkController