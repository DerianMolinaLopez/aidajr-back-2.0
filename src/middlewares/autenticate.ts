import jwt  from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { UserInter } from '../models/User';
import Student, {StudentInter} from '../models/Student';
declare global {
    namespace Express {
        interface Request {
            user?: UserInter;
            student?: StudentInter;
        }
    }
}
export async function autenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
      //  console.log(token)
        const tokenDecoded = jwt.verify(token!, process.env.SECRET_JWT_KEY!);
        if(typeof tokenDecoded === 'object'){
           // console.log(tokenDecoded)
            const user = await User.findById(tokenDecoded.id);
            req.user = user as UserInter;
            next()
           
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'No autorizado' });
    }
}