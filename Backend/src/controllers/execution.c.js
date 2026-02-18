import axios from "axios";
import Execution from "../models/execution.js";
import Workflow from "../models/workflow.js";

/**
 * ▶️ Start execution
 */
export const createExecution = async (req, res) => {
  try {
    // 🔑 req.body se user_api_key nikaalna zaroori hai
    const { workflowId, input, user_api_key } = req.body;
    const userId = req.user._id;

    const workflow = await Workflow.findOne({
      _id: workflowId,
      userId,
      isActive: true
    });

    if (!workflow) {
      return res.status(404).json({ message: "Active workflow not found" });
    }

    // create execution record
    const execution = await Execution.create({
      workflowId,
      userId,
      input,
      status: "running",
      logs: [{ message: "Execution started", time: new Date() }]
    });

    // 🔥 CALL PYTHON ENGINE (Sahi Data bhej rahe hain ab)
    const pyRes = await axios.post("http://127.0.0.1:8000/execute", {
      nodes: workflow.nodes,
      edges: workflow.edges,
      query: input.query || input,
      user_api_key: user_api_key // 🚀 Ye Python ke QueryRequest model mein jayega
    });

    // Python se aane wala data save karo
    execution.output = {
      result: pyRes.data.result,
      route: pyRes.data.route
    };
    execution.status = "success";
    execution.logs.push({
      message: "Execution finished",
      time: new Date()
    });

    await execution.save();

    res.status(201).json(execution);
  } catch (err) {
    console.error("Execution Controller Error:", err.message);
    if (err.response) {
      console.error("Python Engine Error Data:", err.response.data);
    }
    res.status(500).json({ message: "Execution failed", error: err.message });
  }
};

/**
 * 📄 Get all executions
 */
export const getAllExecutions = async (req, res) => {
  try {
    const executions = await Execution.find({ userId: req.user._id })
      .select("-logs")
      .sort({ createdAt: -1 });
    res.json(executions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔍 Get execution by id
 */
export const getExecutionById = async (req, res) => {
  try {
    const execution = await Execution.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!execution) return res.status(404).json({ message: "Not found" });
    res.json(execution);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ❌ Delete execution
 */
export const deleteExecution = async (req, res) => {
  try {
    await Execution.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    res.json({ message: "Execution deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};