import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';

export interface InstructorInter extends Document{
    user_Id: Types.ObjectId;
    specialty: string;
    courses: PopulatedDoc<'Course'>[];
}
const InstructorSchema:Schema = new Schema({
    user_Id: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Corregir aquí
    },
    specialty:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    }
});
const Instructor = mongoose.model<InstructorInter>('Instructor', InstructorSchema);
export default Instructor