"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Typography, Stack, TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { PrimaryButton } from "@/components/common/Buttons";
import { register, sendSignupOtp, verifySignupOtp } from "@/services/auth.service";
import { getRequestErrorMessage } from "@/services/api";
import { useToast } from "@/components/common/Toast";
import AuthScreen from "@/components/layout/AuthScreen";

export default function RegisterPage() {
  const router = useRouter();
  const { ToastContainer, toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [signupToken, setSignupToken] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "HR">("USER");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setOtp("");
    setOtpSent(false);
    setSignupToken("");
  };

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address first.");
      return;
    }
    setError("");
    setSendingOtp(true);
    try {
      await sendSignupOtp(normalizedEmail);
      setEmail(normalizedEmail);
      setOtpSent(true);
      toast({ title: "Verification code sent to your email.", severity: "success" });
    } catch (err: unknown) {
      setError(getRequestErrorMessage(err, "Could not send verification code."));
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const normalizedOtp = otp.trim();
    if (!/^\d{6}$/.test(normalizedOtp)) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }
    setError("");
    setVerifyingOtp(true);
    try {
      const response = await verifySignupOtp(email.trim().toLowerCase(), normalizedOtp);
      const token = response.data?.signupToken;
      if (!token) throw new Error("Email verification could not be completed. Please try again.");
      setSignupToken(token);
      toast({ title: "Email verified. Complete your account details.", severity: "success" });
    } catch (err: unknown) {
      setError(getRequestErrorMessage(err, "Could not verify the code."));
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupToken) {
      setError("Verify your email before creating your account.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await register({ name, email: email.trim().toLowerCase(), password, signupToken, role });
      if (res.success) {
        toast({ title: "Account created!", severity: "success" });
        router.push("/onboarding");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err: unknown) {
      setError(getRequestErrorMessage(err, "Registration failed"));
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
                label="Email address"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(event) => handleEmailChange(event.target.value)}
                required
                fullWidth
                autoComplete="email"
                disabled={Boolean(signupToken)}
                sx={{
                  "& .MuiInputBase-input": { color: "#000" },
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "#000",
                    WebkitTextFillColor: "#000",
                    opacity: 1,
                  },
                }}
                slotProps={{ input: emailSlotProps, inputLabel: { shrink: true } }}
              />
              {!signupToken && (
                <>
                  <Button type="button" variant="outlined" fullWidth onClick={() => void handleSendOtp()} disabled={sendingOtp || verifyingOtp}>
                    {sendingOtp ? "Sending code..." : otpSent ? "Resend verification code" : "Send verification code"}
                  </Button>
                  {otpSent && (
                    <Stack spacing={1}>
                      <TextField
                        label="Email verification code"
                        placeholder="Enter the 6-digit code"
                        value={otp}
                        onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                        required
                        fullWidth
                        autoComplete="one-time-code"
                        slotProps={{ inputLabel: { shrink: true }, htmlInput: { inputMode: "numeric", maxLength: 6, pattern: "[0-9]{6}" } }}
                        helperText="Enter the 6-digit code sent to your email."
                      />
                      <Button type="button" variant="contained" fullWidth onClick={() => void handleVerifyOtp()} disabled={verifyingOtp || otp.length !== 6}>
                        {verifyingOtp ? "Verifying..." : "Verify email"}
                      </Button>
                    </Stack>
                  )}
                </>
              )}
              {signupToken && (
                <>
                  <Alert severity="success">Email verified. Your code has been accepted.</Alert>
                  <TextField
                    label="Full name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    fullWidth
                    autoComplete="name"
                    slotProps={{ input: nameSlotProps, inputLabel: { shrink: true } }}
                  />
                  <TextField
                    select
                    label="Account type"
                    value={role}
                    onChange={(event) => setRole(event.target.value === "HR" ? "HR" : "USER")}
                    required
                    fullWidth
                    helperText="Choose User for a personal account or HR for recruiting features."
                  >
                    <MenuItem value="USER">User</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                  </TextField>
                  <TextField
                    label="Password"
                    placeholder="Create a password (8+ characters)"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    fullWidth
                    slotProps={{ input: passwordSlotProps, inputLabel: { shrink: true }, htmlInput: { minLength: 8, autoComplete: "new-password" } }}
                    helperText="Use at least 8 characters."
                  />
                  <PrimaryButton type="submit" fullWidth loading={loading} size="large" className="auth-submit-button">
                    Create account
                  </PrimaryButton>
                </>
              )}
            </Stack>
          </Box>
          {/* <Divider>or sign up with</Divider>
          <GoogleSignInButton
            disabled={loading || googleLoading}
            mode="signup"
            onCredential={handleGoogleCredential}
            onError={setError}
          /> */}
          <Box className="auth-switch">
            <Typography variant="body2">Already have an account?</Typography>
            <Link href="/auth/login">Sign in <span aria-hidden="true">&#8594;</span></Link>
          </Box>
        </Stack>
      </AuthScreen>
    </>
  );
}