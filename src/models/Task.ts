import mongoose, { Schema, Document, Types } from 'mongoose';
import { SectionsInter } from './Sections';

/**
 *  Modelo de Tareas
 *  - Nombre
 *  - Fecha de inicio
 *  - Fecha de fin
 *  - Descripción
 *  - Sección a la que pertenece
 */
export interface TaskInter extends Document {
    name: String;
    startDate: Date;
    endDate: Date;
    description: String;
    section: Types.ObjectId | SectionsInter;
}

export const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
        
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Sections',
        required: true
    }
});

const Task = mongoose.model<TaskInter>('Task', TaskSchema);
export default Task;
