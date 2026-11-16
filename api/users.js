
import mongoose from "mongoose";
import User from "../models/User.js";

export default async function handler(req, res) {
    try {

        // =====================================
        // CONEXIÓN A MONGODB
        // =====================================

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI)
        }

        const { method } = req


        // =====================================
        // GET: CONSULTAR Y FILTRAR ENVÍOS
        // =====================================

        if (method === 'GET') {

            const {
                usuario,
                ciudad,
            } = req.query

            const filtro = {}

            // Filtrar por usuario
            if (usuario) {
                filtro.usuario = usuario
            }

            // Filtrar por email
            if (email) {
                filtro.email = email
            }

            const users = await User.find(filtro)
                .sort({ createdAt: -1 })

            return res.status(200).json({
                total: users.length,
                datos: users
            });
        }

    } catch (error) {

        console.error("Error en API de usuarios:", error);

        return res.status(500).json({
            error: "Error al procesar la operación",
            detalle: error.message
        });
    }
}