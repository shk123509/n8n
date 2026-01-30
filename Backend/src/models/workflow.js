import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    nodes: {
      type: Array,     // React Flow nodes[]
      required: true
    },

    edges: {
      type: Array,     // React Flow edges[]
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Workflow", workflowSchema);
