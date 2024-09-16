import {body} from "express-validator";

/*
   name: string;
    description: string;
    instructor_Id: Types.ObjectId;
    start_date: Date;
    end_date: Date;
    alumnosInscritos: Types.ObjectId[];
*/

export const createCoursesReueriments = [
    body('name').isString().notEmpty().withMessage('El nombre es requerido'),
    body('description').isString().notEmpty().withMessage('La descripcion es requerida'),
    body('tipoCurso').isString().notEmpty().withMessage('Es necesario el tipo de curso'),
]
export const updateCoursesReueriments = [
    body('name').isString().notEmpty().withMessage('El nombre es requerido'),
    body('description').isString().notEmpty().withMessage('La descripcion es requerida'),
    body('instructor_Id').isMongoId().withMessage('El instructor debe ser un ID de mongo').optional()
]