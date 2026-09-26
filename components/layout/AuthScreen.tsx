import Image from "next/image";
import { Box, Typography } from "@mui/material";

export default function AuthScreen({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Box className="auth-stage">
      <Box className="auth-layout">
        <Box component="section" className="auth-visual" aria-label="AIMarg career outlook">
          <Box className="auth-brand">
            <span className="auth-brand-mark">A</span>
            <span>AIMarg</span>
          </Box>
          <Box className="auth-visual-art">
            <Image
              src="/aimarg.gif"
              alt="Animated AIMarg career change illustration"
              fill
              loading="eager"
              unoptimized
              sizes="(max-width: 800px) 35vw, 40vw"
              className="auth-gif"
            />
          </Box>
          <Box className="auth-visual-copy">
            <Typography className="auth-visual-eyebrow">A CLEARER VIEW OF WHAT&apos;S NEXT</Typography>
            <Typography component="h1">Work is changing.<br />Your path is yours.</Typography>
            <Typography className="auth-visual-description">
              Understand how AI is shifting your work, then build a career that moves with you.
            </Typography>
          </Box>
          <Typography className="auth-visual-footer">AIMarg <span /> Track the Changing World of Work</Typography>
        </Box>

        <Box component="section" className="auth-panel">
          <Box className="auth-panel-brand">
            <span className="auth-brand-mark">A</span>
            <span>AIMarg</span>
          </Box>
          <Box className="auth-form-content">
            <Typography className="auth-form-eyebrow">{eyebrow}</Typography>
            <Typography component="h2" className="auth-form-title">{title}</Typography>
            <Typography className="auth-form-subtitle">{subtitle}</Typography>
            {children}
          </Box>
          <Typography className="auth-panel-footer">Your career details are private to your account.</Typography>
        </Box>
      </Box>
    </Box>
  );
}
