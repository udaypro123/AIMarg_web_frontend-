"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Stack, TextField, IconButton, InputAdornment, Card, CardContent } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { PrimaryButton } from "@/components/common/Buttons";
import { register } from "@/services/auth.service";
import { useToast } from "@/components/common/Toast";

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
        <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small" color="inherit">
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 200px)", py: 4, width: "100%" }}>
      <ToastContainer />
      <Card sx={{ width: "100%", maxWidth: 420, boxShadow: "0px 4px 20px rgba(0,0,0,0.08)", border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
              Create account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Start tracking your career changes
            </Typography>
          </Box>

          {error && (
            <Typography variant="body2" color="error.main" sx={{ display: "block", mb: 2, textAlign: "center" }}>
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 12 } }}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                slotProps={{ input: emailSlotProps }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 12 } }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                slotProps={{ input: passwordSlotProps }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 12 } }}
              />
              <PrimaryButton type="submit" fullWidth loading={loading} size="large">
                Create account
              </PrimaryButton>
            </Stack>
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link href="/auth/login" style={{ color: "primary.main", fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}