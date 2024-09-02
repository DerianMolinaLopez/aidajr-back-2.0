import {validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
export async function handleErrors(req:Request, res:Response, next:NextFunction){
    const errors = validationResult(req);
    if(!errors.isEmpty()){//envio los errores via json
        return res.status(400).json({errors: errors.array()});
    }
    next();//paso a la siguiente funcion
}