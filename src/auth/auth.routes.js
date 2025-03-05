import { Router } from "express";
import { registerValidator, loginValidator } from "../middleware/validator.js";
import { login, register } from "./auth.controller.js";
import {deleteFileOnError} from "../middleware/delete-file-on-error.js"

const router = Router();
  
router.post(
    '/login',
    loginValidator,
    deleteFileOnError,
    login
);
 
router.post(
    '/register',
    registerValidator,
    deleteFileOnError,
    register
)
 
export default router;