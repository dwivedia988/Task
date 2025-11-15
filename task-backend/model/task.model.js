import mongoose from "mongoose";

const TaskSchema = mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 300 },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed"],
      default: "Pending",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const TaskSchemaModel = mongoose.model("Task", TaskSchema);

export default TaskSchemaModel;
