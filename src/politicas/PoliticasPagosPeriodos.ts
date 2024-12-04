import { body } from "express-validator";
export const politicasPagoPeriodo = [
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
    body('numberCard').isString().notEmpty(),
    body('periodo').isMongoId().withMessage('El periodo es requerido'),
]
