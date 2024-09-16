import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';
import {InstructorInter} from './Instructor';
import {StudentInter} from './Student';
import {CoursesInter} from './Courses';
export interface Student_CoursesInter extends Document{
    instructor_Id: PopulatedDoc<InstructorInter & Document>;
    student_Id: PopulatedDoc<StudentInter & Document>;
    courses_Id: PopulatedDoc <CoursesInter & Document>;
    pregress: number;
    inscription_date: Date;

}
const Student_CoursesSchema:Schema = new Schema({
    instructor_Id:{
        type: Schema.Types.ObjectId,
        ref: 'Instructor' // Corregir aquí
    },
    student_Id: {
        type: Schema.Types.ObjectId,
        ref: 'Student' // Corregir aquí
    },
    progress:{
        type: Number,
        default: 0
    },
    
    inscription_date:{
        type: Date,
        default: Date.now()
    },
});
const Student_Courses = mongoose.model<Student_CoursesInter>('Student-curses',Student_CoursesSchema);
export default Student_Courses