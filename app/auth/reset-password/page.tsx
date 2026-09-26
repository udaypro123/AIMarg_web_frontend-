"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import Link from "next/link";
import AuthScreen from "@/components/layout/AuthScreen";
import { PrimaryButton } from "@/components/common/Buttons";
import { resetPassword } from "@/services/auth.service";
import { useToast } from "@/components/common/Toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { ToastContainer, toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const token = new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    window.history.replaceState(null, "", window.location.pathname);

    setLoading(true);
    try {
      await resetPassword(token, password);
      toast({ title: "Password updated", severity: "success" });
      router.push("/auth/login");
    } catch {
      setError("This reset link is invalid or has expired. Request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <AuthScreen eyebrow="ACCOUNT RECOVERY" title="Choose a new password" subtitle="Make it at least 8 characters and different from your old one.">
        <Stack spacing={2.1} className="auth-form-stack">
          {error && <Alert severity="error" role="alert">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            <Stack spacing={1.8}>
              <TextField
                label="New password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                slotProps={{ htmlInput: { minLength: 8, autoComplete: "new-password" } }}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                slotProps={{ htmlInput: { minLength: 8, autoComplete: "new-password" } }}
                required
                fullWidth
              />
              <PrimaryButton type="submit" fullWidth loading={loading} size="large" className="auth-submit-button">
                Update password
              </PrimaryButton>
            </Stack>
          </Box>
          <Box className="auth-switch">
            <Button component={Link} href="/auth/login" variant="text">Back to sign in</Button>
          </Box>
        </Stack>
      </AuthScreen>
    </>
  );
}
