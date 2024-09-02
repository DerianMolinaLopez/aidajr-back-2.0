import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';
export interface Student_CoursesInter extends Document{
    student_Id: Types.ObjectId;
    courses_Id: Types.ObjectId;
    inscription_date: Date;

}
const Student_CoursesSchema:Schema = new Schema({
    student_Id: {
        type: Schema.Types.ObjectId,
        ref: 'Student' // Corregir aquí
    },
    uscourses_Ider: {
        type: Schema.Types.ObjectId,
        ref: 'Student' // Corregir aquí
    },
    inscription_date:{
        type: Date,
        default: Date.now()
    },
});
const Student_Courses = mongoose.model<Student_CoursesInter>('Student',Student_CoursesSchema);
export default Student_Courses