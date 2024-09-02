import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { body } from "express-validator";
import { handleErrors } from "../middlewares/handleErrores";
const routerAuth = Router();

routerAuth.get('/prueba', AuthController.prueba);
routerAuth.post('/register',
    body('name').isString().isLength({min:3}),
    body('email').isEmail(),
    body('password').isString().isLength({min:6}),
    body('repeat_password').isString().isLength({min:6}).custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Las contraseñas no coinciden');
            
        }
        return true;
    }),
    handleErrors,
    AuthController.register);
routerAuth.post('/login',
    body('email').isEmail(),
    body('password').isString().isLength({min:6}),
    handleErrors,
    AuthController.login);


    routerAuth.get('/populate',
        AuthController.getPopulate);

export default routerAuth;