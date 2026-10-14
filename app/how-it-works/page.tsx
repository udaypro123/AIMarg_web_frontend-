import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material";

const steps = [
  {
    number: "01",
    title: "Set up your profile",
    description:
      "Create an account, verify your email, and tell AIMarg about your work, career interests, and skills. You choose what to share.",
  },
  {
    number: "02",
    title: "Explore how work is changing",
    description:
      "Record the ways AI is affecting your work and review career insights that help you understand possible changes and opportunities.",
  },
  {
    number: "03",
    title: "Plan your next steps",
    description:
      "Use your career journey and skills view to identify areas to explore, keep track of progress, and revisit your plan as things change.",
  },
];

export default function HowItWorksPage() {
  return (
    <Box component="main" className="how-it-works-page">
      <Box className="how-it-works-content">
        <Box component="nav" className="how-it-works-nav" aria-label="Main navigation">
          <Link className="how-it-works-brand" href="/auth/login">
            <span className="how-it-works-brand-mark" aria-hidden="true">A</span>
            <span>AIMarg</span>
          </Link>
          <Link className="how-it-works-nav-link" href="/auth/login">Back to sign in</Link>
        </Box>

        <Box className="how-it-works-intro">
          <Typography className="how-it-works-eyebrow">A CLEARER VIEW OF WHAT&apos;S NEXT</Typography>
          <Typography component="h1" className="how-it-works-title">
            Your career. With more clarity.
          </Typography>
          <Typography className="how-it-works-subtitle">
            AIMarg helps you understand how AI may affect your work and gives you a place to reflect on the skills and career steps you want to focus on.
          </Typography>
        </Box>

        <Box className="how-it-works-steps">
          {steps.map((step) => (
            <Paper key={step.number} className="how-it-works-step" elevation={0}>
              <span className="how-it-works-step-number">{step.number}</span>
              <Typography component="h2" className="how-it-works-step-title">{step.title}</Typography>
              <Typography className="how-it-works-step-copy">{step.description}</Typography>
            </Paper>
          ))}
        </Box>

        <Typography className="how-it-works-note">
          AIMarg is a planning and reflection tool. Career insights are for exploration and are not a guarantee of future job outcomes.
        </Typography>

        <Box className="how-it-works-cta">
          <Link href="/auth/register" className="how-it-works-primary">
            Create your account
          </Link>
          <Link className="how-it-works-secondary" href="/auth/login">
            I already have an account
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
