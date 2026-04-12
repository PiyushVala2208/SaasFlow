import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE_TASK",
        "UPDATE_STATUS",
        "DELETE_TASK",
        "PROJECT_CREATED",
        "MEMBER_ADD",
        "UPDATE_TASK", 
      ],
    },
    details: {
      taskTitle: String,
      oldStatus: String,
      newStatus: String,
      updatedFields: [String],
    },
    orgName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);
