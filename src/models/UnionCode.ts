import mongoose, { Schema, Document, ObjectId, PopulatedDoc } from 'mongoose';
import { CoursesInter } from './Courses';

export interface IUnionCode extends Document {
    code: string;
    group: ObjectId | PopulatedDoc< CoursesInter>;
    instructorId: ObjectId;
}

const UnionCodeSchema: Schema = new Schema({
    instructorId: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        trim: true,

    },
    group: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref:'Courses'
    },
});

const UnionCode = mongoose.model<IUnionCode>('UnionCode', UnionCodeSchema);
export default UnionCode;