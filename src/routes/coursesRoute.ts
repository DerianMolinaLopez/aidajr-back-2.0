import { Router } from "express";
import CoursesController from "../controllers/CursosController";
import { body } from "express-validator";
import { handleErrors } from "../middlewares/handleErrores";
import {createCoursesReueriments,updateCoursesReueriments} from "../politicas/politicasCursos"
const routerCourses = Router();

routerCourses.post('/courses',
                    createCoursesReueriments, //arreglo de restricciones
                    handleErrors,    
                   CoursesController.createCourse);
routerCourses.post('/courses/multi',
                    createCoursesReueriments,
                   CoursesController.createMultipleCourses);
                   // 
routerCourses.get('/courses', CoursesController.getAllCourses);
routerCourses.get('/courses/top', CoursesController.getNewCourses);
routerCourses.get('/course/:id', CoursesController.getCourseById);
routerCourses.put('/course/:id',
    updateCoursesReueriments,
    handleErrors, 
    CoursesController.updateCourse);
routerCourses.delete('/courses/:id', CoursesController.deleteCourse);
routerCourses.post("/courses/:id/instructor", CoursesController.asignCourseInstructor);
export default routerCourses;
