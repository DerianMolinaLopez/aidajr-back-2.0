import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';
export interface CoursesInter extends Document{
    name: string;
    description: string;
    instructor_Id: Types.ObjectId;
    start_date: Date;
    end_date: Date;
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
        ref: 'Instructor' // Corregir aquí
    },
    start_date:{
        type: Date,
        required: true,
    },
    end_date:{
        type: Date,
        required: true,
    }
});
const Courses = mongoose.model<CoursesInter>('Courses', CoursesSchema);
export default Courses