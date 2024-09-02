import { Request, Response } from "express";
import User from "../models/User";
import Student from "../models/Student";
import bcrypt from 'bcrypt';
class AuthContoller{
    static async prueba( req:Request,res:Response){
        const users = await User.find();
        res.send(users);
    }
    static async register(req:Request,res:Response){
        const {name,email} = req.body;
        const userExist = await User.findOne({email});//buscamos si el usuario ya existe
        if(userExist) return res.status(400).json({msg: 'El usuario ya existe'});//si existe retornamos un mensaje de error


        let password = req.body.password;
        const type_user = "alumno";//-->por defecto es de alumno, las cuentas de profesores las asigna la "administracion"
        password = await bcrypt.hash(password,10);//ocultamos la contraseña con una complejidad algoritmica de 10
        const user = new User({name,email,password,type_user});
        console.log(user._id)
        const student = await Student.create({user_Id:user._id});//creamos un estudiante con el id del usuario
        user.studentId = student._id as any;//asignamos el id del estudiante al usuario
        await user.save();
        res.send("Cuenta creada con exito")
        
    }
    static async login(req:Request,res:Response){
    }
    static async logout(req:Request,res:Response){
    }
    static async getPopulate(req:Request,res:Response){
        const users = await User.find().populate('studentId');
        res.send(users);
    }
}
export default AuthContoller;