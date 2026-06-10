import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Info, 
  AlertCircle, 
  X 
} from 'lucide-react';
import { 
  UserProgress, 
  RankInfo, 
  AchievementBadge, 
  RecentActivity 
} from './types';
import { LABS_DATA } from './data/labs';
import { TASKS_DATA } from './data/tasks';

import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LabsView from './components/LabsView';
import TasksView from './components/TasksView';
import HackathonView from './components/HackathonView';
import CertificateView from './components/CertificateView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import KaliOSView from './components/KaliOSView';

const RANKS: RankInfo[] = [
  { name: 'Beginner', minXp: 0, maxXp: 299, color: '#3b82f6', bgClass: 'bg-brand-blue/10', borderClass: 'border-brand-blue/20' },
  { name: 'Explorer', minXp: 300, maxXp: 599, color: '#06b6d4', bgClass: 'bg-brand-cyan/10', borderClass: 'border-brand-cyan/20' },
  { name: 'Analyst', minXp: 600, maxXp: 1199, color: '#10b981', bgClass: 'bg-brand-emerald/10', borderClass: 'border-brand-emerald/20' },
  { name: 'Researcher', minXp: 1200, maxXp: 1999, color: '#8b5cf6', bgClass: 'bg-brand-violet/10', borderClass: 'border-brand-violet/20' },
  { name: 'Practitioner', minXp: 2000, maxXp: 2999, color: '#ec4899', bgClass: 'bg-pink-500/10', borderClass: 'border-pink-500/20' },
  { name: 'Cyber Specialist', minXp: 3000, maxXp: 999999, color: '#f43f5e', bgClass: 'bg-brand-rose/10', borderClass: 'border-brand-rose/20' }
];

const BADGES: AchievementBadge[] = [
  { id: 'badge_1', title: 'First Blood', description: 'Gain authentication on your very first practical laboratory sandbox flag.', icon: 'terminal' },
  { id: 'badge_2', title: 'Security Analyst', description: 'Unchain Analyst status levels by racking up over 600 program credentials XP points.', icon: 'shield' },
  { id: 'badge_3', title: 'Practical Pioneer', description: 'Log validation checkmarks on at least 3 homework exercises on your personal syllabus.', icon: 'zap' },
  { id: 'badge_4', title: 'Incident Responder', description: 'Secure at least 2 days of high-stress incident hackathon triage.', icon: 'trophy' },
  { id: 'badge_5', title: 'Master Graduate', description: 'Solve all 16 simulated sandboxes to lock in completion statistics.', icon: 'award' },
  { id: 'badge_6', title: 'Task Finisher', description: 'Complete all 10 supplemental homework exercises with 100% completion.', icon: 'compass' }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // App-level Toast State
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Core User state
  const [userProgress, setUserProgress] = useState<UserProgress>({
    username: '',
    email: '',
    joinDate: 'June 09, 2026',
    completedLabs: [],
    completedTasks: [],
    completedHackathonDays: [],
    xp: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  // Toast notifier trigger
  const triggerToast = (msg: string, type: 'success' | 'info' | 'error') => {
    setToast({ msg, type });
  };

  // Close toast trigger
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load state from localStorage on init
  useEffect(() => {
    let cachedUser = localStorage.getItem('ev_cyber_academy_user');
    let cachedProgress = localStorage.getItem('ev_cyber_academy_progress');
    let cachedActivities = localStorage.getItem('ev_cyber_academy_activities');

    // Force clear/update if cached name is the old Vimal Kumar placeholder
    if (cachedUser && (cachedUser.includes('Vimal Kumar') || cachedUser.includes('Sharma'))) {
      localStorage.removeItem('ev_cyber_academy_user');
      localStorage.removeItem('ev_cyber_academy_activities');
      cachedUser = null;
      cachedActivities = null;
    }

    // Automatically check and pre-authenticate with the user's authentic credentials if no cache exists
    if (!cachedUser) {
      const defaultUser = {
        username: 'Vimal R',
        email: 'vimalthenoob@gmail.com',
        joinDate: 'June 09, 2026'
      };
      localStorage.setItem('ev_cyber_academy_user', JSON.stringify(defaultUser));
      cachedUser = JSON.stringify(defaultUser);

      if (!cachedProgress) {
        const defaultProgress = {
          completedLabs: [],
          completedTasks: [],
          completedHackathonDays: [],
          xp: 0
        };
        localStorage.setItem('ev_cyber_academy_progress', JSON.stringify(defaultProgress));
        cachedProgress = JSON.stringify(defaultProgress);
      }
    }

    if (cachedUser) {
      setIsAuthenticated(true);
      const parsedUser = JSON.parse(cachedUser);
      
      let baseState: UserProgress = {
        username: parsedUser.username || 'Vimal R',
        email: parsedUser.email || 'vimalthenoob@gmail.com',
        joinDate: parsedUser.joinDate || 'June 09, 2026',
        completedLabs: [],
        completedTasks: [],
        completedHackathonDays: [],
        xp: 0
      };

      if (cachedProgress) {
        try {
          const parsedProgress = JSON.parse(cachedProgress);
          baseState = { ...baseState, ...parsedProgress };
        } catch (e) {
          console.error("Dossier parse failed. Overriding defaults.", e);
        }
      }

      setUserProgress(baseState);

      if (cachedActivities) {
        try {
          const parsed = JSON.parse(cachedActivities);
          const uniqueParsed = [];
          const seen = new Set();
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              if (item && item.id && !seen.has(item.id)) {
                seen.add(item.id);
                uniqueParsed.push(item);
              }
            }
          }
          setRecentActivities(uniqueParsed.length > 0 ? uniqueParsed : [
            { id: 'act_init', type: 'login', message: 'Credentials successfully validated on Security Portal for Vimal R.', time: 'Just now' }
          ]);
        } catch {
          setRecentActivities([
            { id: 'act_init', type: 'login', message: 'Credentials successfully validated on Security Portal for Vimal R.', time: 'Just now' }
          ]);
        }
      } else {
        const defaultLog = [
          { id: 'act_init', type: 'login', message: 'Credentials successfully validated on Security Portal for Vimal R.', time: 'Just now' }
        ];
        setRecentActivities(defaultLog);
        localStorage.setItem('ev_cyber_academy_activities', JSON.stringify(defaultLog));
      }
    }
  }, []);

  // Sync back state modifications to local storage
  const saveState = (updatedProg: UserProgress) => {
    setUserProgress(updatedProg);
    localStorage.setItem('ev_cyber_academy_progress', JSON.stringify(updatedProg));
  };

  const addActivityLog = (type: 'lab' | 'task' | 'hackathon' | 'badge' | 'login', message: string, xpAwarded?: number) => {
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newAct: RecentActivity = {
      id: `act_${Date.now()}_${randomSuffix}`,
      type,
      message,
      time: 'Just now',
      xpAwarded
    };
    
    setRecentActivities((prev) => {
      const updated = [newAct, ...prev.slice(0, 19)]; // keep max 20 logs
      localStorage.setItem('ev_cyber_academy_activities', JSON.stringify(updated));
      return updated;
    });
  };

  // Login event
  const handleLoginSuccess = (name: string, email: string) => {
    const userMeta = { username: name, email, joinDate: 'June 09, 2026' };
    localStorage.setItem('ev_cyber_academy_user', JSON.stringify(userMeta));
    setIsAuthenticated(true);

    const initialProgress: UserProgress = {
      ...userMeta,
      completedLabs: [],
      completedTasks: [],
      completedHackathonDays: [],
      xp: 0
    };

    setUserProgress(initialProgress);
    localStorage.setItem('ev_cyber_academy_progress', JSON.stringify(initialProgress));

    const initLog: RecentActivity[] = [
      { id: 'act_login', type: 'login', message: `Program initialized for student display name '${name}'.`, time: 'Just now' }
    ];
    setRecentActivities(initLog);
    localStorage.setItem('ev_cyber_academy_activities', JSON.stringify(initLog));
    setCurrentTab('dashboard');
    triggerToast('Access granted! Authenticated to EV Security training environment.', 'success');
  };

  // Logout event
  const handleLogout = () => {
    localStorage.removeItem('ev_cyber_academy_user');
    // We intentionally do NOT clear the progress from localstorage, so they can re-login and keep it, OR choose reset.
    setIsAuthenticated(false);
    triggerToast('Session closed. Portal secured safely.', 'info');
  };

  // Lab completed event
  const handleCompleteLab = (labId: number, xpReward: number) => {
    if (userProgress.completedLabs.includes(labId)) return;

    const updatedLabs = [...userProgress.completedLabs, labId];
    const updatedProg = {
      ...userProgress,
      completedLabs: updatedLabs,
      xp: userProgress.xp + xpReward
    };

    saveState(updatedProg);
    addActivityLog('lab', `Verified practical sandbox environment details for Lab ${labId < 10 ? '0' : ''}${labId}.`, xpReward);
    
    // Check Badge achievements threshold
    if (updatedLabs.length === 1) {
      addActivityLog('badge', 'Unlocked Milestone badge: First Blood!', 50);
      saveState({ ...updatedProg, xp: updatedProg.xp + 50 });
    } else if (updatedLabs.length === 16) {
      addActivityLog('badge', 'Unlocked grand graduation badge: Master Graduate!', 200);
      saveState({ ...updatedProg, xp: updatedProg.xp + 250 }); // extra 200 plus lab
    }
  };

  // Lab reset / redeploy event for repractice
  const handleResetLab = (labId: number) => {
    const isCompleted = userProgress.completedLabs.includes(labId);
    const updatedLabs = userProgress.completedLabs.filter((id) => id !== labId);
    
    const lab = LABS_DATA.find((l) => l.id === labId);
    const xpReward = lab ? lab.xpReward : 0;
    const pendingXpReduction = isCompleted ? xpReward : 0;
    
    const updatedProg = {
      ...userProgress,
      completedLabs: updatedLabs,
      xp: Math.max(0, userProgress.xp - pendingXpReduction)
    };

    saveState(updatedProg);
    addActivityLog('lab', `Redeployed Lab ${labId < 10 ? '0' : ''}${labId} for hands-on repractice. Status reset.`, 0);
    triggerToast(`Lab ${labId < 10 ? '0' : ''}${labId} has been redeployed. You can now execute and solve it again!`, 'info');
  };

  // Task checkmarks toggles
  const handleToggleTask = (taskId: string, isChecked: boolean, xpReward: number) => {
    let updatedTasks = [...userProgress.completedTasks];
    let xpAdjustment = 0;

    if (isChecked) {
      if (!updatedTasks.includes(taskId)) {
        updatedTasks.push(taskId);
        xpAdjustment = xpReward;
      }
    } else {
      updatedTasks = updatedTasks.filter((id) => id !== taskId);
      xpAdjustment = -xpReward;
    }

    const updatedProg = {
      ...userProgress,
      completedTasks: updatedTasks,
      xp: userProgress.xp + xpAdjustment
    };

    saveState(updatedProg);

    if (isChecked) {
      addActivityLog('task', `Supplemental exercise checkmarked: '${TASKS_DATA.find((t) => t.id === taskId)?.title}'.`, xpReward);
      
      // Badges
      if (updatedTasks.length === 3) {
        addActivityLog('badge', 'Unlocked Achievement: Practical Pioneer!', 50);
        saveState({ ...updatedProg, xp: updatedProg.xp + 50 });
      } else if (updatedTasks.length === 10) {
        addActivityLog('badge', 'Unlocked master milestone badge: Task Finisher!', 100);
        saveState({ ...updatedProg, xp: updatedProg.xp + 100 });
      }
    } else {
      addActivityLog('task', `Reverted checklist checkmark parameters on: '${TASKS_DATA.find((t) => t.id === taskId)?.title}'.`);
    }
  };

  // Hackathon completed tabs
  const handleCompleteHackathonDay = (dayNum: number, xpReward: number) => {
    if (userProgress.completedHackathonDays.includes(dayNum)) return;

    const updatedDays = [...userProgress.completedHackathonDays, dayNum];
    const updatedProg = {
      ...userProgress,
      completedHackathonDays: updatedDays,
      xp: userProgress.xp + xpReward
    };

    saveState(updatedProg);
    addActivityLog('hackathon', `Incident Response Hackathon Day ${dayNum} perimeter targets secured.`, xpReward);

    if (updatedDays.length === 2) {
      addActivityLog('badge', 'Unlocked Milestone Award: Incident Responder!', 50);
      saveState({ ...updatedProg, xp: updatedProg.xp + 50 });
    }
  };

  // Profile update settings
  const handleUpdateUser = (newName: string, newEmail: string) => {
    // Keep standard email and registry names synchronized
    const userMeta = { username: newName, email: newEmail, joinDate: userProgress.joinDate };
    localStorage.setItem('ev_cyber_academy_user', JSON.stringify(userMeta));
    
    const updatedProg = {
      ...userProgress,
      ...userMeta
    };

    saveState(updatedProg);
    addActivityLog('login', `Dossier registry profile renamed to ${newName}.`);
  };

  // Import backup progress dossier
  const handleImportProgress = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      const restoredProg: UserProgress = {
        username: parsed.username || userProgress.username,
        email: parsed.email || userProgress.email,
        joinDate: parsed.joinDate || userProgress.joinDate,
        completedLabs: parsed.completedLabs || [],
        completedTasks: parsed.completedTasks || [],
        completedHackathonDays: parsed.completedHackathonDays || [],
        xp: parsed.xp || 0
      };

      saveState(restoredProg);
      const randomSuffix = Math.random().toString(36).substring(2, 9);
      const actLogs = [
        { id: `act_${Date.now()}_${randomSuffix}`, type: 'login' as any, message: 'Dossier files restored from external backups.', time: 'Just now' }
      ];
      setRecentActivities(actLogs);
      localStorage.setItem('ev_cyber_academy_activities', JSON.stringify(actLogs));
    } catch (e) {
      console.error(e);
    }
  };

  // Hard Reset variables
  const handleResetProgress = () => {
    const clearedProgress: UserProgress = {
      username: userProgress.username,
      email: userProgress.email,
      joinDate: userProgress.joinDate,
      completedLabs: [],
      completedTasks: [],
      completedHackathonDays: [],
      xp: 0
    };
    saveState(clearedProgress);
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const resetAct = [
      { id: `act_${Date.now()}_${randomSuffix}`, type: 'login' as any, message: 'Academic dossier parameters hard-cleared.', time: 'Just now' }
    ];
    setRecentActivities(resetAct);
    localStorage.setItem('ev_cyber_academy_activities', JSON.stringify(resetAct));
    setCurrentTab('dashboard');
  };

  // Get active student ranking calculations
  const currentRank = RANKS.find((r) => userProgress.xp >= r.minXp && userProgress.xp <= r.maxXp) || RANKS[0];

  // Render App UI
  const isKaliView = typeof window !== 'undefined' && window.location.search.includes('view=kali');
  if (isKaliView) {
    return <KaliOSView />;
  }

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0a0b10] relative text-white antialiased font-sans" id="academy-portal-dashboard">
      
      {/* Floating alert notifications Toast component */}
      {toast && (
        <div 
          className="fixed bottom-6 right-6 z-50 p-4.5 rounded-2xl glass-panel shadow-2xl border flex items-center gap-3 animate-slide-up max-w-md"
          style={{
            borderColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : '#3b82f6',
            background: 'rgba(10, 15, 25, 0.95)'
          }}
          id={`floating-toast-${toast.type}`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-brand-rose shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-brand-blue shrink-0" />
          )}

          <span className="text-xs font-semibold text-slate-100 pr-[14px]">
            {toast.msg}
          </span>

          <button 
            onClick={() => setToast(null)}
            className="p-1 hover:bg-white/5 rounded text-slate-400 absolute right-2.5 top-2.5"
            id="close-toast-btn"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Collapsible Sidebar Navigation Panel */}
      <Sidebar 
        currentTab={currentTab} 
        setTab={setCurrentTab} 
        userProgress={userProgress} 
        rank={currentRank}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Master Content Stage View Router */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-screen relative" id="stage-viewport border border-transparent">
        <div className="max-w-7xl mx-auto space-y-6">
          {currentTab === 'dashboard' && (
            <DashboardView 
              userProgress={userProgress} 
              rank={currentRank} 
              allBadges={BADGES} 
              recentActivities={recentActivities}
              setTab={setCurrentTab}
            />
          )}

          {currentTab === 'labs' && (
            <LabsView 
              labs={LABS_DATA} 
              userProgress={userProgress} 
              onCompleteLab={handleCompleteLab}
              onResetLab={handleResetLab}
              triggerToast={triggerToast}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView 
              tasks={TASKS_DATA}
              userProgress={userProgress}
              onToggleTask={handleToggleTask}
              triggerToast={triggerToast}
            />
          )}

          {currentTab === 'certificate' && (
            <CertificateView 
              userProgress={userProgress}
              triggerToast={triggerToast}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView 
              userProgress={userProgress}
              rank={currentRank}
              allBadges={BADGES}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView 
              userProgress={userProgress}
              onUpdateUser={handleUpdateUser}
              onImportProgress={handleImportProgress}
              onResetProgress={handleResetProgress}
              triggerToast={triggerToast}
            />
          )}
        </div>
      </main>
    </div>
  );
}
