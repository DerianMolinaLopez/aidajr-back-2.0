

import mongoose, { Schema, Document, Types, PopulatedDoc,ObjectId } from 'mongoose';
import { InstructorInter } from './Instructor';
import { StudentInter } from './Student';

export interface CoursesInter extends Document {
    //?agregar el campo de precio
    _id:mongoose.Types.ObjectId;
    name: string;
    description: string;
    instructor_Id: PopulatedDoc<InstructorInter & Document>;
    start_date: Date;
    end_date: Date;
    course_students: PopulatedDoc<StudentInter & Document>[];
    tipoCurso: string;
    valoration: number;
    valorationDetail : ObjectId[];//hacemos que sea de ese tipo de valoracion o un objectId para usar dichos id
    sections : ObjectId[];
    valorable:boolean;
    costo:number;
   
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
    valorations:{//!modificacion
        type: [Schema.Types.ObjectId],
        ref: 'ValorationDetailCourseStudend',
        default: []
    },
    valoration:{
        type: Number,
        required: true,
        default: 0
    },
    sections:{
        type: [Schema.Types.ObjectId],
        ref: 'Sections',
        default: []
    },
    valorable:{
        type:Boolean,
        required:true,
        default:false//!si no se especifica la valoracion, entonces queda como false
    },
    costo:{
        type:Number,
        required:false,
    }
});

const Courses = mongoose.model<CoursesInter>('Courses', CoursesSchema);
export default Courses;