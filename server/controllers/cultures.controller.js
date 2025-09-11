import { pool } from "../config/dataBase/dataBase.js";
import { validationResult } from "express-validator";

const getCultures = async (req, res) => {
    try {
        const request = 'SELECT * FROM culturas'
        const result = await pool.query(request);

        res.json({
            success: true,
            message: 'Cultures retrieved successfully',
            data: result.rows,
            total: result.rowCount 
        })
    } catch (error) {
        console.error('Error retrieving cultures', error.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving cultures',
            error: error.message
        })
    }
}


const getCultureById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = 'SELECT * FROM culturas WHERE id = $1'
        const result = await pool.query(request, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Culture not found'
            })
        }

        res.json({
            success: true,
            message: 'Culture retrieved successfully',
            data: result.rows[0]
        })
    } catch (error) {
        console.error('Error retrieving culture by ID', error.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving culture by ID',
            error: error.message
        })
    }
}

const createCulture = async (req, res) => {
    // 1. El "Cocinero" revisa si el "Recepcionista" (validador) encontró errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        // 2. Si no hay errores, procede a "cocinar" (insertar en la DB)
        const { nombre, descripcion, idioma, region, fecha_inicio, periodo } = req.body;

        const request = 'INSERT INTO culturas (nombre, descripcion, idioma, region, fecha_inicio, periodo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [nombre, descripcion, idioma, region, fecha_inicio, periodo];

        const result = await pool.query(request, values);

        res.status(201).json({
            success: true,
            message: 'Culture created successfully',
            data: result.rows[0]
        })
    }
    catch (error) {
        console.error('Error creating culture', error.message);
        res.status(500).json({
            success: false,
            message: 'Error creating culture',
            error: error.message
        })
    }
}

const updateCulture = async (req, res) => {
    // 1. Misma comprobación de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    try {
        const { id } = req.params;
        const { nombre, descripcion, idioma, region, fecha_inicio, periodo } = req.body;

        const request = 'UPDATE culturas SET nombre = $1, descripcion = $2, idioma = $3, region = $4, fecha_inicio = $5, periodo = $6 WHERE id = $7 RETURNING *';
        const values = [nombre, descripcion, idioma, region, fecha_inicio, periodo, id];

        const result = await pool.query(request, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Culture not found'
            });
        }

        res.json({
            success: true,
            message: 'Culture updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating culture', error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating culture',
            error: error.message
        });
    }
}

const deleteCulture = async (req, res) => {
    try {
        const { id } = req.params;
        const request = 'DELETE FROM culturas WHERE id = $1 RETURNING *';
        const result = await pool.query(request, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Culture not found'
            });
        }

        res.json({
            success: true,
            message: 'Culture deleted successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error deleting culture', error.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting culture',
            error: error.message
        });
    }
}

export {
    getCultures,
    getCultureById,
    createCulture,
    updateCulture,
    deleteCulture
}
