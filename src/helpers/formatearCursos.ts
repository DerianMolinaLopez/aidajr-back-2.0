import { Curso } from "../type/type";

export function formatearCurso(curso: Curso) {
    console.log("*************************desde el fomrateo del curso");
    console.log(curso);

    const { _id, name, description, instructor_Id, tipoCurso, valoration } = curso.course;
    const { user_Id } = instructor_Id;

    const formattedCourse = {
        _id,
        name,
        description,
        instructor: {
            _id: instructor_Id._id,
            user_Id: user_Id // Aquí extraemos el contenido de user_Id
        },
        tipoCurso,
        valoration
    };

    return formattedCourse;
}