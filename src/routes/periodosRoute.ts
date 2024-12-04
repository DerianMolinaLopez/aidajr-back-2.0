import Router from 'express';   
import PeriodoController from '../controllers/PeriodoController';
import { autenticate } from '../middlewares/autenticate';
import { handleErrors } from '../middlewares/handleErrores';
import {politicasPagoPeriodo} from '../politicas/PoliticasPagosPeriodos';

const routerPeriodos = Router();
routerPeriodos.post('/pagar-periodo',
                      politicasPagoPeriodo,
                      handleErrors,
                       PeriodoController.pagarPeriodo);

routerPeriodos.post('/crear-periodo',
                        PeriodoController.crearPeriodo);
                        routerPeriodos.get('/periodos',PeriodoController.getPeriodos)

export default routerPeriodos