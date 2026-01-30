import Execution from "../models/execution.js";
import Workflow from "../models/workflow.js";

/**
 * ▶️ Start Execution
 */
export const createExecution = async (req, res) => {
  const { workflowId, input } = req.body;
  const userId = req.user?._id;

  const workflow = await Workflow.findOne({
    _id: workflowId,
    userId,
    isActive: true
  });

  if (!workflow) {
    return res.status(404).json({ message: "Active workflow not found" });
  }

  const execution = await Execution.create({
    workflowId,
    userId,
    input,
    status: "running",
    logs: []
  });

  res.status(201).json(execution);
};

/**
 * 📄 Get all executions
 */
export const getAllExecutions = async (req, res) => {
  const executions = await Execution.find({ userId: req.user?._id })
    .select("-logs")
    .sort({ createdAt: -1 });

  res.json(executions);
};

/**
 * 🔍 Get execution details
 */
export const getExecutionById = async (req, res) => {
  const execution = await Execution.findOne({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!execution) {
    return res.status(404).json({ message: "Execution not found" });
  }

  res.json(execution);
};

/**
 * 🧠 Update execution result (Python callback)
 */
export const completeExecution = async (req, res) => {
  const { output, status, logs = [] } = req.body;

  const execution = await Execution.findById(req.params.id);
  if (!execution) {
    return res.status(404).json({ message: "Execution not found" });
  }

  execution.output = output;
  execution.status = status || "success";
  execution.logs.push(...logs);

  await execution.save();

  res.json({ message: "Execution completed" });
};

/**
 * 🪵 Add execution log
 */
export const addExecutionLog = async (req, res) => {
  const { nodeId, message } = req.body;

  const execution = await Execution.findById(req.params.id);
  if (!execution) {
    return res.status(404).json({ message: "Execution not found" });
  }

  execution.logs.push({
    nodeId,
    message,
    time: new Date()
  });

  await execution.save();
  res.json({ message: "Log added" });
};

/**
 * ❌ Delete execution
 */
export const deleteExecution = async (req, res) => {
  const execution = await Execution.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?._id
  });

  if (!execution) {
    return res.status(404).json({ message: "Execution not found" });
  }

  res.json({ message: "Execution deleted" });
};
