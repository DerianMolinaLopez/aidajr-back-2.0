import { Request, Response } from "express";
import User from "../models/User";
import Student from "../models/Student";
import mongoose from "mongoose";
import Instructor from "../models/Instructor";
import bcrypt from 'bcrypt';
import { UserAux } from "../type/type";
import { createJWTToken } from "../helpers/createJWTToken";
import EmailAuth, { compraPeriodos, IEmailAuth } from "../email/EmailAuth";
//para recuperacion de cuenta
import { generadorToken } from "../helpers/generadorToken";

import Token from "../models/Token";
class AuthContoller{
    static async prueba( req:Request,res:Response){
        const users = await User.find();
        res.send(users);
    }
    static async register(req: Request, res: Response) {//*arreglado por medios de tipos de roles
        const { name, email, role } = req.body;

        try {
            // Buscamos si el usuario ya existe
            const userExist = await User.findOne({ email });
            if (userExist) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            // Ocultamos la contraseña con una complejidad algoritmica de 10
            let password = req.body.password;
            const type_user = role; // Por defecto es de alumno, las cuentas de profesores las asigna la "administracion" 
                                    //ahora esta el tipo de usuario en el login, que permite crear instructores
                                    //
            password = await bcrypt.hash(password, 10);

            // Creamos un nuevo usuario
            const user = new User({ name, email, password, type_user });
            console.log(user._id);

            // Creamos un estudiante o instructor según el type_user
            if (type_user === 'estudiante') {
                const student = await Student.create({ user_Id: user._id });
                user.studentId = student._id as any; // Asignamos el id del estudiante al usuario
            } else if (type_user === 'instructor') {
                const instructor = await Instructor.create({ user_Id: user._id });
                user.instructorId = instructor._id as any  // Asignamos el id del instructor al usuario
            }

            // Guardamos el usuario
            await user.save();

            res.send("Cuenta creada con éxito");
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    }
    static async registerMany(req: Request, res: Response) {
        const { users } = req.body;
      
        try {
          await Promise.all(users.map(async (user:UserAux) => {
            // Buscamos si el usuario ya existe
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
              throw new Error(`El usuario ${user.email} ya existe`);
            }
      
            // Ocultamos la contraseña con una complejidad algoritmica de 10
            let password = user.password;
            const type_user = user.type_user; // Tipo de usuario
      
            password = await bcrypt.hash(password, 10);
      
            // Creamos un nuevo usuario
            const createUser = new User({
              name: user.name,
              email: user.email,
              password,
              type_user,
            });
      
            // Creamos un estudiante o instructor según el type_user
            if (type_user === 'estudiante') {
              const student = await Student.create({ user_Id: createUser._id });
              createUser.studentId = student._id as any; // Asignamos el id del estudiante al usuario
            } else if (type_user === 'instructor') {
              const instructor = await Instructor.create({ user_Id: createUser._id });
              createUser.instructorId = instructor._id as any; // Asignamos el id del instructor al usuario
            }
      
            // Guardamos el usuario
            return createUser.save();
          }));
      
          res.send('Cuentas creadas con éxito');
        } catch (e) {
          console.log(e);
          return res.status(500).json({ message: 'Error en el servidor' });
        }
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

            res.json({ message: 'Autenticación exitosa', token, tipoUsuario: userExist.type_user });

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    }
  /*
  Este no regresa un token
  */
    static async loginConfirmPayment(req: Request, res: Response) {
        try {
            const { email, password,tittle } = req.body;
            // Verificar que el email sea válido
            if (!email || !password) {
                return res.status(400).json({ message: 'Email y contraseña son requeridos' });
            }


            const userExist = await User.findOne({ email }).populate('studentId');
            
            // Verificar que userExist sea de tipo ObjectId
            if (!userExist || !mongoose.isValidObjectId(userExist._id)) {
                return res.status(400).json({ message: 'El usuario no existe' });
            }
            if(req.user?.type_user!="instructor") return res.status(400).json({message:"La cuenta que tienes no es de instructor asi que no es posible completar el pago"});

            const passwordMatch = await bcrypt.compare(password, userExist.password);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }
            //verificamos primero si es que el usuario ya tiene un plan de pago
            console.log("antes de la verificacion"+userExist.plazoPago)
            if(userExist.plazoPago!="sin plazo") return res.status(400).json({message:"Ya tienes un plan de pago activo, de querer renovarlo contacta a soporte"});
            
            
            userExist.plazoPago = tittle;
            const data : compraPeriodos ={
                email,
                password,
                securityNumbers:req.body.securityNumbers,
                tittle:req.body.tittle,
                price:req.body.price,
                numberCard:req.body.numberCard
            }
            EmailAuth.facturaCompraPeriodos(data)
             userExist.save();
            res.send('Hemos enviado a su correo electornico la factura de la compra.');

            
           

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
    //recoverPassword
    static async recoverPassword(req:Request,res:Response){
        //generar un token
        //1- si existe el usuario con ese email
        //2- generar token
        //3-gaurdar el token
        //4- enviar el token al correo
        const {email} = req.body
        console.log(email)
        const userExist = await User.findOne({email});
        if(!userExist) return res.status(400).json({message:"El usuario no existe"});
        const token = generadorToken();
        const tokenDocument = new Token({token,email});
         console.log(tokenDocument)
        await tokenDocument.save();
        const data : IEmailAuth ={
            token,
            email
        }
        await EmailAuth.sendCodeForgotPassword(data);
        
    res.send("Se ha enviado un token de recuperacion a su correo");
    }
    static async checkToken(req:Request,res:Response){
        //verificar si el token existe 
        
        const {token} = req.body;
        const tokenExist = await Token.findOne({token})
        if(!tokenExist) return res.status(400).json({message:"El token no existe verifica tu correo"});
        res.json({
            email:tokenExist.email
        })
      
    
    }
        static async changePassword(req: Request, res: Response) {
        try {
            const { email, password, passworRepeat, token } = req.body;
            if (password !== passworRepeat) {
                return res.status(400).json({ message: "Las contraseñas no coinciden" });
            }
            // buscar el usuario
            const userExist = await User.findOne({ email });
            if (!userExist) return res.status(400).json({ message: "El usuario no existe" });
            // encriptar la contraseña
            const passwordHash = await bcrypt.hash(password, 10);
            // actualizar la contraseña
            userExist.password = passwordHash;
            // eliminación del token
            const tokenExist = await Token.findOne({ token });
            if (!tokenExist) return res.status(400).json({ message: "El token no existe" });
            await Promise.all([tokenExist.deleteOne, userExist.save()]);
            console.log(`Token ${token} eliminado correctamente`); // Línea de registro para verificar la eliminación del token
            res.send("contraseña actualizada correctamente");
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    }
}
export default AuthContoller;