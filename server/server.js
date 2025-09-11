import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testConection from './config/dataBase/dataBase.js';

// 1. Importamos los ENRUTADORES (los "Recepcionistas")
import culturesRouter from "./routes/cultures.router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares generales
app.use(cors());
app.use(express.json())

// 2. El "Gerente" le dice a la app qué "Recepcionista" usar para cada ruta principal
app.use("/cultures", culturesRouter);

// Ruta principal de bienvenida
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>API de Culturas</title>
                <style>
                    html, body { height: 100%; margin: 0; }
                    body {
                        font-family: Arial, sans-serif;
                        background-color: black;
                        color: #e3e3e3;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div>
                    <h1>API de culturas funcionando</h1>
                    <p>Servidor activo</p>
                </div>
            </body>
            </html>    
    `)
});

// 3. Ya no tenemos las rutas de culturas aquí, server.js está más limpio.

// Función para iniciar el servidor
const startServer = async () => {
    try {
        await testConection();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server', error.message);
    }
}

startServer();
