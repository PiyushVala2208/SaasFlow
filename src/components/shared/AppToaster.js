"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4200,
        style: {
          background: "#0b0b0b",
          color: "#e5e5e5",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "12px",
          fontSize: "13px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#0b0b0b",
          },
        },
        error: {
          iconTheme: {
            primary: "#f43f5e",
            secondary: "#0b0b0b",
          },
        },
      }}
    />
  );
}
