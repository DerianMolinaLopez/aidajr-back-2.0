import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';
export interface CoursesInter extends Document{
    name: string;
    description: string;
    instructor_Id: Types.ObjectId;
    start_date: Date;
    end_date: Date;
    alumnosInscritos: Types.ObjectId[];
}
const CoursesSchema:Schema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    instructor_Id:{
        type: Schema.Types.ObjectId,
        ref: 'Instructor', // Corregir aquí
        default: null
    },
    alumnosInscritos:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref:'Student-curses'
    },
    tipoCurso:{
        type: String,
        required: true,
        trim: true
    },
    start_date:{
        type: Date,
        required: true,
        default: Date.now
    },
    end_date:{
        type: Date,
        required: true,
        default: Date.now
    }
});
const Courses = mongoose.model<CoursesInter>('Courses', CoursesSchema);
export default Courses