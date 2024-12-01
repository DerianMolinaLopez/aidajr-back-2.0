import mongoose, { Schema, Document, Types, PopulatedDoc } from 'mongoose';
import { InstructorInter } from './Instructor';
import { StudentInter } from './Student';
import { CoursesInter } from './Courses';
import { HomeworkInter } from './Homework';

/**
 * 
 *  Nombre
    seccion a al que pertenece
    fechainicio
    fechafin
    descripcion
    direccion de imagen de disco
 */

export interface SectionsInter extends Document {
    name: string;
    course: Types.ObjectId | PopulatedDoc<InstructorInter & Document> | CoursesInter["id"];
    description: string;
    homeworks: Types.ObjectId[]; // Cambiado a arreglo de ObjectId
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
    homeworks: {
        type: [Schema.Types.ObjectId], // Definido como arreglo de ObjectId
        ref: 'Homework',
        default: []
    }
});

const Section = mongoose.model<SectionsInter>('Sections', SectionSchema);
export default Section;