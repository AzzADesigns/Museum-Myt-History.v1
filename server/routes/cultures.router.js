import express from "express";
import { body } from "express-validator";

// Importamos a los "Cocineros" desde el controlador
import {
    getCultures,
    getCultureById,
    createCulture,
    updateCulture,
    deleteCulture
} from "../controllers/cultures.controller.js";

const router = express.Router();

// --- Este es el trabajo del "Recepcionista" ---

// 1. Definimos las reglas de validación para la creación y actualización
const creationRules = [
    body("nombre").escape().notEmpty().withMessage("El campo 'nombre' es obligatorio."),
    body("descripcion").escape().notEmpty().withMessage("El campo 'descripcion' es obligatorio."),
    body("idioma").escape().notEmpty().withMessage("El campo 'idioma' es obligatorio."),
    body("region").escape().notEmpty().withMessage("El campo 'region' es obligatorio."),
    body("fecha_inicio").escape().notEmpty().withMessage("El campo 'fecha_inicio' es obligatorio."),
];

const updateRules = [
    body("nombre").escape().notEmpty().withMessage("El campo 'nombre' es obligatorio."),
    body("descripcion").escape().notEmpty().withMessage("El campo 'descripcion' es obligatorio."),
    body("idioma").escape().notEmpty().withMessage("El campo 'idioma' es obligatorio."),
    body("region").escape().notEmpty().withMessage("El campo 'region' es obligatorio."),
    body("fecha_inicio").escape().notEmpty().withMessage("El campo 'fecha_inicio' es obligatorio."),
];


// 2. Definimos el "menú" (las rutas) y le asignamos su "Cocinero"
// Para POST y PUT, primero pasamos las reglas de validación.
router.get('/', getCultures);
router.get('/:id', getCultureById);
router.post('/', creationRules, createCulture);
router.put('/:id', updateRules, updateCulture);
router.delete('/:id', deleteCulture);

export default router;
