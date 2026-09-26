"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Typography, Stack, TextField, IconButton, InputAdornment } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { PrimaryButton } from "@/components/common/Buttons";
import { register } from "@/services/auth.service";
import { useToast } from "@/components/common/Toast";
import AuthScreen from "@/components/layout/AuthScreen";

export default function RegisterPage() {
  const router = useRouter();
  const { ToastContainer, toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await register({ name, email, password });
      if (res.success) {
        toast({ title: "Account created!", severity: "success" });
        router.push("/onboarding");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const nameSlotProps = {
    startAdornment: (
      <InputAdornment position="start">
        <PersonIcon fontSize="small" color="disabled" />
      </InputAdornment>
    ),
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
      <AuthScreen eyebrow="START HERE" title="Create your account" subtitle="Build a clearer picture of your work and what comes next.">
        <Stack spacing={2.1} className="auth-form-stack">
          {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            <Stack spacing={1.8}>
              <TextField
                label="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                fullWidth
                autoComplete="name"
                slotProps={{ input: nameSlotProps }}
              />
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
                autoComplete="email"
                slotProps={{ input: emailSlotProps }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                fullWidth
                slotProps={{ input: passwordSlotProps, htmlInput: { minLength: 8, autoComplete: "new-password" } }}
                helperText="Use at least 8 characters."
              />
              <PrimaryButton type="submit" fullWidth loading={loading} size="large" className="auth-submit-button">
                Create account
              </PrimaryButton>
            </Stack>
          </Box>
          <Box className="auth-switch">
            <Typography variant="body2">Already have an account?</Typography>
            <Link href="/auth/login">Sign in <span aria-hidden="true">&#8594;</span></Link>
          </Box>
        </Stack>
      </AuthScreen>
    </>
  );
}