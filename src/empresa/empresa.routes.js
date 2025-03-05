import { Router } from "express";
import { listEmpresa, createEmpresa, editEmpresa } from "./empresa.controller.js";
import { deleteFileOnError } from "../middleware/delete-file-on-error.js";
import { companyValidator } from "../middleware/validator.js";

const router = Router();

router.get('/', listEmpresa);

router.post(
    '/', 
    companyValidator, 
    deleteFileOnError, 
    createEmpresa
);

router.put(
    '/:id',
    companyValidator,
    deleteFileOnError,
    editEmpresa
);

export default router;
