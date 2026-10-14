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
          <Box className="auth-visual-shapes" aria-hidden="true">
            <span className="auth-shape auth-shape-large" />
            <span className="auth-shape auth-shape-medium" />
            <span className="auth-shape auth-shape-small" />
          </Box>
          <Box className="auth-visual-copy">
            <Typography className="auth-visual-eyebrow">WELCOME TO AIMARG</Typography>
            <Typography component="h1">Your next move<br />starts here.</Typography>
            <Typography className="auth-visual-description">
              See how work is changing and find a clearer path forward.
            </Typography>
          </Box>
          <Typography className="auth-visual-footer">AIMarg <span /> Track the changing world of work</Typography>
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
