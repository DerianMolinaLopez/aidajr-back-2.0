import { Request, Response } from 'express';
import Courses from '../models/Courses';
import Instructor from '../models/Instructor';
import Periodo, { Periodoenum } from '../models/Periodos';

class CoursesController {
    // Crear un nuevo curso
    static async createCourse(req: Request, res: Response) {
        try {
            //!es necesario guardar el id del instructor que crea el grupo
            // TODO como nueva funcionalidad, agregare la verificacion del limite del plazo
            // todo asi que hay que identificar el plazo que tiene ese instrcutor

            //?extraccion del curso
            let plazopago = req.user?.plazoPago;
      
            const periodo = await Periodo.findOne({name: plazopago})
            //una vez teniendo el periodo comparamos con cuantos cursos tiene el instructor
            const cursos = await Courses.find({instructor_Id: req.user?.instructorId})
            if(!periodo) return res.status(400).json({message: 'No se encontro el periodo de pago'})
            if(cursos.length > periodo?.gruposMaximos){
                return res.status(400).json({message: 'Has llegado al limite de cursos que puedes tener'})
            }
    
            const {name} = req.body;
      
        
             const courseExist = await Courses.findOne({name})
             if(courseExist) return res.status(400).send("Ya hay un curso con ese nombre")
            const course = new Courses(req.body);
            console.log("*********************************")
            

             course.instructor_Id = req.user?.instructorId;
             course.valorable = false;

            await course.save();
            res.status(201).json({message: 'Curso creado con éxito'});
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Error al crear el curso', error });
        }
    }
    static async createMultipleCourses(req: Request, res: Response) {
        try {
            const courses = req.body.courses; // Se espera que req.body.courses sea un arreglo de cursos
            if (!Array.isArray(courses)) {
                return res.status(400).json({ message: 'La entrada debe ser un arreglo de cursos' });
            }

            const createdCourses = await Courses.insertMany(courses);
            res.status(201).json(createdCourses);
        } catch (error) {
            res.status(400).json({ message: 'Error al crear los cursos', error });
        }
    }

    // Obtener todos los cursos
    static async getAllCourses(req: Request, res: Response) {
        try {
            const courses = await Courses.find();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los cursos', error });
        }
    }
    static async getNewCourses(req: Request, res: Response) {
        try {
            //obtener los ultimos cursos creados
            const courses = await Courses.find().sort({created_at: -1})
                                         .limit(5)
                                         .select('name description id')
                                         .populate('instructor_Id', 'name');
            res.status(200).json(courses);
        
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los cursos', error });
        }
    }

     // Obtener un curso por ID
    static async getCourseById(req: Request, res: Response) {
        try {
            const course = await Courses.findById(req.params.id)
            .populate({path: 'instructor_Id',
                populate:{
                    path:"user_Id",
                    select:"name "
                }
            });
            if (!course) {
                return res.status(404).json({ message: 'Curso no encontrado' });
            }
            res.status(200).json(course); // Devolver el curso encontrado
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el curso', error });
        }
    }


    // Actualizar un curso por ID
    static async updateCourse(req: Request, res: Response) {
        try {
            const course = await Courses.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!course) {
                return res.status(404).json({ message: 'Curso no encontrado' });
            }
            res.status(200).json(course);
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar el curso', error });
        }
    }

    // Eliminar un curso por ID
    static async deleteCourse(req: Request, res: Response) {
        try {
            const course = await Courses.findByIdAndDelete(req.params.id);
            if (!course) {
                return res.status(404).json({ message: 'Curso no encontrado' });
            }
            res.status(200).json({ message: 'Curso eliminado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el curso', error });
        }
    }

    /* 
    *Asosciar un instructor a un curso
    */
    static async asignCourseInstructor(req: Request, res: Response) {
        try {

            /*
            1- Buscar el instructor por id

            2- Buscar el curso por id

            3- Asignar el instructor al curso

            4- Guardar el curso

            en el params viene el id del curso
            en el body viene el id del instructor
            */
            const {id} = req.body;
            const instructorExist = await Instructor.findById(id);
            if(!instructorExist) return res.status(400).json({message: 'Instructor no encontrado'});
            const course = await Courses.findById(req.params.id);
            if(!course) return res.status(400).json({message: 'Curso no encontrado'});
            course.instructor_Id = instructorExist.id;
            await course.save();
            res.send("Instructor asignado al curso con exito")
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar el instructor al curso', error });
        }
    }
}

export default CoursesController;