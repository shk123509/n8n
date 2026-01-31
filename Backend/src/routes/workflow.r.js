import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createWorkflow,
  getAllWorkflows,
  getWorkflowById,
  updateWorkflow,
  toggleWorkflow,
  deleteWorkflow
} from "../controllers/workflow.c.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", createWorkflow);
router.get("/", getAllWorkflows);
router.get("/:id", getWorkflowById);
router.put("/:id", updateWorkflow);
router.patch("/:id/toggle", toggleWorkflow);
router.delete("/:id", deleteWorkflow);

export default router;
