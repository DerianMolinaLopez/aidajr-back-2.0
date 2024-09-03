import Route from 'express';
import { autenticate } from '../middlewares/autenticate';
import { Usercontroller } from '../controllers/UserController';
const userRoute = Route();
userRoute.get("/student",autenticate,Usercontroller.getStudent)

export default userRoute;