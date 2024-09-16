import { Request, Response } from 'express';
import Instructor from '../models/Instructor';
import User from '../models/User';
import { InstructorInter } from '../models/Instructor';
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
}

export default InstructorController;