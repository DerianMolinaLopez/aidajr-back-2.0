import { Request, Response } from 'express';
import Task from '../models/Task';
import Section from '../models/Sections';
import { ObjectId , Types} from 'mongoose';

class TaskController {
    // Crear una nueva tarea para una sección
    public static async createTask(req: Request, res: Response) {
        try {
            const { name, startDate, endDate, description, section } = req.body;
            
            // Verificar que la sección exista
            const sectionExists = await Section.findById(section);
            if (!sectionExists) return res.status(404).json({ message: 'Sección no encontrada' });

            // Crear y guardar la nueva tarea
            const newTask = new Task({ name, startDate, endDate, description, section });
            sectionExists.tasks.push(newTask._id as Types.ObjectId);
            await Promise.all([newTask.save(), sectionExists.save()]);
            
            res.status(201).json(newTask);
        } catch (error) {
            res.status(400).json({ message: 'Error al crear la tarea', error });
        }
    }

    // Obtener todas las tareas
    public static async getTasks(req: Request, res: Response): Promise<void> {
        try {
            const tasks = await Task.find().populate('section');
            res.status(200).json(tasks);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener las tareas', error });
        }
    }
    
    //! Repetido en SectionController
    /*
    // Obtener todas las tareas de una sección específica
    public static async getTasksBySection(req: Request, res: Response): Promise<void> {
        try {
            const { section } = req.params;
            const tasks = await Task.find({ section }).populate('section');
            res.status(200).json(tasks);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener las tareas', error });
        }
    }
    */
    // Obtener una tarea por ID
    public static async getTaskById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const task = await Task.findById(id).populate('section');
            if (!task) {
                res.status(404).json({ message: 'Tarea no encontrada' });
                return;
            }
            res.status(200).json(task);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener la tarea', error });
        }
    }

    // Actualizar una tarea por ID
    public static async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
            if (!updatedTask) {
                res.status(404).json({ message: 'Tarea no encontrada' });
                return;
            }
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar la tarea', error });
        }
    }

    // Eliminar una tarea por ID
    public static async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedTask = await Task.findByIdAndDelete(id);
            if (!deletedTask) {
                res.status(404).json({ message: 'Tarea no encontrada' });
                return;
            }
            // Remover la tarea del arreglo de tareas en la sección
            await Section.updateOne({ _id: deletedTask.section }, { $pull: { tasks: deletedTask._id } });
            
            res.status(200).json({ message: 'Tarea eliminada con éxito' });
        } catch (error) {
            res.status(400).json({ message: 'Error al eliminar la tarea', error });
        }
    }
}

export default TaskController;
