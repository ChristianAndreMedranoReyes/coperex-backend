import { Schema, model } from 'mongoose';

const EmpresaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    nivelImpacto: {
        type: String,
        required: true
    },
    añosTrayectoria: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true,
    versionKey: false
}
);

export default model('Empresa', EmpresaSchema);

