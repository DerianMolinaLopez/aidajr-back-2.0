import { Router } from 'express';
import InstructorController from '../controllers/InstructorController';
import { updateUserRequeriments } from '../politicas/politicasCursos';
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

export default routerInstructor;