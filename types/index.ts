import { type ReactNode } from "react";

export interface AppShellProps {
  children: ReactNode;
  title?: string;
  hideHeader?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  disablePadding?: boolean;
  transparentHeader?: boolean;
}

export interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  active?: boolean;
  disabled?: boolean;
}

export interface Step {
  label: string;
  description?: string;
  completed?: boolean;
  active?: boolean;
}

export interface Option {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  helperText?: string;
  icon?: ReactNode;
  progress?: number;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  onClick?: () => void;
}

export interface TimelineItemProps {
  title: string;
  description?: string;
  status: "completed" | "active" | "pending";
  date?: string;
  icon?: ReactNode;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  select?: boolean;
  options?: Option[];
  multiline?: boolean;
  rows?: number;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export interface AuthFormProps {
  title: string;
  subtitle?: string;
  fields: FormFieldProps[];
  submitLabel: string;
  loading?: boolean;
  error?: string;
  footer?: ReactNode;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
}

export interface AssessmentQuestionProps {
  question: string;
  description?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
}

export interface ImpactSummaryProps {
  impactStatus: string;
  employmentStatus: string;
  affectedAreas: string[];
  incomeImpact?: string;
  description?: string;
}

export interface SkillGapProps {
  currentSkills: Array<{ name: string; progress: number }>;
  requiredSkills: Array<{ name: string; target: number }>;
}

export interface CareerJourneyProps {
  milestones: Array<{
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    date?: string;
  }>;
  onComplete?: (id: string) => void;
}
