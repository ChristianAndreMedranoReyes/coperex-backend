'use strict';
 
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middleware/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import EmpresaRoutes from '../src/empresa/empresa.routes.js';
import reportRoutes from '../src/reports/report.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}
 
const routes = (app) => {
    console.log("Rutas cargadas: /CoperexSystem/v1/empresa");  // Añadir un log
    app.use("/CoperexSystem/v1/auth", authRoutes);
    app.use("/CoperexSystem/v1/empresa", EmpresaRoutes);
    app.use("/CoperexSystem/v1/report", reportRoutes);
}

const conectarDB = async () => {
    try{
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
    }catch(error){
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
}
 
export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;
 
    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}