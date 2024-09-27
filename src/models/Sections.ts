import mongoose, { Schema, Document, Types, PopulatedDoc } from 'mongoose';
import { InstructorInter } from './Instructor';
import { StudentInter } from './Student';
import { CoursesInter } from './Courses';
export interface SectionsInter extends Document{
    name:String
    course : Types.ObjectId | PopulatedDoc<InstructorInter & Document> | CoursesInter["id"]
    description:String
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
})
const Section =mongoose.model<SectionsInter>('Sections', SectionSchema)
export default Section