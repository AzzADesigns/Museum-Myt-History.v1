// --- Importaciones de Módulos ---

// Importamos Express, el framework principal para construir nuestra API.
import express from 'express';
// Importamos CORS (Cross-Origin Resource Sharing) para permitir que nuestra API sea accedida desde otros dominios.
import cors from 'cors';
// Importamos dotenv para cargar variables de entorno desde un archivo .env.
import dotenv from 'dotenv';
// Importamos nuestra función para testear la conexión a la base de datos.
import testConection from './config/dataBase/dataBase.js';

// --- Importaciones de Routers ---

// Importamos los routers que hemos definido. Cada router maneja un recurso específico.
import culturesRouter from './routes/cultures.router.js';
import godsRouter from './routes/gods.router.js';

// --- Configuración Inicial ---

// Ejecutamos dotenv.config() para que las variables del archivo .env estén disponibles en process.env.
dotenv.config();

// Creamos una instancia de la aplicación Express.
const app = express();
// Definimos el puerto. Lo toma de las variables de entorno o usa 3000 por defecto.
const PORT = process.env.PORT || 3000;

// --- Middlewares Globales ---

// Usamos el middleware de CORS para permitir peticiones de otros orígenes.
app.use(cors());
// Usamos el middleware express.json() para que nuestra app pueda entender y procesar cuerpos de petición en formato JSON.
app.use(express.json());

// Usamos el middleware express.static('public') para servir archivos estáticos.
// Cualquier archivo dentro de la carpeta 'public' será accesible directamente desde el navegador.
// Por ejemplo, una imagen en 'public/images/foto.jpg' se podrá ver en 'http://localhost:3001/images/foto.jpg'.
app.use(express.static('public'));

// --- Definición de Rutas ---

// Le decimos a nuestra aplicación que use los routers que importamos.
// Cualquier petición que empiece con '/api/cultures' será manejada por 'culturesRouter'.
app.use('/api/cultures', culturesRouter);
// Cualquier petición que empiece con '/api/gods' será manejada por 'godsRouter'.
app.use('/api/gods', godsRouter);


// Definimos una ruta raíz de bienvenida para la API.
app.get('/', (req, res) => {
    res.send('Welcome to the Myt-History API');
});

// --- Arranque del Servidor ---

// Ponemos el servidor a escuchar en el puerto definido.
app.listen(PORT, () => {
    // Cuando el servidor arranca, mostramos un mensaje en la consola.
    console.log(`Server is running on port ${PORT}`);
    // Y ejecutamos la función para verificar la conexión con la base de datos.
    testConection();
});
