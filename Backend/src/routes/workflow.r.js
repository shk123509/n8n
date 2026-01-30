import express from "express";
import {verifyJWT} from "../middleware/auth.middleware.js";

import {
 createWorkflow,
  getAllWorkflows,
  getWorkflowById,
  updateWorkflow,
  toggleWorkflow,
  deleteWorkflow
} from "../controllers/workflow.c.js"

const router = express.Router();

router.post("/createdflow", verifyJWT, createWorkflow);

router.get("/get", verifyJWT, getAllWorkflows);

router.get("/workflow/:id", verifyJWT, getWorkflowById);


router.put("/workflow/:id", verifyJWT, updateWorkflow);


router.patch("/workflow/:id/toggle", verifyJWT, toggleWorkflow);


router.delete("/workflow/:id", verifyJWT, deleteWorkflow);


export default router;