import Workflow from "../models/workflow.js";

/**
 * ➕ Create Workflow
 */
export const createWorkflow = async (req, res) => {
  try {
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
      isActive: true
    });

    res.status(201).json(workflow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📄 Get all workflows
 */
export const getAllWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find(
      { userId: req.user?._id },
      { nodes: 0, edges: 0 } // Nodes/Edges list view mein nahi chahiye
    ).sort({ updatedAt: -1 });

    res.json(workflows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔍 Get workflow by ID
 */
export const getWorkflowById = async (req, res) => {
  try {
    const workflow = await Workflow.findOne({
      _id: req.params.id,
      userId: req.user?._id
    });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.json(workflow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✏️ Update workflow (Deployment ke time use hota hai)
 */
export const updateWorkflow = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔁 Toggle workflow active/inactive
 */
export const toggleWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findOne({
      _id: req.params.id,
      userId: req.user?._id
    });

    if (!workflow) return res.status(404).json({ message: "Not found" });

    workflow.isActive = !workflow.isActive;
    await workflow.save();

    res.json({ workflowId: workflow._id, isActive: workflow.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ❌ Delete workflow
 */
export const deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id
    });

    if (!workflow) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Workflow deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};