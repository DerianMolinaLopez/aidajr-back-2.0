import { Router } from "express";
import ValorationSystem from "../controllers/ValorationsSystem";
import { autenticate } from "../middlewares/autenticate";
import { body } from "express-validator";
import { handleErrors } from "../middlewares/handleErrores";
const routerValoracion = Router();

routerValoracion.post('/valorar',
    body('valoracion').isNumeric().withMessage("la valoracion debe ser un numero"),
    body('cursoId').isMongoId().withMessage("El curso es obligatorio"),
    handleErrors,
    autenticate,ValorationSystem.valorarCurso)
export default routerValoracion
