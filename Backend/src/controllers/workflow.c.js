import Workflow from "../models/workflow.js";

/**
 * ➕ Create Workflow
 */
export const createWorkflow = async (req, res) => {
  const { name, nodes = [], edges = [] } = req.body;
  const userId = req.user?._id;

  if (!name) {
    return res.status(400).json({ message: "Workflow name required" });
  }

  const workflow = await Workflow.create({
    userId,
    name,
    nodes,
    edges,
    isActive: false
  });

  res.status(201).json(workflow);
};

/**
 * 📄 Get all workflows
 */
export const getAllWorkflows = async (req, res) => {
  const workflows = await Workflow.find(
    { userId: req.user?._id },
    { nodes: 0, edges: 0 }
  ).sort({ updatedAt: -1 });

  res.json(workflows);
};

/**
 * 🔍 Get workflow by ID
 */
export const getWorkflowById = async (req, res) => {
  const workflow = await Workflow.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!workflow) {
    return res.status(404).json({ message: "Workflow not found" });
  }

  res.json(workflow);
};

/**
 * ✏️ Update workflow
 */
export const updateWorkflow = async (req, res) => {
  const { name, nodes, edges } = req.body;

  const workflow = await Workflow.findOneAndUpdate(
    { _id: req.params.id, userId: req.user?._id },
    { name, nodes, edges },
    { new: true }
  );

  if (!workflow) {
    return res.status(404).json({ message: "Workflow not found" });
  }

  res.json(workflow);
};

/**
 * 🔁 Toggle workflow active/inactive
 */
export const toggleWorkflow = async (req, res) => {
  const workflow = await Workflow.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!workflow) {
    return res.status(404).json({ message: "Workflow not found" });
  }

  workflow.isActive = !workflow.isActive;
  await workflow.save();

  res.json({
    workflowId: workflow._id,
    isActive: workflow.isActive
  });
};

/**
 * ❌ Delete workflow
 */
export const deleteWorkflow = async (req, res) => {
  const workflow = await Workflow.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!workflow) {
    return res.status(404).json({ message: "Workflow not found" });
  }

  res.json({ message: "Workflow deleted successfully" });
};
