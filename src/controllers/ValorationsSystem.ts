import { Request, Response } from "express";
import Valoration, { ValorationDetailCourseStudend } from "../models/ValorationDetail";
import CourseExistError, { ErrorCourse } from "../Error/CourseExist";
import Courses from "../models/Courses";
import User from "../models/User";
import { UserErrors } from "../Error/UserErrors";
import Student from "../models/Student";

class ValorationSystem {
    // Con este método creamos el promedio de valoración de un curso
    // Este método no es HTTP, sino que se mantiene entre las clases para aportar
    // a otros métodos lo que necesiten
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
                return res.status(400).send("No puedes valorar un curso que no has tomado");
            }

            const { valoracion, cursoId } = req.body;
            const valorationExist = await Valoration.find({
                userId: req.user?.id,
                course_id: cursoId
            });

            if (valorationExist.length > 0) {
                return res.status(400).send("Ya has valorado este curso, no es posible volverlo a calificar");
            }

            // Crear la nueva valoración
            const valoracionCreate = new Valoration({
                userId: req.user?.id,
                valoration: valoracion,
                course_id: cursoId
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

            res.send("El curso ha sido calificado con éxito");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error al calificar el curso");
        }
    }
}

export default ValorationSystem;