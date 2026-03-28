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
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
