import { Request, Response } from 'express';
import { ObjectId, Types } from 'mongoose';
import Section from '../models/Sections';
import { Section as singleSectionType, Sections } from '../type/type';
import Courses from '../models/Courses';
class SectionController {
    // Crear una nueva sección
    public static async createSection(req: Request, res: Response) {
        try {
            const { name, course, description } = req.body;
            const courseExists = await Courses.findById(course);//EXISTENCIA DE CURSO POR EL ID
            if (!courseExists) return res.status(404).json({ message: 'Curso no encontrado' });

            const newSection = new Section({ name, course, description });
            courseExists.sections.push(newSection._id as ObjectId);
            Promise.all([newSection.save(), courseExists.save()]);
            res.status(201).json(newSection);

        } catch (error) {
            res.status(400).json({ message: 'Error al crear la sección', error });
        }
    }
    //creacion dee vaarioas secciones 
    public static async createMultipleSections(req: Request, res: Response){
        try {
            const { secciones,course } = req.body;
            console.log(course)
            const courseExists = await Courses.findById(course);
            
            if(!courseExists) return res.status(404).json({message: 'Curso no encontrado'});
            
            const promises = secciones.map(async (section:Sections) => {
                const newSection = new Section({...section, course});
                courseExists.sections.push(newSection._id as ObjectId);
                return newSection.save();
            });
            
            await Promise.all([promises, courseExists.save()]);
            res.status(201).json({message: 'Secciones creadas con éxito'});
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Error al crear las secciones', error });
        }
    }
    

    // Obtener todas las secciones
    public static async getSections(req: Request, res: Response): Promise<void> {
        try {
            const sections = await Section.find().populate('course');
            res.status(200).json(sections);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener las secciones', error });
        }
    }
    // Obtener todas las secciones de un determinado curso
    public static async getSectionsByCourse(req: Request, res: Response): Promise<void> {
        try {
            const { course } = req.params;
            const sections = await Courses.findById(course).populate(
                {
                    path: 'sections',
                    select: { 'name': 1, 'description': 1 }
                }).select('sections');
            console.log(sections)
            res.status(200).json(sections);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener las secciones', error });
        }
    }

    // Obtener una sección por ID
    public static async getSectionById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const section = await Section.findById(id).populate('course');
            if (!section) {
                res.status(404).json({ message: 'Sección no encontrada' });
                return;
            }
            res.status(200).json(section);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener la sección', error });
        }
    }

    // Actualizar una sección por ID
    public static async updateSection(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedSection = await Section.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
            if (!updatedSection) {
                res.status(404).json({ message: 'Sección no encontrada' });
                return;
            }
            res.status(200).json(updatedSection);
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar la sección', error });
        }
    }

    // Eliminar una sección por ID
    public static async deleteSection(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedSection = await Section.findByIdAndDelete(id);
            if (!deletedSection) {
                res.status(404).json({ message: 'Sección no encontrada' });
                return;
            }
            res.status(200).json({ message: 'Sección eliminada con éxito' });
        } catch (error) {
            res.status(400).json({ message: 'Error al eliminar la sección', error });
        }
    }

    // Obtener todas las tareas de una sección
    public static async getTasksBySection(req: Request, res: Response): Promise<void> {
        try {
            const { sectionId } = req.params;
            const section = await Section.findById(sectionId).populate({
                path: 'tasks',
                select: { 'name': 1, 'description': 1, 'startDate': 1, 'endDate': 1 }
            });
            if (!section) {
                res.status(404).json({ message: 'Sección no encontrada' });
                return;
            }
            res.status(200).json(section.tasks);
        } catch (error) {
            res.status(400).json({ message: 'Error al obtener las tareas de la sección', error });
        }
    }

    // Contar cuántas tareas tiene una sección
    public static async countTasksInSection(req: Request, res: Response): Promise<void> {
        try {
            const { sectionId } = req.params;

            // Verificar que la sección exista
            const section = await Section.findById(sectionId).populate('tasks');
            if (!section) {
                res.status(404).json({ message: 'Sección no encontrada' });
                return;
            }

            // Contar el número de tareas
            const taskCount = section.tasks.length;
            res.status(200).json({ sectionId, taskCount });
        } catch (error) {
            res.status(400).json({ message: 'Error al contar las tareas en la sección', error });
        }
    }
}

export default SectionController;