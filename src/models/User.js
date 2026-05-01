import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Work email is required"],
      unique: true,
      lowercase: true,
    },
    orgName: {
      type: String,
      required: [true, "Organization name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "Manager", "Employee"],
      default: "Employee",
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'inactive', 'suspended'],
      default: "active",
    },
    image: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 400,
    },
    workspaceName: {
      type: String,
      default: "",
      trim: true,
    },
    workspaceUrl: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    businessEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
