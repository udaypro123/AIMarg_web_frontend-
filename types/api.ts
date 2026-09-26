export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken?: string;
    user: User;
  };
  message?: string;
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  country?: string;
  profession?: string;
  industry?: string;
  experience?: string;
  employmentStatus?: string;
  skills?: string[];
  careerGoal?: string;
  aiUsage?: string;
  aiImpactStatus?: string;
  mobile?: string;
  currentRole?: string;
  previousRole?: string;
  previousCompany?: string;
  company?: string;
  jobDescription?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resume?: string;
  avatar?: string;
  roles?: string[];
  isBlocked?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  todayUsers: number;
  recentUsers: Array<Pick<User, "_id" | "name" | "email" | "roles" | "createdAt">>;
}

export interface RecentActivity {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInteractionSummary {
  targetUserId: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface UserComment {
  _id: string;
  targetUserId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImpactReport {
  _id: string;
  employmentStatus: string;
  impactStatus: string;
  impactAreas: string[];
  incomeImpact: string;
  description?: string;
  createdAt: string;
}

export interface CareerMilestone {
  key: string;
  label: string;
  completed: boolean;
  completedAt?: string;
}

export interface CareerJourney {
  _id: string;
  milestones: CareerMilestone[];
  currentMilestone: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  description?: string;
}

export interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    currentRole?: string;
    company?: string;
    skills?: string[];
  };
  title: string;
  content: string;
  category?: string;
  likes: string[];
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface AppNotification {
  _id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}