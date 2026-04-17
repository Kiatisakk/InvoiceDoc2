import { Router } from "express";
import { handleList } from "../controllers/salesPersons.controller.js";

const router = Router();
router.get("/", handleList);   // แค่ route เดียวพอ

export default router;
