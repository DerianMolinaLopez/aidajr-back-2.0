import { Router } from "express";
import HomeworkController from "../controllers/HomeworkContoller";
import { politicasCrearTareas } from "../politicas/politicasTareas";
import { handleErrors } from "../middlewares/handleErrores";
import { autenticate } from "../middlewares/autenticate";
autenticate
handleErrors
const routerHomework = Router()
routerHomework.post('/createHomework',
      autenticate,
       politicasCrearTareas,
       handleErrors,
       HomeworkController.createHomework)
routerHomework.post('/getHomeworkByStudent',HomeworkController.getHomeworkByStudent)
export default routerHomework