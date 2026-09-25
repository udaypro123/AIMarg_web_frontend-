"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Stack, TextField, IconButton, InputAdornment } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import { AuthContainer } from "@/components/layout/AuthContainer";
import { PrimaryButton, SecondaryButton } from "@/components/common/Buttons";
import { login } from "@/services/auth.service";
import { useToast } from "@/components/common/Toast";

const rowCenterStyle = { flexDirection: "row", justifyContent: "center" } as const;

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
        <EmailIcon fontSize="small" />
      </InputAdornment>
    ),
  };

  const passwordSlotProps = {
    startAdornment: (
      <InputAdornment position="start">
        <LockIcon fontSize="small" />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <AuthContainer>
      <ToastContainer />
      <Stack spacing={2.5}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your AIMarg account
          </Typography>
        </Box>

        {error && (
          <Typography variant="body2" color="error.main">
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              slotProps={{ input: emailSlotProps }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              slotProps={{ input: passwordSlotProps }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Link href="/auth/forgot-password">
                <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
                  Forgot password?
                </Typography>
              </Link>
            </Box>
            <PrimaryButton type="submit" fullWidth loading={loading}>
              Sign in
            </PrimaryButton>
          </Stack>
        </Box>

        <Stack spacing={0.5} sx={rowCenterStyle}>
          <Typography variant="body2" color="text.secondary">
            Do not have an account?
          </Typography>
          <Link href="/auth/register">
            <Typography variant="body2" sx={{ fontWeight: 600, cursor: "pointer" }}>
              Sign up
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </AuthContainer>
  );
}