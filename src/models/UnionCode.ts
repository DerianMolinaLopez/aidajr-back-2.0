import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUnionCode extends Document {
    code: string;
    group: ObjectId;
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
        trim: true
    },
});

const UnionCode = mongoose.model<IUnionCode>('UnionCode', UnionCodeSchema);
export default UnionCode;