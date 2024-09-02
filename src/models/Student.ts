import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';
export interface StudentInter extends Document{
    user_Id: PopulatedDoc<Types.ObjectId>;
    inscription_date: Date;

}
const StudentSchema:Schema = new Schema({
    user_Id: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Corregir aquí
    },
    inscription_date:{
        type: Date,
        default: Date.now()
    },
});
const Student = mongoose.model<StudentInter>('Student', StudentSchema);
export default Student