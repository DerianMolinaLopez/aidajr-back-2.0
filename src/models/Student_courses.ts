import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';
import {InstructorInter} from './Instructor';
import {StudentInter} from './Student';
import {CoursesInter} from './Courses';
//! verificar la relacion de este archivo intermedio
//la logica no me cuadra
export interface Student_CoursesInter extends Document{
    course: PopulatedDoc<CoursesInter & Document>;
    student: PopulatedDoc<StudentInter & Document>;
    progress: number;
    inscription_date: Date;

}
const Student_CoursesSchema:Schema = new Schema({
    course:{
        type: Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },

    student:{
        type: [Schema.Types.ObjectId],
        ref: 'Student',
        required: true
    },
    process:{
        type: Number,
        required: true,
        default: 0
    },
    inscription_date:{
        type: Date,
        required: true,
        default: Date.now
    }
});
const Student_Courses = mongoose.model<Student_CoursesInter>('Student-curses',Student_CoursesSchema);
export default Student_Courses