import mongoose from "mongoose";
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const ejecutarCicloCrud = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Conectado a MongoDB Atlas');

        await User.deleteMany({})
        console.log('Colección anterior ha sido limpiada');

        console.log('\n---1. Fase Create: Insertando Usuarios')

        const usersCreados = await User.insertMany([
            {
                usuario: 'aecaridad',
                email: 'aecaridad@gmail.com'
            },
            {
                usuario: 'CholosBurguer',
                email: 'cholosburguer@gmail.com'
            },
            {
                usuario: 'El Barto',
                email: 'elbarto@outlook.es'
            }
])

        console.log(`Se crearon ${usersCreados.length} usuarios`)

    } catch (error) {

        console.error('\nError en el Lab:', error.message)

    } finally {
        await mongoose.disconnect()
        console.log('\nDesconectado de MongoDB Atlas')
    }
}

ejecutarCicloCrud()