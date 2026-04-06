import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "On Hold", "Archived"],
      default: "Active",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    orgName: {
      type: String,
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["Owner", "Admin", "Editor", "Viewer"],
          default: "Editor",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deadline: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ProjectSchema.index({ owner: 1, orgName: 1 });
ProjectSchema.index({ "members.user": 1 });

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
