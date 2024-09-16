import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';
import { CoursesInter } from './Courses';
export interface InstructorInter extends Document{
    user_Id: Types.ObjectId;
    courses: PopulatedDoc<CoursesInter & Document>[];
}
const InstructorSchema:Schema = new Schema({
    user_Id: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    courses:{
        type: [Schema.Types.ObjectId],
        ref: 'Courses'
    },
    

});
const Instructor = mongoose.model<InstructorInter>('Instructor', InstructorSchema);
export default Instructor