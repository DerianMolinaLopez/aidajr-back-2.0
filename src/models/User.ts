import mongoose,{Schema, Document, PopulateOption, PopulatedDoc, ObjectId} from 'mongoose';
import { StudentInter } from './Student';
export interface UserInter extends Document{
    name: string;
    email: string;
    password: string;
    studentId: PopulatedDoc<StudentInter & Document>;
    type_user: string;
}
const UserSchema:Schema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    studentId:{
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: false
    },
    
    type_user:{
        type: String,
        required: true,
        trim: true 
    }
});

const User = mongoose.model<UserInter>('User', UserSchema);
export default User