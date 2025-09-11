// --- Importaciones ---

// Importamos el 'pool' de conexiones a la base de datos que configuramos.
import { pool } from "../config/dataBase/dataBase.js";
// Importamos 'validationResult' para obtener los resultados de las validaciones que se corrieron en el router.
import { validationResult } from "express-validator";

// --- Controlador para OBTENER todos los dioses ---
const getGods = async (req, res) => {
    // Usamos un bloque try...catch para manejar posibles errores en la consulta.
    try {
        // Definimos la consulta SQL para seleccionar todos los registros de la tabla 'dioses'.
        const request = 'SELECT * FROM dioses';
        // Ejecutamos la consulta usando el pool. 'await' pausa la ejecución hasta que la promesa se resuelva.
        const result = await pool.query(request);

        // Si la consulta es exitosa, enviamos una respuesta JSON con los datos.
        res.json({
            success: true,
            message: "Dioses obtenidos exitosamente",
            data: result.rows, // 'result.rows' contiene un array con todos los dioses.
            total: result.rowCount // 'result.rowCount' contiene el número total de filas.
        });
    } catch (error) {
        // Si ocurre un error en el 'try', se ejecuta este bloque.
        console.log("Error al obtener los dioses", error.message);
        // Enviamos una respuesta de error 500 (Error Interno del Servidor).
        res.status(500).json({
            success: false,
            message: "Error al obtener los dioses",
            error: error.message
        });
    }
};

// --- Controlador para OBTENER un dios por su ID ---
const getGodsById = async (req, res) => {
    try {
        // Obtenemos el 'id' de los parámetros de la URL (ej: /api/gods/1).
        const { id } = req.params;
        // Definimos la consulta SQL usando un placeholder ($1) para evitar inyección SQL.
        const request = 'SELECT * FROM dioses WHERE id = $1';
        // Ejecutamos la consulta pasando el 'id' en un array. El driver de 'pg' reemplazará $1 con el valor de 'id'.
        const result = await pool.query(request, [id]);

        // Si 'rowCount' es 0, significa que no se encontró ningún dios con ese ID.
        if (result.rowCount === 0) {
            // Devolvemos un error 404 (No Encontrado).
            return res.status(404).json({
                success: false,
                message: 'Dios no encontrado'
            });
        }

        // Si se encuentra, devolvemos los datos del primer (y único) resultado.
        res.json({
            success: true,
            message: 'Dios obtenido exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al obtener dios por ID', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al obtener dios por ID',
            error: error.message
        });
    }
};

// --- Controlador para CREAR un nuevo dios ---
const createGod = async (req, res) => {
    // Primero, verificamos si hubo errores de validación (definidos en el router).
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si hay errores, devolvemos un 422 (Unprocessable Entity) con la lista de errores.
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        // Obtenemos los datos del cuerpo de la petición (enviados en el formulario).
        const { nombre, descripcion, cultura_id } = req.body;
        // Obtenemos la ruta de la imagen del objeto 'req.file' que multer nos proporciona.
        // Si no se subió ningún archivo, 'req.file' no existirá, y guardamos 'null'.
        const imagen_url = req.file ? req.file.path : null;

        // Definimos la consulta SQL para insertar un nuevo registro.
        // 'RETURNING *' hace que la consulta devuelva el objeto completo que se acaba de crear.
        const request = 'INSERT INTO dioses (nombre, descripcion, cultura_id, imagen_url) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [nombre, descripcion, cultura_id, imagen_url];

        // Ejecutamos la consulta.
        const result = await pool.query(request, values);

        // Devolvemos un estado 201 (Creado) y los datos del nuevo dios.
        res.status(201).json({
            success: true,
            message: 'Dios creado exitosamente',
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear el dios', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al crear el dios',
            error: error.message
        });
    }
};

// --- Controlador para ACTUALIZAR un dios ---
const updateGod = async (req, res) => {
    // Verificamos errores de validación.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    try {
        // Obtenemos el ID de los parámetros de la URL.
        const { id } = req.params;
        // Obtenemos los datos a actualizar del cuerpo de la petición.
        const { nombre, descripcion, cultura_id } = req.body;
        // Verificamos si se subió una nueva imagen.
        // Si 'req.file' existe, usamos la nueva ruta. Si no, mantenemos el valor que ya estaba (que viene en req.body.imagen_url).
        // NOTA: Para que esto funcione, el cliente debe enviar el valor anterior de imagen_url si no quiere cambiar la imagen.
        const imagen_url = req.file ? req.file.path : req.body.imagen_url;

        // Definimos la consulta SQL para actualizar.
        const request = 'UPDATE dioses SET nombre = $1, descripcion = $2, cultura_id = $3, imagen_url = $4  WHERE id = $5 RETURNING *';
        const values = [nombre, descripcion, cultura_id, imagen_url, id];

        const result = await pool.query(request, values);

        // Si no se actualizó ninguna fila, el dios no existía.
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Dios no encontrado'
            });
        }

        // Devolvemos los datos del dios actualizado.
        res.json({
            success: true,
            message: 'Dios actualizado exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar el dios', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el dios',
            error: error.message
        });
    }
};

// --- Controlador para ELIMINAR un dios ---
const deleteGod = async (req, res) => {
    try {
        // Obtenemos el ID de los parámetros de la URL.
        const { id } = req.params;
        // Definimos la consulta SQL para eliminar.
        const request = 'DELETE FROM dioses WHERE id = $1 RETURNING *';
        
        const result = await pool.query(request, [id]);

        // Si no se eliminó ninguna fila, el dios no existía.
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Dios no encontrado'
            });
        }

        // Devolvemos los datos del dios que acaba de ser eliminado.
        res.json({
            success: true,
            message: 'Dios eliminado exitosamente',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error al eliminar el dios', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el dios',
            error: error.message
        });
    }
};

// --- Exportaciones ---

// Exportamos todas las funciones para que puedan ser importadas y usadas en el router.
export {
    getGods,
    getGodsById,
    createGod,
    updateGod,
    deleteGod
};