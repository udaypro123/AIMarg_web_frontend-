"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Stack, TextField, IconButton, InputAdornment } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { AuthContainer } from "@/components/layout/AuthContainer";
import { PrimaryButton, SecondaryButton } from "@/components/common/Buttons";
import { register } from "@/services/auth.service";
import { useToast } from "@/components/common/Toast";

const rowCenterStyle = { flexDirection: "row", justifyContent: "center" } as const;

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
        <PersonIcon fontSize="small" />
      </InputAdornment>
    ),
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
            Create account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start tracking your career changes
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
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              slotProps={{ input: nameSlotProps }}
            />
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
            <PrimaryButton type="submit" fullWidth loading={loading}>
              Create account
            </PrimaryButton>
          </Stack>
        </Box>

        <Stack spacing={0.5} sx={rowCenterStyle}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?
          </Typography>
          <Link href="/auth/login">
            <Typography variant="body2" sx={{ fontWeight: 600, cursor: "pointer" }}>
              Sign in
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </AuthContainer>
  );
}