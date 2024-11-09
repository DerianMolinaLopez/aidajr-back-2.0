import { Request, Response } from 'express';
import Instructor from '../models/Instructor';
import User from '../models/User';
import { InstructorInter } from '../models/Instructor';
import Courses from '../models/Courses';
import { InstructorUsuario } from '../type/type';
import { generadorToken } from '../helpers/generadorToken';
import UnionCode from '../models/UnionCode';
import CoursesController from './CursosController';
class InstructorController {
    

    // Obtener todos los instructores
    static async getAllInstructors(req: Request, res: Response) {
        try {
            const instructors = await Instructor.find().populate({path: 'user_Id', select: 'name email _instructorId'});
            res.status(200).json(instructors);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los instructores', error });
        }
    }

    // Obtener un instructor por ID
    static async getInstructorById(req: Request, res: Response) {
        try {
            const instructor = await Instructor.findById(req.params.id).populate({path: 'user_Id', select: 'name email _instructorId'});
            if (!instructor) {
                return res.status(404).json({ message: 'Instructor no encontrado' });
            }
            res.status(200).json(instructor);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el instructor', error });
        }
    }

      //!como es un metodo de extraccion de datos del instuctor este metodo va a seguir creciondo por el requerimiento de peticiones diferenets
      static async getInstructor(req: Request, res: Response) {
        try {
            const idInstructor = req.user?.instructorId;
            //los que tienen codigo de union los guardare con el nombre, y el codigo de union y el id
            //los que no tienen, solo el nombre, el tipo y el id
            let cursosConCodigoUnion: any[] = []
            
            let cursosSinCodigoUnion: any[] = []
            //extraccion de todos los grupos de ese instructor
            if(idInstructor){
                //estos cursos son todo curso, pero hay que ver, que cursos no tienen codigo de union
                const instructor = await Instructor.findById(idInstructor).select('_id')
                if (!instructor) return res.status(404).json({ message: 'Instructor no encontrado' });
                //buscamos los cursos que tengan el id del instructor
                //si tienn codigo de union, entonces los mandamos, y los que no tienen codigo de union
                //los ponemos en otro arreglo
                const cursos = await Courses.find({ instructor_Id: instructor._id });
                
                const codigos = await UnionCode.find({group: cursos.map(curso => curso._id)})
                //con codigo
                for (let i = 0; i < codigos.length; i++) {
                    
                    const cursoCodigo = await Courses.findById(codigos[i].group)
                    cursosConCodigoUnion.push({curso: cursoCodigo, codigo: codigos[i].code})
                    
                }   
                //enviamos tambien los cursos de ese instructor
                const cursosINstructor = Instructor.findById(idInstructor).populate('courses')
                //@ts-ignore
                const {courses} = cursosINstructor

                res.status(200).json({
                    usuario:req.user,
                    cursosConCodigoUnion,
                    cursos,
                    courses
                   
                });
        
            }
            
            //agregar los grupos que contiene el instructor

          
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el instructor', error });
        }
    }

/*

for (let curso of cursos) {
                    if (cursosConCodigoUnionIds.includes(curso._id.toString())) {
                        const codigoUnion = codigos.find(codigo => codigo.group.toString() === curso._id.toString());
                        cursosConCodigoUnion.push({ curso, codigo: codigoUnion?.code });
                    } else {
                        cursosSinCodigoUnion.push({ curso, tipo: 'sin codigo de union' });
                    }
                }
    
*/



    // Actualizar un instructor por ID
    static async updateInstructor(req: Request, res: Response) {
        /**
         * Este endpoint es diferente
         * Como estamos trabajando con abstracción de colecciones
         * no podemos actualizar así nomás, en realidad lo que vamos a
         * actualizar es el usuario del instructor.
         * 
         * Para simplificar más las cosas, recibimos el id del usuario del instructor
         * y lo actualizamos.
         */
         
        try {
            const { id } = req.params;
             
            const usuarioExist = await User.findById(id);
            if (!usuarioExist) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            console.log("antes de actualizar");
            const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

            res.status(200).json({
                message: 'Usuario actualizado con éxito',
                updatedUser
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Error al actualizar el instructor', error });
        }
    }

    static async deleteInstructor(req: Request, res: Response) {
        //solamente eliminaremos el usaurio, ojo en el modelado, hay un
        //procediemitno almacenado que elimina al instructor cuando su usuario es eliminado
        //como una elimincion en cascada
        try {
            const {id} = req.params
            let instructorId: InstructorInter;
            const usuarioExist = await User.findByIdAndDelete(id).populate('instructorId');
            if (!usuarioExist) {
                return res.status(404).json({ message: 'Instructor no encontrado' });
            }
            if(usuarioExist && usuarioExist.instructorId){
                instructorId = usuarioExist.instructorId as InstructorInter;
                console.log(usuarioExist)
                console.log(instructorId)
                Promise.allSettled([await instructorId.deleteOne(),
                                   await usuarioExist.deleteOne()])
                res.status(200).json({ message: 'Instructor eliminado con exito' });
            }
           
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el instructor', error });
        }
    }
    static async createCourse(req: Request, res: Response) {
        //@ts-ignore
        const {type_user} = req.user
        
        if(type_user !== 'instructor') return res.status(401).json({message: 'No autorizado'})

        
        try {
            const curso = new Courses(req.body)
        //@ts-ignore
        cruso.instructorId = req.user.instructorId
        await curso.save()
          res.json(curso)
           
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el curso', error });
        }
    }
          /** 
         * 2- Total de alumnos por instructor
         *
         * @param {IdCurso}  - Entrada por via props.
         * @returns {number} - codigo de union enviado via  json 
       */
    static async unionCode (req: Request, res: Response) {
        //-algoritmo para generar un codigo de union segun x numeros
        //verificamos si hay un codigo con ese grupo
        const codigoExist = await UnionCode.findOne({group: req.params.groupId})
        if(codigoExist) {
            //si eexiste actualizamos
            const codigo = generadorToken()
            codigoExist.code = codigo
            await codigoExist.save()
            return res.status(200).send("Codigo de union actualizado")
        }
        //si no, hacemos la generacion comun y corriente
        const {groupId} = req.params//en relidad esto es el id del curso
        const codigo = generadorToken()
        const codigoUnion = new UnionCode({code: codigo, group: groupId, instructorId: req.user?.instructorId})
        await codigoUnion.save()
        console.log("codigo de union",codigoUnion)
        res.status(200).json({codigo:codigoUnion.code})
    }
    
    /*
    
_id
67041ccf5ebfd796cb6ebdc3
name---
"Curso de Word Básico"
description--
"Aprende a usar las herramientas básicas de Microsoft Word, como format…"
instructor_Id--se asignara el id del instructor
670421bcf168e5fda8de9251

course_students--se iniciara como array vacio
Array (empty)
tipoCurso--se agregara como 3 tipos solamente
"word"
valoration
0

sections
Array (empty)
start_date
2024-10-07T17:39:27.610+00:00
end_date
2024-10-07T17:39:27.610+00:00
__v
0
    */



    static async crearGrupo (req: Request, res: Response) {
        try {
            console.log("en creacion del grupo");
            // el id del instructor viene en la autenticacion
            // name
            // description
            // instructor_Id
            // course_students
            // tipoCurso
            const { name, description, tipoCurso } = req.body; // Corregido: descripction -> description
            const curso = await Courses.findOne({ name });
            if (curso) return res.send("Hay un curso ya con ese nombre, intenta con uno diferente");
            
            const idInstructor = req.user?.instructorId;
            if (!idInstructor) return res.status(401).json({ message: "No autorizado" });
            
            const crearCurso = new Courses({ name, description, instructor_Id: idInstructor, tipoCurso });
            //luego, agregamos ese curso al id del instructor
            const instructor = await Instructor.findById(idInstructor);
            //@ts-ignore
            instructor?.courses.push(crearCurso._id);

            await instructor?.save();   
            await crearCurso.save();
            
            res.send("Curso creado con exito");
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear el grupo', error });
        }
    }
    static async obtenerCursosInstructor (req: Request, res: Response) {
        try {
            const idInstructor = req.user?.instructorId;
            const instructor = await Instructor.findById(idInstructor).populate('courses');
            //@ts-ignore
            if(instructor?.courses.length >= 0)
            {
                res.json(instructor?.courses);
            }
            res.json({message: "No hay cursos"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear el grupo', error });
        }
    }


}
export default InstructorController;