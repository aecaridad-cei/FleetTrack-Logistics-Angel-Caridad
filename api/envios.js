
import mongoose from "mongoose";
import Envio from "../models/Envio.js";

export default async function handler(req, res) {
    try {

        // =====================================
        // CONEXIÓN A MONGODB
        // =====================================

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const { method } = req;


        // =====================================
        // GET: CONSULTAR Y FILTRAR ENVÍOS
        // =====================================

        if (method === 'GET') {

            const {
                estado,
                ciudad,
                sinRepartidor
            } = req.query;

            const filtro = {};

            // Filtrar por estado
            if (estado) {
                filtro.estado = estado;
            }

            // Filtrar por ciudad usando $regex
            if (ciudad) {
                filtro.ciudadDestino = {
                    $regex: ciudad,
                    $options: 'i'
                };
            }

            // Buscar envíos sin repartidor asignado
            if (sinRepartidor === 'true') {
                filtro.repartidor = {
                    $exists: false
                };
            }

            const envios = await Envio.find(filtro)
                .sort({ createdAt: -1 });

            return res.status(200).json({
                total: envios.length,
                datos: envios
            });
        }


        // =====================================
        // POST: CREAR UN NUEVO ENVÍO
        // =====================================

        if (method === 'POST') {

            const nuevoEnvio = await Envio.create(req.body);

            return res.status(201).json({
                mensaje: 'Envío creado correctamente',
                datos: nuevoEnvio
            });
        }


        // =====================================
        // PATCH: ACTUALIZAR UN ENVÍO
        // =====================================

        if (method === 'PATCH') {

            const { trackingCode } = req.query;

            if (!trackingCode) {
                return res.status(400).json({
                    error: 'Debes proporcionar el trackingCode'
                });
            }

            const {
                estado,
                repartidor,
                sumarIntento,
                nuevaNota,
                quitarNota
            } = req.body;

            const actualizacion = {};

            // Modificar estado y repartidor
            const cambios = {};

            if (estado !== undefined) {
                cambios.estado = estado;
            }

            if (repartidor !== undefined) {
                cambios.repartidor = repartidor;
            }

            if (Object.keys(cambios).length > 0) {
                actualizacion.$set = cambios;
            }

            // Incrementar intentos de entrega
            if (sumarIntento === true) {
                actualizacion.$inc = {
                    intentosEntrega: 1
                };
            }

            // Añadir una nota al array
            if (nuevaNota) {
                actualizacion.$push = {
                    notasRuta: nuevaNota
                };
            }

            // Eliminar una nota específica del array
            if (quitarNota) {
                actualizacion.$pull = {
                    notasRuta: quitarNota
                };
            }

            if (Object.keys(actualizacion).length === 0) {
                return res.status(400).json({
                    error: 'No se han proporcionado datos para actualizar'
                });
            }

            const envioActualizado = await Envio.findOneAndUpdate(
                { trackingCode: trackingCode },
                actualizacion,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!envioActualizado) {
                return res.status(404).json({
                    error: 'No se ha encontrado el envío'
                });
            }

            return res.status(200).json({
                mensaje: 'Envío actualizado correctamente',
                datos: envioActualizado
            });
        }


        // =====================================
        // DELETE: ELIMINAR UN ENVÍO
        // =====================================

        if (method === 'DELETE') {

            const { trackingCode } = req.query;

            if (!trackingCode) {
                return res.status(400).json({
                    error: 'Debes proporcionar el trackingCode'
                });
            }

            const envioEliminado = await Envio.findOneAndDelete({
                trackingCode: trackingCode
            });

            if (!envioEliminado) {
                return res.status(404).json({
                    error: 'No se ha encontrado el envío'
                });
            }

            return res.status(200).json({
                mensaje: 'Envío eliminado correctamente',
                datos: envioEliminado
            });
        }


        // =====================================
        // MÉTODO HTTP NO PERMITIDO
        // =====================================

        return res.status(405).json({
            error: `Method ${method} no permitido`
        });


    } catch (error) {

        console.error("Error en API de envíos:", error);

        return res.status(500).json({
            error: "Error al procesar la operación",
            detalle: error.message
        });
    }
}
