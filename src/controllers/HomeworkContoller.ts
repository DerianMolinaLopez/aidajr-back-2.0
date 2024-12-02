import Courses from "../models/Courses";
import Section from "../models/Sections";
import Homework from "../models/Homework";
import { Request, Response } from "express";
import mongoose from "mongoose";

class HomeworkController {
    static async createHomework(req: Request, res: Response) {
        try {
            const { course, title, description, endDate, Section: sectionId } = req.body;
            const instructor = req.user?.instructorId;

            // Verificar si el curso existe
            const courseExist = await Courses.findById(course);
            if (!courseExist) return res.status(400).json({ message: "El curso no existe" });

            // Verificar si la sección pertenece al curso
            if (!courseExist.sections.includes(sectionId)) {
                return res.status(400).json({ message: "No fue posible agregar esa tarea, la sección no pertenece al curso" });
            }

            // Verificar si la sección existe
            const seccion = await Section.findById(sectionId);
            if (!seccion) return res.status(400).json({ message: "La sección no existe" });

            // Crear la tarea
            const tareaCreada = await Homework.create({
                title,
                description,
                course,
                endDate,
                Section: sectionId,
                revisado: false,
                Instructor : instructor
            });

            // Guardar la tarea
            await tareaCreada.save();
            seccion.homeworks.push(tareaCreada._id as mongoose.Types.ObjectId);
            await seccion.save();

            return res.status(201).json({ message: "Tarea creada con éxito" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error al crear la tarea" });
        }
    }
}

export default HomeworkController;