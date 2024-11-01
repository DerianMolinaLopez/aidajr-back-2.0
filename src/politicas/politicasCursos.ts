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
export const updateUserRequeriments = [
    body('name').isString().notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Ese no es un email valido')
                 .notEmpty().withMessage('El email es requerido'),

]
export const politicasCursosCompras = [
 body('curso').isString().notEmpty().withMessage('Es necesairo enviar todos los campos'),
 body('costo').isString().notEmpty().withMessage('Es necesairo enviar todos los campos'),
 body('instructor').isString().notEmpty().withMessage('Es necesairo enviar todos los campos'),
]

export const politicasCursosComprasDetail = [
    body('id_course').isString().notEmpty().withMessage('Es necesairo enviar todos los campos'),
    body('password').isString().notEmpty().withMessage('Es necesairo enviar todos los campos'),
    body('curso').isString().notEmpty().withMessage('Es necesairo enviar todos los campos'),
    body('curso').isString().notEmpty().withMessage('Es necesairo enviar todos los campos'),
    body('instructor').isString().notEmpty().withMessage('Es necesairo enviar todos los campos'),
   ]
          //name
           //descripcion
           //tipoCurso
export const politicasCrearCursoInstructor = [
    body('name').isString().notEmpty().withMessage('El nombre es requerido'),
    body('description').isString().notEmpty().withMessage('La descripcion es requerida'),
    body('tipoCurso').isString().notEmpty().withMessage('El tipo de curso es requerido'),
    
]