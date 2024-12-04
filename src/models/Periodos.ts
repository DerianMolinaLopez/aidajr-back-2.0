import mongoose,{Schema, Document, Types, PopulatedDoc} from 'mongoose';
import { InstructorInter } from './Instructor';
export enum Periodoenum{
    BIMESTRAL = "bimestral",
    TRIMESTRAL = "trimestral",
    SEMESTRAL = "semestral",
    ANUAL = "anual"
}
interface PeriodoInter extends Document{
    name:Periodoenum,
    price:number,
    mesesAcceso:number
    gruposMaximos:number
    maximoAlumnos:number
    description1:string //monitoreo de grupos
    description2:string //asignacion de tareas
}

const PeriodoSchema:Schema = new Schema({
    name:{
        type: String,
        required: true,
        enum: Object.values(Periodoenum)
    },
    price:{
        type: Number,
        required: true
    },
    instructor:{
        type: Schema.Types.ObjectId,
        ref: 'Instructor'
    },

    mesesAcceso:{
        type: Number,
        required: true
    },
    gruposMaximos:{
        type: Number,
        required: true
    },
    maximoAlumnos:{
        type: Number,
        required: true
    },

    description1:{
        type: String,
        required: true
    },
    description2:{
        type: String,
        required: true
    }



});

const Periodo = mongoose.model<PeriodoInter>('Periodo', PeriodoSchema);
export default Periodo