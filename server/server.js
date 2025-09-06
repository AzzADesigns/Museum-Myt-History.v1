import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testConection from './config/dataBase/dataBase.js';
import { getCultures, getCultureById, createCulture, updateCulture, deleteCulture } from './middlewares/culturesMiddleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Api de videojuegos</title>
                <style>
                    html {
                        height: 100%;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        background-color: black;
                        color: #e3e3e3;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        margin: 0;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div>
                    <h1>API de culturas funcionando</h1>
                    <p>servidor activo</p>
                </div>
            </body>
            </html>    
    `)
});

app.get('/cultures', getCultures)
app.get('/cultures/:id', getCultureById)
app.post('/cultures', createCulture)
app.put('/cultures/:id', updateCulture)
app.delete('/cultures/:id', deleteCulture)

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