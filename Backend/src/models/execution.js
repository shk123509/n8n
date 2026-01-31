import mongoose from "mongoose";

const executionSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    output: {
      type: String
    },

    status: {
      type: String,
      enum: ["running", "success", "failed"],
      default: "running"
    },

    logs: [
      {
        nodeId: String,
        message: String,
        time: Date
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Execution", executionSchema);
