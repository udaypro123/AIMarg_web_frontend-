"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Stack, TextField, IconButton, InputAdornment, Card, CardContent } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import { PrimaryButton } from "@/components/common/Buttons";
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
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Sign in to your AIMarg account
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
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Link href="/auth/forgot-password" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" color="primary" sx={{ cursor: "pointer", fontWeight: 500 }}>
                    Forgot password?
                  </Typography>
                </Link>
              </Box>
              <PrimaryButton type="submit" fullWidth loading={loading} size="large">
                Sign in
              </PrimaryButton>
            </Stack>
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Do not have an account?{" "}
              <Link href="/auth/register" style={{ color: "primary.main", fontWeight: 600, textDecoration: "none" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}