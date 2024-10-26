import { Router } from 'express';
import InstructorController from '../controllers/InstructorController';
import { updateUserRequeriments } from '../politicas/politicasCursos';
import { autenticate } from '../middlewares/autenticate';
import { handleErrors } from '../middlewares/handleErrores';
const routerInstructor = Router();

// Rutas CRUD para los instructores
routerInstructor.get('/instructors', InstructorController.getAllInstructors);
routerInstructor.get('/instructors/:id', InstructorController.getInstructorById);
routerInstructor.put('/instructors/:id', 
    updateUserRequeriments,
    handleErrors,
    InstructorController.updateInstructor);
routerInstructor.delete('/instructors/:id', InstructorController.deleteInstructor);

routerInstructor.get('/instructor',autenticate, InstructorController.getInstructor);//**** */


routerInstructor.post('/instructors/course',
    autenticate,
    InstructorController.createCourse); 

/*
Metodos creacionales para
--crear grupos
--crear tareas
-- crear codigos de union
*/
routerInstructor.get('/instructor/crear-grupo', autenticate, InstructorController.crearGrupo);//crear grupos
routerInstructor.get('/instructors/unionCode/:groupId', autenticate, InstructorController.unionCode);

export default routerInstructor;