"use client";

import { useEffect, useState } from "react";
import { Alert, AlertTitle, Button, IconButton, type AlertColor } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";

type Toast = {
  id: number;
  title: string;
  message?: string;
  severity: AlertColor;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const addToast = (toast: Omit<Toast, "id">) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    // Expose globally for simple usage
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, (toast: Omit<Toast, "id">) => void>).addToast = addToast;
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as unknown as Record<string, unknown>).addToast;
      }
    };
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const ToastContainer = () => (
    <Stack spacing={1.5} sx={{ position: "fixed", top: 16, right: 16, zIndex: 9999, maxWidth: 420, width: "100%" }}>
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          severity={toast.severity}
          sx={{ boxShadow: 4 }}
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={() => dismiss(toast.id)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
          {toast.message}
        </Alert>
      ))}
    </Stack>
  );

  const toastFn = (toast: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return { ToastContainer, toast: toastFn };
}