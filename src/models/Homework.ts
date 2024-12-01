import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';
import { CoursesInter } from './Courses';
import { UserInter } from './User';
import Section, { SectionsInter } from './Sections';

interface HomeworkInter extends Document{
    title:string,
    description:string,
    course:Types.ObjectId | PopulatedDoc<CoursesInter & Document>
    beginDate:Date,
    endDate:Date,   
    Section:Types.ObjectId | PopulatedDoc<SectionsInter & Document>
}

const HomeworkSchema:Schema= new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:'Courses',
        required:true
    },
    beginDate:{//2024-12-01T10:15:30Z formato de la ISO8601
        type:Date,
        required:true,
        default : Date.now
    },
    endDate:{
        type:Date,
        required:true
    },
    Section:{
        type:Schema.Types.ObjectId,
        ref:'Section',
        required:true
    }
})
const  Homework = mongoose.model<HomeworkInter>('Homework', HomeworkSchema);
export default Homework