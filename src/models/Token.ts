
import mongoose, { Schema, Document, Types, PopulatedDoc,ObjectId } from 'mongoose';
import { InstructorInter } from './Instructor';
import { StudentInter } from './Student';

export interface TokenInter extends Document {
    token: string;
    email:string;
    createdAt: Date;
}
const TokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // El token expira en 1 hora (3600 segundos)
      }
})
const Token = mongoose.model<TokenInter>('Token', TokenSchema);
export default Token;