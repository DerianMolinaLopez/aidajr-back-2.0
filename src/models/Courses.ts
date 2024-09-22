import mongoose, { Schema, Document, Types, PopulatedDoc } from 'mongoose';
import { InstructorInter } from './Instructor';
import { StudentInter } from './Student';

export interface CoursesInter extends Document {
    name: string;
    description: string;
    instructor_Id: PopulatedDoc<InstructorInter & Document>;
    start_date: Date;
    end_date: Date;
    course_students: PopulatedDoc<StudentInter & Document>[];
    tipoCurso: string;
    valoration: number;
   
}

const CoursesSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    instructor_Id: {
        type: Schema.Types.ObjectId,
        ref: 'Instructor',
        default: null
    },
    course_students: { 
        type: [Schema.Types.ObjectId],
        ref: 'Student-curses',
        default: []
    },
    tipoCurso: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    end_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    valoration:{
        type: Number,
        required: true,
        default: 0
    }
});

const Courses = mongoose.model<CoursesInter>('Courses', CoursesSchema);
export default Courses;