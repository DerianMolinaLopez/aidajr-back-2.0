import { Request, Response } from "express";
import Valoration, { ValorationDetailCourseStudend } from "../models/ValorationDetail";
import CourseExistError, { ErrorCourse } from "../Error/CourseExist";
import Courses from "../models/Courses";
import { UserErrors } from "../Error/UserErrors";
import Student from "../models/Student";

class ValorationSystem {//* implementado
 
    static async promedioValoracionCurso(course_id: ValorationDetailCourseStudend["course_id"]): Promise<number | Error> {
        const valoraciones = await Valoration.find({ course_id });
        if (valoraciones.length === 0) throw new CourseExistError(ErrorCourse.COURSE_NOT_FOUND);
        let promedio = 0;
        const totalValoracion = valoraciones.length;
        valoraciones.forEach((valoracion) => {
            promedio += valoracion.valoration;
        });
        promedio = promedio / totalValoracion;
        return promedio;
    }

    // Este es un método HTTP de tipo POST
    static async valorarCurso(req: Request, res: Response) {
        try {
            // Verificar si el usuario es un estudiante
            if (req.user?.type_user !== "estudiante") {
                return res.status(401).send("No eres un estudiante, así que no tienes permiso para la valoración");
            }
          

            // Verificar si el alumno ya ha valorado el curso
            const usuario = await Student.findById(req.user?.studentId);
            if (!usuario) {
                return res.status(404).json({ message: "Estudiante no encontrado" });
            }

            if (!usuario.cursos.includes(req.body.cursoId)) {
        
                return res.status(400).json({message:"No puedes valorar un curso que no has tomado"});
            }

            const { valoracion, cursoId } = req.body;
            const valorationExist = await Valoration.find({
                userId: req.user?.id,
                course_id: cursoId
            });

            if (valorationExist.length > 0) {
                return res.status(400).json({message:"Ya has valorado este curso, no es posible volverlo a calificar"});
            }

            // Crear la nueva valoración
            const valoracionCreate = new Valoration({
                userId: req.user?.id,
                valoration: valoracion,
                course_id: cursoId,
                comentario:req.body.comentario?req.body.comentario:""
            });

            await valoracionCreate.save(); // Guardar la valoración

            // Calcular el promedio de valoraciones del curso
            const valoracionPromedio = await ValorationSystem.promedioValoracionCurso(cursoId);

            // Actualizar la valoración del curso
            const course = await Courses.findById(cursoId);
            if (!course) {
                return res.status(404).json({ message: "Curso no encontrado" });
            }

            course.valoration = valoracionPromedio as number;
            await course.save();

            res.status(200).json({msg:"El curso ha sido calificado con éxito",status:'ok'});
        } catch (error) {
            console.log(error);
            res.status(500).send("Error al calificar el curso");
        }
    }
}

export default ValorationSystem;