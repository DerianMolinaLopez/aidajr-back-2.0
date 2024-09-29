import Student_Courses from "../models/Student_courses";
import Instructor from "../models/Instructor";
import Courses from "../models/Courses";
export  function formatearCursos(cursos: any) {
    // console.log(cursos)
    /*
    {
      _id: new ObjectId('66f07f5003f80b1166ef59b1'),
      course: {
        _id: new ObjectId('66f079cc58bf3753e9b84128'),
        name: 'Curso de Word Básico',
        description: 'Aprende a usar las herramientas básicas de Microsoft Word, como formateo de texto y diseño de documentos.',
        instructor_Id: {
          _id: new ObjectId('66f1a292b2025e53bc810e99'),
          user_Id: [Object]
        },
        tipoCurso: 'word',
        valoration: 0
      }
    }
    */
 
  console.log(cursos)
    const data = {
      name: cursos.course.name,
      _id: cursos._id,
      description: cursos.course.description,
      tipoCurso: cursos.course.tipoCurso,
      valoration: cursos.course.valoration,
      instructor:cursos.course.instructor_Id.user_Id.name,
      process: cursos.process
    };
  
    return data;
  }