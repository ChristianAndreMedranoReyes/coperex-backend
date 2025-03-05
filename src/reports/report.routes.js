import { Router } from 'express';
import { createEmpresa, listEmpresa, editEmpresa } from '../empresa/empresa.controller.js';
import { generarReporteExcel } from './report.controller.js';

const router = Router();

router.post('/', createEmpresa);

router.get('/', listEmpresa);

router.put('/:id', editEmpresa);

router.get('/reporte', generarReporteExcel);

export default router;
