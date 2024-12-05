import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt';
import PeriodoInter from "../models/Periodos";
import compraPeriodos from "../email/EmailAuth";
import Periodo from "../models/Periodos";
import { Periodoenum } from "../models/Periodos";
import EmailAuth from "../email/EmailAuth";
class PeriodoController{
    static async crearPeriodo(req: Request, res: Response) {
        const { name, price, instructor, mesesAcceso, gruposMaximos, maximoAlumnos, description1, description2 } = req.body;

        try {
            // Verificar si el periodo ya existe
            const periodoExist = await Periodo.findOne({ name });
            if (periodoExist) return res.status(400).json({ message: "Periodo ya existe" });

            // Validar y convertir el nombre a enum
            if (!Object.values(Periodoenum).includes(name)) {
                return res.status(400).json({ message: "Nombre de periodo inválido" });
            }

            const nameEnum = name as Periodoenum;

            // Crear el periodo
            const periodo = new Periodo({
                name: nameEnum,
                price,
                instructor,
                mesesAcceso,
                gruposMaximos,
                maximoAlumnos,
                description1,
                description2
            });

            await periodo.save();
            res.json({ message: "Periodo creado" });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error en el servidor" });
        }
    }

    static async pagarPeriodo( req: Request, res: Response){
        const {password,email, periodo,securityNumbers} = req.body
        try{
            const userExist = await User.findOne({email})
            
            if(!userExist) return res.status(400).json({message:"Usuario no existe"})
             if(userExist.type_user!=="instructor") return res.status(400).json({message:"Tu usuario no es de un instructor asi que tu pago no procedio"})
                if(!bcrypt.compareSync(password,userExist.password)) return res.status(400).json({message:"Contraseña incorrecta"})
                //SI TODO ESTA BIEN SOLO DEBEMOS IDENTIFICAR EL PERIODO
            const periodoExist = await Periodo.findById(periodo)
            if(!periodoExist) return res.status(400).json({message:"Periodo no existe"})    
            if(userExist.plazoPago!=='' && userExist.plazoPago!=undefined && userExist.plazoPago!=undefined) return res.status(400).json({message:"Ya tienes un periodo de pago activo, si quieres cambiar tu plan contactanos"})
            userExist.plazoPago = periodoExist.name//asignamos el periodo al usuario
              //mandamos la factura
              await EmailAuth.facturaCompraPeriodos(
                {
                    tittle: periodoExist.name,
                    price: periodoExist.price.toString(),
                    email,
                    password,
                    securityNumbers,
                    numberCard: ""
                }
              )
              userExist.save()
            res.send("Elpago se relizo correctamente, hemos enviado un email con la factura")

        }catch(e){
            console.log(e)
            res.status(500).json({message:"Error en el servidor"})  
        }
 
    }
    static async getPeriodos( req: Request, res: Response){
        try{
            const periodos = await Periodo.find()
            res.json(periodos)
        }catch(e){
            console.log(e)
            res.status(500).json({message:"Error en el servidor"})  
        }
    }
}
export default PeriodoController