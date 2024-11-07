import mongoose, { Schema, Document, Types, PopulatedDoc } from 'mongoose';
import { InstructorInter } from './Instructor';
import { StudentInter } from './Student';
import { CoursesInter } from './Courses';
export interface SectionsInter extends Document {
    name: String;
    course: Types.ObjectId | CoursesInter["id"];
    description: String;

    tasks: Types.ObjectId[];  //! Arreglo de IDs de tareas interfaz de tareas
}

export const SectionSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: {
        
        type: [Schema.Types.ObjectId],
        ref: 'Tasks',  // Referencia al modelo de Tasks
        default: []
    }
});

const Section = mongoose.model<SectionsInter>('Sections', SectionSchema);
export default Section;
