import { User, Building, Shield, CreditCard } from "lucide-react";

export const emptyGeneralForm = {
  workspaceName: "",
  workspaceUrl: "",
  businessEmail: "",
};

export const emptyProfileForm = {
  name: "",
  email: "",
  jobTitle: "",
  phone: "",
  bio: "",
};

export const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const settingsTabs = [
  { id: "general", label: "General", icon: Building },
  { id: "profile", label: "My Profile", icon: User },
  { id: "security", label: "Security & Audit", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];
