Ejercicio Propuesto (Día 7): "FleetTrack Logistics" — Gestión de Envíos y Paquetería
Objetivo: Implementar el ciclo completo CRUD (Crear, Leer, Actualizar y Borrar) y consultas con operadores avanzados de MongoDB ($or, $regex, $exists, $all, $inc, $push, $pull) utilizando Mongoose, MongoDB Atlas, Vercel y Thunder Client / Postman.

Contexto del Negocio
La empresa de logística FleetTrack necesita un backend Serverless para rastrear sus paquetes en tiempo real. Actualmente no pueden saber qué paquetes están atascados sin repartidor asignado, cuántos intentos de entrega lleva cada pedido ni registrar incidencias durante la ruta. Tu misión es construir su modelo de datos, ejecutar una batería de operaciones CRUD por consola y desplegar el endpoint RESTful en Vercel.

Tareas a Realizar
Tarea 1: Diseñar el Modelo (models/Envio.js)
Crea el esquema y modelo Envio aplicando las siguientes reglas de validación:

trackingCode: String, obligatorio, único, en mayúsculas (uppercase) y sin espacios a los lados (trim). Ejemplo: 'ENV-9001'.
destinatario: String, obligatorio, trim, mínimo 3 caracteres.
ciudadDestino: String, obligatorio, trim.
estado: String, obligatorio, restringido por enum a: 'En Almacén', 'En Reparto', 'Entregado', 'Incidencia'. Valor por defecto: 'En Almacén'.
prioridad: String, obligatorio, restringido por enum a: 'Estándar', 'Express', 'Urgente'. Valor por defecto: 'Estándar'.
repartidor: String, trim (campo opcional, ya que al entrar al almacén aún no tiene repartidor asignado).
intentosEntrega: Number, valor por defecto 0, mínimo 0, máximo 3.
notasRuta: Arreglo de textos ([String]), valor por defecto [] (ej: ['fragil', 'llamar-antes']).
timestamps: Activado (true).
(Recuerda incluir la protección mongoose.models.Envio || mongoose.model(...) para entornos Serverless).

Tarea 2: Script de Ciclo CRUD en Consola (crud-envios.js)
Crea un script en la raíz del proyecto que se conecte a MongoDB Atlas, limpie la colección (deleteMany({})) y ejecute en orden las siguientes 4 fases mostrando los resultados en la terminal:

Fase CREATE:

Inserta un lote de 5 envíos iniciales (insertMany) combinando distintas ciudades (Madrid, Valencia, Barcelona), estados, prioridades, algunos con repartidor y otros sin el campo repartidor.
Fase READ (Operadores de Consulta):

Consulta 1 ($or): Buscar envíos cuya prioridad sea 'Urgente' O que estén en estado 'Incidencia'.
Consulta 2 ($exists): Buscar envíos pendientes de asignar (donde el campo repartidor no exista).
Consulta 3 ($regex): Buscar envíos cuya ciudadDestino contenga la palabra 'valencia' (insensible a mayúsculas/minúsculas).
Consulta 4 ($all): Buscar envíos cuyo arreglo notasRuta contenga ambas etiquetas: 'fragil' y 'asegurado'.
Fase UPDATE (Operadores atómicos):

Actualización individual (findOneAndUpdate): Para un envío específico, asígnale un repartidor, cambia su estado a 'En Reparto' ($set), súmale 1 a intentosEntrega ($inc) y añade la nota 'Intento 1 realizado' al arreglo notasRuta ($push). Recuerda activar { new: true, runValidators: true }.
Actualización masiva (updateMany): A todos los envíos que sigan sin repartidor asignado ($exists: false), asígnales el repartidor 'Flota Central'.
Fase DELETE:

Elimina un envío específico que ya esté en estado 'Entregado' usando findOneAndDelete y muestra por consola cuántos documentos quedan activos en la colección (countDocuments).
Ejecútalo en la terminal de VS Code:

node crud-envios.js
Tarea 3: Endpoint Serverless CRUD en Vercel (api/envios.js)
Crea la función Serverless api/envios.js que soporte los 4 métodos HTTP:

GET: Permite filtrar opcionalmente por ?estado=, ?ciudad= (usando $regex insensible a mayúsculas), y ?sinRepartidor=true (usando $exists: false).
POST: Crea un nuevo envío con los datos JSON recibidos en req.body.
PATCH: Recibe ?trackingCode=ENV-XXXX por Query Params y permite actualizar estado, repartidor, sumar un intento (sumarIntento: true usando $inc), añadir una nota (nuevaNota usando $push) o quitar una nota (quitarNota usando $pull).
DELETE: Recibe ?trackingCode=ENV-XXXX y elimina el envío de la base de datos.
Tarea 4: Pruebas en Thunder Client o Postman
Despliega el proyecto en Vercel (o pruébalo con tu URL en la nube) y verifica las 4 operaciones desde Thunder Client o Postman:

Crear el envío ENV-9999 mediante POST.
Filtrar envíos por ciudad y sin repartidor mediante GET.
Asignar repartidor, pasar a 'En Reparto' y sumar un intento a ENV-9999 mediante PATCH.
Eliminar el envío ENV-9999 mediante DELETE.
Criterios de Evaluación / Validación
 Modelo validado: Restricciones enum, min, max y campos opcionales bien configurados.
 Operadores de consulta: Uso correcto de $or, $exists, $regex y $all.
 Actualizaciones atómicas: Uso adecuado de $set, $inc, $push, $pull y las banderas { new: true, runValidators: true }.
 API RESTful: Manejo correcto de GET, POST, PATCH y DELETE en Vercel probado desde Thunder Client o Postman.