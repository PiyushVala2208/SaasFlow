import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  orgName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Manager", "Employee"],
    default: "Employee",
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
  },
});

export default mongoose.models.Invitation ||
  mongoose.model("Invitation", InvitationSchema);
