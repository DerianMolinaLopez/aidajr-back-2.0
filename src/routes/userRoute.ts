import Route from 'express';
import { autenticate } from '../middlewares/autenticate';
import { Usercontroller } from '../controllers/UserController';
import { body } from 'express-validator';
import { handleErrors } from '../middlewares/handleErrores';
const userRoute = Route();
userRoute.get("/student",autenticate,Usercontroller.getStudent)
userRoute.get("/student/courses",autenticate,Usercontroller.getCoursesByStudent)
userRoute.post('/student/agregar-curso',
    body('id_course').notEmpty().withMessage('El id del curso es requerido'),
    handleErrors,
    autenticate,Usercontroller.addCourseStudent)

export default userRoute;