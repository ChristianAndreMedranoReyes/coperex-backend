import XLSX from 'xlsx';
import Empresa from '../empresa/empresa.model.js';
import fs from 'fs'; 

export const generarReporteExcel = async (req, res) => {
    try {
        const empresas = await Empresa.find({ estado: true });

        if (empresas.length === 0) {
            return res.status(400).json({ msg: 'No hay empresas para generar el reporte' });
        }

        const data = empresas.map((empresa) => ({
            Nombre: empresa.nombre,
            Email: empresa.email,
            NivelImpacto: empresa.nivelImpacto,
            AñosTrayectoria: empresa.añosTrayectoria,
            Categoria: empresa.categoria,
            Estado: empresa.status ? 'Activo' : 'Inactivo',
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Empresas');

        const fileName = `Reporte_Empresas_${new Date().toISOString()}.xlsx`;

        XLSX.writeFile(wb, fileName);

        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error generando el reporte',
            error: error.message,
        });
    }
};
