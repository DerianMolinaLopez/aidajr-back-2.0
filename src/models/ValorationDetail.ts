import mongoose, { ObjectId,PopulatedDoc,Schema } from "mongoose"
import { UserInter } from "./User"
import { CoursesInter } from "./Courses";
/**
 * Con esta interfaz sabriamos quien ha calificado un curso
 * y que curso fue el calificaddo, de esta manera no se me
 * va arepetir la posibildiad de poder calificar un curso en
 * especifico 
 */

export interface ValorationDetailCourseStudend extends Document{
    userId:PopulatedDoc<UserInter & Document>;//!DECLARAMOS QUE CUANDO HACEMOS LA COSULTA SERA UN DOCUMENTO POPULATE
    _id:ObjectId;
    valoration:number;
    course_id:PopulatedDoc<UserInter & CoursesInter> | ObjectId ;
}
//todo va a ser requerido
const ValorationSchema : Schema = new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        valoration:{
            type:Number,
            required:true
        },
        course_id:{
            type:Schema.Types.ObjectId,
            ref:'Courses',
            required:true
        }
    }
)
const Valoration = mongoose.model<ValorationDetailCourseStudend>('ValorationDetailCourseStudend',ValorationSchema);
export default Valoration;