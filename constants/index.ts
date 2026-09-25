export const APP_NAME = "AIMarg";
export const TAGLINE = "Track the Changing World of Work";

export const ROUTES = {
  HOME: "/",
  ONBOARDING: "/onboarding",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  IMPACT: "/impact",
  CAREER: "/career",
  SKILLS: "/skills",
  PROFILE: "/profile",
  ADMIN: "/admin",
} as const;

export const IMPACT_STATUS = {
  NO_IMPACT: "No Impact",
  TASKS_CHANGED: "Tasks Changed",
  WORKLOAD_DECREASED: "Workload Decreased",
  INCOME_DECREASED: "Income Decreased",
  RESPONSIBILITIES_CHANGED: "Responsibilities Changed",
  JOB_AT_RISK: "Job At Risk",
  LOST_JOB: "Lost Job",
  CHANGED_PROFESSION: "Changed Profession",
  AI_HELPING: "AI Helping Productivity",
} as const;

export const EMPLOYMENT_STATUS = {
  EMPLOYED: "Employed",
  SELF_EMPLOYED: "Self Employed",
  FREELANCER: "Freelancer",
  STUDENT: "Student",
  LOOKING_FOR_WORK: "Looking for work",
  UNEMPLOYED: "Unemployed",
  CAREER_TRANSITION: "Career Transition",
} as const;

export const AFFECTED_AREAS = [
  "Coding",
  "Writing",
  "Design",
  "Research",
  "Customer Support",
  "Marketing",
  "Accounting",
  "Legal",
  "Education",
  "Sales",
  "Data Entry",
  "Analysis",
  "Other",
] as const;

export const SKILL_CATEGORIES = {
  TECHNICAL: "Technical",
  SOFT: "Soft Skills",
  DOMAIN: "Domain Knowledge",
  AI: "AI & Automation",
  MANAGEMENT: "Management",
} as const;

export const CAREER_MILESTONES = [
  { id: "assessment", label: "Assessment", description: "Complete AI impact assessment" },
  { id: "skill-gap", label: "Skill Gap", description: "Identify skill gaps" },
  { id: "learning", label: "Learning", description: "Complete recommended courses" },
  { id: "project", label: "Project", description: "Build a portfolio project" },
  { id: "applications", label: "Applications", description: "Apply to roles" },
  { id: "interview", label: "Interview", description: "Attend interviews" },
  { id: "transition", label: "Career Transition", description: "Transition to new role" },
] as const;
