import mongoose from "mongoose";
import { DEFAULT_TASK_TAG_PRESETS, normalizeTaskTags } from "@/lib/taskTags";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["To-Do", "In-Progress", "Review", "Done"],
      default: "To-Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    orgName: {
      type: String,
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    }],
    subTasks: [
      {
        title: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    attachments: [
      {
        fileName: { type: String },
        fileUrl: { type: String },
        fileType: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    blockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    dueDate: {
      type: Date,
    },
    tags: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
      set: (incomingTags) => normalizeTaskTags(incomingTags),
    },
  },
  { timestamps: true },
);

TaskSchema.statics.TAG_PRESETS = DEFAULT_TASK_TAG_PRESETS;

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
