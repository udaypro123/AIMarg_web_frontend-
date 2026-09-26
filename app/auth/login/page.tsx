"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Typography, Stack, TextField, IconButton, InputAdornment } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import { PrimaryButton } from "@/components/common/Buttons";
import { login } from "@/services/auth.service";
import { useToast } from "@/components/common/Toast";
import AuthScreen from "@/components/layout/AuthScreen";

export default function LoginPage() {
  const router = useRouter();
  const { ToastContainer, toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast({ title: "Welcome back!", severity: "success" });
        router.push("/");
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const emailSlotProps = {
    startAdornment: (
      <InputAdornment position="start">
        <EmailIcon fontSize="small" color="disabled" />
      </InputAdornment>
    ),
  };

  const passwordSlotProps = {
    startAdornment: (
      <InputAdornment position="start">
        <LockIcon fontSize="small" color="disabled" />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small" color="inherit" aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <>
      <ToastContainer />
      <AuthScreen eyebrow="WELCOME BACK" title="Sign in" subtitle="Pick up where you left off.">
        <Stack spacing={2.1} className="auth-form-stack">
          {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            <Stack spacing={1.8}>
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
                autoFocus
                slotProps={{ input: emailSlotProps, htmlInput: { autoComplete: "email" } }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                fullWidth
                slotProps={{ input: passwordSlotProps, htmlInput: { autoComplete: "current-password" } }}
              />
              <Box className="auth-form-options">
                <span>Secure sign in</span>
                <Link href="/auth/forgot-password">Forgot password?</Link>
              </Box>
              <PrimaryButton type="submit" fullWidth loading={loading} size="large" className="auth-submit-button">
                Sign in
              </PrimaryButton>
            </Stack>
          </Box>
          <Box className="auth-switch">
            <Typography variant="body2">New to AIMarg?</Typography>
            <Link href="/auth/register">Create an account <span aria-hidden="true">&#8594;</span></Link>
          </Box>
        </Stack>
      </AuthScreen>
    </>
  );
}