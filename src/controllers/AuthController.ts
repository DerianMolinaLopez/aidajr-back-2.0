import { Request, Response } from "express";
import User from "../models/User";
import Student from "../models/Student";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { createJWTToken } from "../helpers/createJWTToken";
class AuthContoller{
    static async prueba( req:Request,res:Response){
        const users = await User.find();
        res.send(users);
    }
    static async register(req:Request,res:Response){
        const {name,email} = req.body;
        const userExist = await User.findOne({email});//buscamos si el usuario ya existe
        if(userExist) return res.status(400).json({message: 'El usuario ya existe'});//si existe retornamos un mensaje de error


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
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Verificar que el email sea válido
            if (!email || !password) {
                return res.status(400).json({ message: 'Email y contraseña son requeridos' });
            }

            const userExist = await User.findOne({ email }).populate('studentId');
            
            // Verificar que userExist sea de tipo ObjectId
            if (!userExist || !mongoose.isValidObjectId(userExist._id)) {
                return res.status(400).json({ message: 'El usuario no existe' });
            }

            const passwordMatch = await bcrypt.compare(password, userExist.password);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }

            // Verificar que studentId sea de tipo ObjectId
            const student = userExist.studentId;
            if (student && !mongoose.isValidObjectId(student._id)) {
                return res.status(400).json({ message: 'ID de estudiante no válido' });
            }

            // Armar token de autenticación
            const token = createJWTToken({
                //@ts-ignore
                id: userExist._id,
                email: userExist.email,
                type_user: userExist.type_user,
                //@ts-ignore
                studentId: student?._id
            });

            res.json({ message: 'Autenticación exitosa', token });

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    }
    static async logout(req:Request,res:Response){
    }
    static async getPopulate(req:Request,res:Response){
        const users = await User.find().populate('studentId');
        res.send(users);
    }
}
export default AuthContoller;