import Route from 'express';
import { autenticate } from '../middlewares/autenticate';
import { Usercontroller } from '../controllers/UserController';
import { body } from 'express-validator';
import { handleErrors } from '../middlewares/handleErrores';
import { politicasCursosCompras, politicasCursosComprasDetail  } from '../politicas/politicasCursos';

import User from '../models/User';
const userRoute = Route();
userRoute.get("/student",autenticate,Usercontroller.getStudent)
userRoute.get("/student/courses",autenticate,Usercontroller.getCoursesByStudent)
userRoute.get("/student/courses/detail",autenticate,Usercontroller.getCoursesByStudentDetail)
userRoute.post('/student/agregar-curso',
    politicasCursosComprasDetail,
    handleErrors,
    autenticate,Usercontroller.agregarAlumnoPago)

    
userRoute.get("/student/courses/type/:tipoCurso",autenticate,Usercontroller.getCoursesByType)

/*
userRoute.post('/confirm/ticket',autenticate
                                 ,politicasCursosCompras,
                                 handleErrors,
                                Usercontroller.confirmTicket)*/
//decodificar codigo de union
userRoute.get("/student/course/unionCode/:unionCode",autenticate,Usercontroller.decodigfyUnionCode)
export default userRoute;