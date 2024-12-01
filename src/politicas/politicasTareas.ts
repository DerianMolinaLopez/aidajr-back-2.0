import { body } from "express-validator";
export const politicasCrearTareas = [
    body('title').isString().notEmpty().withMessage('El titulo es requerido'),
    body('description').isString().notEmpty().withMessage('La descripcion es requerida'),
    body('course').isMongoId().withMessage('El id del curso es requerido'),
    body('endDate').isISO8601().withMessage('La fecha de entrega es requerida'),
    body('Section').isMongoId().withMessage('La seccion es requerida'),
]