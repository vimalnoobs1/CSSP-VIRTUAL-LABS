export interface UserProgress {
  username: string;
  email: string;
  joinDate: string;
  completedLabs: number[]; // Array of lab IDs (1-16)
  completedTasks: string[]; // Array of task IDs
  completedHackathonDays: number[]; // Array of day numbers (1-4)
  xp: number;
}

export type RankName = 'Beginner' | 'Explorer' | 'Analyst' | 'Researcher' | 'Practitioner' | 'Cyber Specialist';

export interface RankInfo {
  name: RankName;
  minXp: number;
  maxXp: number;
  color: string;
  bgClass: string;
  borderClass: string;
}

export interface Lab {
  id: number;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  objective: string;
  instructions: string[];
  hints: string[];
  explanation: string;
  xpReward: number;
  flag: string;
  solutionSteps?: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'Linux' | 'Networking' | 'Web Web Security' | 'Recon' | 'Response';
  xp: number;
  description: string;
}

export interface HackathonDay {
  day: number;
  title: string;
  objective: string;
  scenario: string;
  steps: string[];
  flag: string;
  xpReward: number;
  hint: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
  status: 'online' | 'offline' | 'idle';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  unlockedAtXp?: number;
  unlockedAtLabs?: number;
  unlockedAtTasks?: number;
  unlockedAtHackathon?: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'lab' | 'task' | 'hackathon' | 'badge' | 'login';
  message: string;
  time: string;
  xpAwarded?: number;
}

export interface CourseSession {
  id: number;
  title: string;
  duration: string;
  date: string;
  type: 'Theory' | 'Practical' | 'Review';
}
