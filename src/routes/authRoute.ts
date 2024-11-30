import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { body } from "express-validator";
import { handleErrors } from "../middlewares/handleErrores";
import { autenticate } from "../middlewares/autenticate";
const routerAuth = Router();

routerAuth.get('/prueba', AuthController.prueba);
routerAuth.post('/register',
    body('name').isString().isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
    body('role').isString()
                .withMessage('El rol es requerido')
                .isIn(['instructor', 'estudiante'])
                .withMessage('El rol debe ser instructor o estudiante'),
    body('repeat_password').isString().isLength({ min: 6 }).custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden');

        }
        return true;
    }),
    handleErrors,
    AuthController.register);
routerAuth.post('/registerMany', AuthController.registerMany);
routerAuth.post('/login',
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
    handleErrors,
    AuthController.login);

    routerAuth.post('/login-payment',
        body('email').isEmail(),
        body('password').isString().isLength({ min: 6 }),
        body('price').notEmpty(),
        body('numberCard').isString().notEmpty(),
        body('tittle').isString().notEmpty(),
        handleErrors,
        autenticate,
        AuthController.loginConfirmPayment);


routerAuth.get('/populate',
    AuthController.getPopulate);
//crear token de recuperacion
routerAuth.post('/forgot-password',
    body('email').isEmail(),
    handleErrors,
    AuthController.recoverPassword);
routerAuth.post('/check-token',
    body('token')   
                .isString().withMessage('El token es requerido'),
     handleErrors,
    AuthController.checkToken);

routerAuth.post('/change-password', AuthController.changePassword)

export default routerAuth;