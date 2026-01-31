import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createExecution,
  getAllExecutions,
  getExecutionById,
  deleteExecution
} from "../controllers/execution.c.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", createExecution);
router.get("/", getAllExecutions);
router.get("/:id", getExecutionById);
router.delete("/:id", deleteExecution);

export default router;
