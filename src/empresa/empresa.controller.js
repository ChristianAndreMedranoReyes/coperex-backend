import Empresa from './empresa.model.js';
import { generarReporteExcel } from "../reports/report.controller.js";

export const createEmpresa = async (req, res) => {
    try {
        const data = req.body;

        const nuevaEmpresa = await Empresa.create({
            nombre: data.nombre,
            email: data.email,
            nivelImpacto: data.nivelImpacto,
            añosTrayectoria: data.añosTrayectoria,
            categoria: data.categoria,
        });

        res.status(201).json({
            msg: 'Empresa creada con éxito',
            detalleEmpresa: {
                empresa: nuevaEmpresa.nombre,
            }
        });

        setTimeout(() => {
            generarReporteExcel()
            .then(() => {
                console.log("Reporte actualizado");
            })
            .catch((error) => {
                console.error("Error al generar el reporte:", error);
            });
        }, 0);
    
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error en el servidor',
            error: error.message
        });
    }
}

export const listEmpresa = async (req, res) => {
    try {
        const { limite = 10, desde = 0, orderBy = "nombre", sortDirection = "asc", categoria, añosTrayectoria } = req.query;

        let query = { estado: true };

        if (categoria) {
            query.categoria = categoria;
        }

        if (añosTrayectoria) {
            query.añosTrayectoria = añosTrayectoria;
        }

        let sortOrder = {};

        if (orderBy === "añosTrayectoria") {
            sortOrder.añosTrayectoria = sortDirection === "desc" ? -1 : 1; 
        } else if (orderBy === "categoria") {
            sortOrder.categoria = sortDirection === "desc" ? -1 : 1; 
        } else if (orderBy === "nombre") {
            sortOrder.nombre = sortDirection === "desc" ? -1 : 1; 
        }

        const limitValue = Math.max(1, Number(limite));
        const skipValue = Math.max(0, Number(desde));

        const [total, Empresas] = await Promise.all([
            Empresa.countDocuments(query),
            Empresa.find(query)
                .sort(sortOrder) 
                .skip(skipValue)
                .limit(limitValue)
        ]);

        return res.status(200).json({
            success: true,
            total,
            Empresas
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al mostrar las empresas',
            error: err.message
        });
    }
}
export const editEmpresa = async (req, res) => {
    try {
        const { id } = req.params; 
        const data = req.body;

        const empresa = await Empresa.findById(id);

        if (!empresa) {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        empresa.nombre = data.nombre || empresa.nombre;
        empresa.email = data.email || empresa.email;
        empresa.nivelImpacto = data.nivelImpacto || empresa.nivelImpacto;
        empresa.añosTrayectoria = data.añosTrayectoria || empresa.añosTrayectoria;
        empresa.categoria = data.categoria || empresa.categoria;

        await empresa.save();

        res.status(200).json({
            success: true,
            msg: 'Empresa actualizada con éxito',
            empresa: empresa
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la empresa',
            error: error.message
        });
    }
};