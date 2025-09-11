// --- Importaciones de Módulos ---

// Importamos Express para crear y gestionar las rutas.
import express from "express";
// Importamos 'body' de express-validator para validar los datos que vienen en el cuerpo de la petición.
import { body } from "express-validator";
// Importamos multer, el middleware que nos ayuda a manejar la subida de archivos.
import multer from "multer";
// Importamos path, un módulo de Node.js para trabajar con rutas de archivos y directorios.
import path from "path";

// --- Importación de Controladores ---

// Importamos las funciones que hemos definido en el controlador de dioses.
// Cada función se encargará de la lógica para una ruta específica.
import {
    getGods,
    getGodsById,
    createGod,
    updateGod,
    deleteGod
} from "../controllers/gods.controller.js";

// --- Inicialización del Router ---

// Creamos una nueva instancia de Router de Express.
const router = express.Router();

// --- Configuración de Multer para la Subida de Archivos ---

// 1. Configuración del almacenamiento en disco (diskStorage).
const storage = multer.diskStorage({
    // 'destination' define en qué carpeta se guardarán los archivos subidos.
    destination: (req, file, cb) => {
        // 'cb' es un callback que se llama con (error, destino). null significa que no hay error.
        // Guardamos los archivos en la carpeta 'public/images' que creamos antes.
        cb(null, 'public/images');
    },
    // 'filename' define cómo se nombrará el archivo dentro de la carpeta.
    filename: (req, file, cb) => {
        // Para evitar que los archivos se sobrescriban si tienen el mismo nombre, creamos un nombre único.
        // Usamos la fecha actual (Date.now()), un número aleatorio y la extensión original del archivo.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // El nombre final será: nombreDelCampo-sufijoUnico.extension
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Inicialización de multer con la configuración que hemos creado.
const upload = multer({
    // Le decimos a multer que use el 'storage' que definimos arriba.
    storage: storage,
    // 'fileFilter' nos permite decidir qué archivos aceptar y cuáles rechazar.
    fileFilter: (req, file, cb) => {
        // Verificamos el 'mimetype' del archivo. Si no empieza con "image/", lo rechazamos.
        if (!file.mimetype.startsWith("image/")) {
            // Llamamos al callback con un error y 'false' para indicar que el archivo no se acepta.
            return cb(new Error('¡Solo se permiten archivos de imagen!'), false);
        }
        // Si es una imagen, llamamos al callback sin error y con 'true' para aceptarla.
        cb(null, true);
    },
    // 'limits' nos permite poner restricciones, como el tamaño máximo del archivo.
    limits: { fileSize: 1 * 1024 * 1024 } // Límite de 1MB.
});

// --- Reglas de Validación ---

// Definimos un array de reglas de validación para la creación y actualización de dioses.
// express-validator usará estas reglas para comprobar los datos antes de que lleguen al controlador.
const godValidationRules = [
    // Para el campo 'nombre': no debe estar vacío. .escape() previene ataques XSS.
    body("nombre").escape().notEmpty().withMessage("el campo 'nombre' es obligatorio"),
    // Para el campo 'descripcion': solo lo "sanitizamos" con .escape().
    body("descripcion").escape(),
    // Para el campo 'cultura_id': no debe estar vacío.
    body("cultura_id").escape().notEmpty().withMessage("el campo 'cultura_id' es obligatorio"),
];

// --- Definición de Rutas ---

// Asociamos las rutas (endpoints) con sus verbos HTTP, middlewares y controladores.

// Ruta para OBTENER todos los dioses.
router.get("/", getGods);

// Ruta para OBTENER un solo dios por su ID.
router.get("/:id", getGodsById);

// Ruta para CREAR un nuevo dios.
// 1. 'upload.single('image')': Primero, el middleware de multer procesa la imagen que viene en el campo 'image'.
// 2. 'godValidationRules': Luego, se ejecutan las reglas de validación para los campos de texto.
// 3. 'createGod': Si todo lo anterior pasa, se ejecuta la función del controlador.
router.post("/", upload.single('image'), godValidationRules, createGod);

// Ruta para ACTUALIZAR un dios existente por su ID.
// El flujo es idéntico a la creación. Multer manejará la imagen si se envía una nueva.
router.put("/:id", upload.single('image'), godValidationRules, updateGod);

// Ruta para ELIMINAR un dios por su ID.
router.delete("/:id", deleteGod);

// --- Exportación del Router ---

// Exportamos el router para que pueda ser utilizado en 'server.js'.
export default router;