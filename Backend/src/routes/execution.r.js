import express from "express";
import {
  createExecution,
  getAllExecutions,
  getExecutionById,
  completeExecution,
  addExecutionLog,
  deleteExecution
} from "../controllers/execution.c.js";


import {verifyJWT} from "../middleware/auth.middleware.js";


const router = express.Router();

/**
 * 🔐 Protected routes
 */
router.use(verifyJWT);

/**
 * ▶️ Start execution
 */
router.post("/createdexecution", createExecution);

/**
 * 📄 Get all executions
 */
router.get("/getexecution", getAllExecutions);

/**
 * 🔍 Get execution by ID
 */
router.get("/getbyidexecution/:id", getExecutionById);

/**
 * 🧠 Complete execution (Python callback)
 */
router.post("/:id/complete", completeExecution);

/**
 * 🪵 Add execution log
 */
router.post("/addexecution/:id/log", addExecutionLog);

/**
 * ❌ Delete execution
 */
router.delete("/deleteexecution/:id", deleteExecution);

export default router;
