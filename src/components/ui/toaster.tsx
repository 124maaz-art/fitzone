"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#131317",
          color: "#fafafa",
          border: "1px solid #27272a",
          borderRadius: "12px",
        },
        success: { iconTheme: { primary: "#22c55e", secondary: "#0a0a0a" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#0a0a0a" } },
      }}
    />
  );
}
