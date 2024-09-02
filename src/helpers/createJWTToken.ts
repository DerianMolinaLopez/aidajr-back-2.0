import jwt from "jsonwebtoken";
import Types from "mongoose";
type UserPayload = {
    id: Types.ObjectId;
    email: string;
    type_user: string;
    studentId: Types.ObjectId;
}
export const createJWTToken = (payload: UserPayload): string => {
    return jwt.sign(payload, process.env.SECRET_JWT_KEY as string, {
        expiresIn: '2h'
    });
}