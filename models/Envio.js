import mongoose, { mongo } from "mongoose";

const envioSchema = new mongoose.Schema({
    trackingCode: {
        type: String,
        require: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    destinatario: {
        type: String,
        require: true,
        trim: true,
        minlength: [3, 'El nombre de destinatario debe contener minimo 3 caracteres']
    },
    ciudadDestino: {
        type: String,
        require: true,
        trim: true
    },
    estado: {
        type: String,
        required: true,
        enum: {
            values: ['En Almacén', 'En Reparto', 'Entregado', 'Incidencia'],
            message: '{VALUE} no es un estado valido'
        },
        default: 'En Almacén'
    },
    repartidor: {
        type: String,
        trim: true,
    },
    intentosEntrega: {
        type: Number,
        min: 0,
        max: 3,
        default: 0
    },
    notasRuta: {
        type: [String],
        default: []
    },
},
{
    timestamps: true
})

const Envio = mongoose.models.Envio || mongoose.model('Envio', envioSchema)

export default Envio