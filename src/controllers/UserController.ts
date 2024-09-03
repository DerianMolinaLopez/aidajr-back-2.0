import { Request,Response } from "express";
import User from "../models/User";
export class Usercontroller{
    static async getStudent(req:Request,res:Response){
    res.json({estudiante:req.user})
    }
}