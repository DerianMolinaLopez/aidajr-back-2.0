import mongoose, { Schema, Document, Types, PopulatedDoc } from 'mongoose';
import { InstructorInter } from './Instructor';
import { StudentInter } from './Student';
import { CoursesInter } from './Courses';

/**
 * 
 *  Nombre
    seccion a al que pertenece
    fechainicio
    fechafin
    descripcion
    direccion de imagen de disco
 */

export interface SectionsInter extends Document{
    name:String
    course : Types.ObjectId | PopulatedDoc<InstructorInter & Document> | CoursesInter["id"]
    description:String
    //!agregar un arreglo de id de tareas
}
export const SectionSchema:Schema = new Schema({

    name:{
        type: String,
        required: true,
        trim: true
    },
    course:{
        type: Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    }
    //! tambien al esquema, y el tipo sera de ob schema.types.objectid
})
const Section =mongoose.model<SectionsInter>('Sections', SectionSchema)
export default Section