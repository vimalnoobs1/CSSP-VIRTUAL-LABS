import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Smartphone, 
  Terminal, 
  Trophy, 
  Zap,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { UserProgress, RankInfo, CourseSession, AchievementBadge, RecentActivity } from '../types';
import { motion } from 'motion/react';

interface DashboardViewProps {
  userProgress: UserProgress;
  rank: RankInfo;
  allBadges: AchievementBadge[];
  recentActivities: RecentActivity[];
  setTab: (tab: string) => void;
}

export default function DashboardView({
  userProgress,
  rank,
  allBadges,
  recentActivities,
  setTab
}: DashboardViewProps) {
  const totalLabs = 16;
  const completedLabsCount = userProgress.completedLabs.length;
  const remainingLabsCount = totalLabs - completedLabsCount;
  const labsPercentage = Math.round((completedLabsCount / totalLabs) * 100);

  const completedTasksCount = userProgress.completedTasks.length;
  const totalTasks = 10;
  const tasksPercentage = Math.round((completedTasksCount / totalTasks) * 100);

  // Overall combined progress metric
  const overallPercentage = Math.round(
    ((userProgress.completedLabs.length + userProgress.completedTasks.length) / 
    (totalLabs + totalTasks)) * 100
  );

  // Course Roadmaps sessions (16 sessions representing standard outline)
  const courseSessions: CourseSession[] = [
    { id: 1, title: "Foundations: Introduction to Cyber Security & Termux", duration: "1.5 hrs", date: "Day 01", type: "Practical" },
    { id: 2, title: "Linux Essentials: File System Commands (pwd, ls, cd)", duration: "1.5 hrs", date: "Day 03", type: "Practical" },
    { id: 3, title: "Linux Essentials: File Actions & Permissions (chmod)", duration: "2.0 hrs", date: "Day 05", type: "Practical" },
    { id: 4, title: "Networking: Subnets, IP Addressing & Interfaces", duration: "1.5 hrs", date: "Day 07", type: "Theory" },
    { id: 5, title: "Networking: DNS & Nameserver Investigation", duration: "1.5 hrs", date: "Day 09", type: "Practical" },
    { id: 6, title: "Networking: Packet Routing Journeys", duration: "1.5 hrs", date: "Day 10", type: "Practical" },
    { id: 7, title: "Web Security: HTTP (Cleartext) vs HTTPS (Encryption)", duration: "1.5 hrs", date: "Day 12", type: "Theory" },
    { id: 8, title: "Networking: Active Ports & Services Mapping", duration: "1.5 hrs", date: "Day 14", type: "Practical" },
    { id: 9, title: "Web Security: Chrome Developer Tools (F12)", duration: "1.5 hrs", date: "Day 15", type: "Practical" },
    { id: 10, title: "Web Security: Session Cookies & Authentication", duration: "1.5 hrs", date: "Day 17", type: "Theory" },
    { id: 11, title: "Awareness & Metrics: Password Security & Entropy", duration: "2.0 hrs", date: "Day 19", type: "Review" },
    { id: 12, title: "Social Engineering: Phishing & Scam Detection", duration: "1.5 hrs", date: "Day 21", type: "Theory" },
    { id: 13, title: "Mobile Security: Android APK Manifest Inspection", duration: "2.0 hrs", date: "Day 23", type: "Practical" },
    { id: 14, title: "Security Tools: Recon Workflow & Subdomain Scans", duration: "1.5 hrs", date: "Day 24", type: "Practical" },
    { id: 15, title: "Professional Reporting: Vulnerability Disclosures", duration: "1.5 hrs", date: "Day 26", type: "Review" },
    { id: 16, title: "Final Lab Practical: Capstone Assessment", duration: "2.5 hrs", date: "Day 27", type: "Practical" }
  ];

  // Map icons for display purposes
  const getBadgeIcon = (id: string) => {
    switch(id) {
       case 'badge_1': return <Terminal className="w-5 h-5 text-sky-400" />;
       case 'badge_2': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
       case 'badge_3': return <Zap className="w-5 h-5 text-brand-cyan" />;
       case 'badge_4': return <Trophy className="w-5 h-5 text-brand-blue" />;
       case 'badge_5': return <Award className="w-5 h-5 text-pink-400" />;
       case 'badge_6': return <BookOpen className="w-5 h-5 text-violet-400" />;
       default: return <Award className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 p-1 lg:p-4" id="dashboard-view-panel">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel border border-white/5 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6" id="welcome-banner">
        <div className="absolute top-0 right-0 w-80 h-full bg-linear-to-l from-brand-blue/10 to-transparent pointer-events-none"></div>
        
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue" id="program-cohort">
            Active Student Dashboard • Class of 2026
          </span>
          <h1 className="text-2xl lg:text-3.5xl font-extrabold text-white tracking-tight" id="student-name-header">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-emerald">{userProgress.username}</span>!
          </h1>
          <p className="text-sm text-slate-300 max-w-2.5xl leading-relaxed">
            You are enrolled in the premium <span className="text-white font-medium">Cyber Security Starter Program 2026</span>. Work through interactive lab simulators, test scripts, and complete exercises to graduate with your authenticated certificate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:self-center">
          <div className="px-4 py-3 bg-[#131d2f]/70 rounded-xl border border-brand-blue/15 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-brand-blue" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Course Fee</span>
              <span className="text-sm font-bold text-white block">₹999 (Paid)</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-[#112423]/70 rounded-xl border border-brand-emerald/15 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-brand-emerald" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Duration</span>
              <span className="text-sm font-bold text-white block">27 Days (16 Sessions)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Statistics Cards widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" id="stats-widget-row">
        {/* Completed Labs Widget */}
        <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-white/5 flex items-center gap-4 relative">
          <div className="p-3.5 bg-brand-blue/10 rounded-xl border border-brand-blue/10 text-brand-blue">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block">Completed Labs</span>
            <span className="text-2xl font-bold text-white block">{completedLabsCount} <span className="text-xs text-slate-500 font-normal">/ {totalLabs}</span></span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-medium text-brand-blue">{labsPercentage}% Syncs</span>
              <div className="w-16 h-1.5 bg-[#172033] rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full" style={{ width: `${labsPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining Labs Widget */}
        <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-white/5 flex items-center gap-4 relative">
          <div className="p-3.5 bg-brand-cyan/10 rounded-xl border border-brand-cyan/10 text-brand-cyan">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block">Remaining Labs</span>
            <span className="text-2xl font-bold text-white block">{remainingLabsCount} <span className="text-xs text-slate-500 font-normal">Labs left</span></span>
            <span className="text-[10px] text-slate-500 block">Total {totalLabs} curated labs</span>
          </div>
        </div>

        {/* XP Points Widget */}
        <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-white/5 flex items-center gap-4 relative">
          <div className="p-3.5 bg-brand-emerald/10 rounded-xl border border-brand-emerald/10 text-brand-emerald">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block">XP Earned</span>
            <span className="text-2xl font-bold text-white block">{userProgress.xp} <span className="text-xs text-slate-500 font-normal">XP</span></span>
            <div className="flex items-center gap-1 mt-1 font-semibold text-[10px] text-slate-400 tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-brand-emerald" /> NEXT RANK IN {Math.max(0, rank.maxXp - userProgress.xp)} XP
            </div>
          </div>
        </div>

        {/* Current Rank Widget */}
        <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-white/5 flex items-center gap-4 relative">
          <div className="p-3.5 bg-brand-violet/10 rounded-xl border border-brand-violet/10 text-brand-violet">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block">Academy Rank</span>
            <span className={`text-sm inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold mt-1 text-white border ${rank.borderClass} ${rank.bgClass}`}>
              {rank.name}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1.5">Rank based on training scores</span>
          </div>
        </div>
      </div>

      {/* Secondary split grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-secondary-grid">
        
        {/* Left Columns - Quick Access & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Access Actions wrapper */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Quick Practical Terminals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="dashboard-action-links">
              
              <button 
                onClick={() => setTab('labs')}
                className="p-4 bg-[#11192e] hover:bg-[#14203b] border border-brand-blue/20 rounded-xl text-left transition-colors flex flex-col justify-between h-32 cursor-pointer group"
              >
                <Terminal className="w-6 h-6 text-brand-blue group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-sm text-white block">Interactive Labs</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Solve 16 sandbox simulators</p>
                </div>
              </button>

              <button 
                onClick={() => setTab('tasks')}
                className="p-4 bg-[#0d1f21] hover:bg-[#112a2c] border border-brand-emerald/20 rounded-xl text-left transition-colors flex flex-col justify-between h-32 cursor-pointer group"
              >
                <CheckCircle2 className="w-6 h-6 text-[#10b981] group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-sm text-white block">Homework Tasks</span>
                  <p className="text-[10px] text-[#94a3b8] leading-normal">Mark off program exercises</p>
                </div>
              </button>
            </div>
          </div>

          {/* Training Accomplishments Badges */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 space-y-4" id="badge-showcase-pnl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Earned Badges ({allBadges.filter(b => b.unlockedAtXp !== undefined).length})</h3>
              <button onClick={() => setTab('profile')} className="text-xs text-brand-blue hover:underline flex items-center font-semibold">
                See Profile <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="badges-preview-flex">
              {allBadges.slice(0, 4).map((badge) => {
                const isUnlocked = 
                  (badge.id === 'badge_1' && completedLabsCount >= 1) ||
                  (badge.id === 'badge_3' && completedTasksCount >= 3) ||
                  (badge.id === 'badge_4' && completedLabsCount >= 8) ||
                  (badge.id === 'badge_2' && userProgress.xp > 600) ||
                  (badge.id === 'badge_5' && completedLabsCount >= 16) ||
                  (badge.id === 'badge_6' && completedTasksCount >= 10);

                return (
                  <div 
                    key={badge.id}
                    className={`p-3.5 rounded-xl border text-center relative flex flex-col items-center justify-center space-y-2 transition-all ${
                      isUnlocked 
                        ? 'bg-[#10192e] border-brand-blue/20' 
                        : 'bg-[#121620]/30 border-slate-800 opacity-55'
                    }`}
                  >
                    <div className={`p-2.5 rounded-full ${isUnlocked ? 'bg-brand-blue/15' : 'bg-slate-800/50'}`}>
                      {getBadgeIcon(badge.id)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white truncate max-w-full px-1">{badge.title}</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1 leading-normal">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Sessions Roadmap */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 space-y-4" id="roadmap-pnl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Course Curriculum Roadmap</h3>
                <span className="text-xs text-slate-400 font-medium">16 modules covering basic terminal workflows to assessments</span>
              </div>
              <div className="flex gap-1.5 text-xs font-semibold">
                <span className="px-2 py-0.5 bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/15 rounded-md text-[10px]">PRACTICAL</span>
                <span className="px-2 py-0.5 bg-brand-violet/15 text-brand-violet border border-brand-violet/15 rounded-md text-[10px]">THEORY</span>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1" id="course-sessions-roadmap">
              {courseSessions.map((session) => {
                const isFinished = userProgress.completedLabs.includes(session.id);
                return (
                  <div 
                    key={session.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                      isFinished 
                        ? 'bg-[#0f2a24]/10 border-brand-emerald/15' 
                        : 'bg-[#111726]/40 border-white/5'
                    }`}
                    id={`roadmap-session-${session.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8.5 h-8.5 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                        isFinished 
                          ? 'bg-brand-emerald/15 border-brand-emerald/25 text-brand-emerald' 
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                      }`}>
                        {session.id < 10 ? `0${session.id}` : session.id}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block line-clamp-1">{session.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-medium">{session.date}</span>
                          <span className="text-[9px] text-slate-500">•</span>
                          <span className="text-[10px] text-slate-400 font-medium">{session.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        session.type === 'Practical' 
                          ? 'bg-brand-emerald/10 border-brand-emerald/10 text-brand-emerald' 
                          : session.type === 'Theory'
                          ? 'bg-brand-violet/10 border-brand-violet/10 text-brand-violet'
                          : 'bg-brand-cyan/10 border-brand-cyan/10 text-brand-cyan'
                      }`}>
                        {session.type}
                      </span>
                      {isFinished ? (
                        <span className="text-brand-emerald font-semibold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Passed
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium text-xs">Locked</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column - Upcoming / Roadmap Status & Live Logs Actions */}
        <div className="space-y-6">
          
          {/* Calendar Widget / Upcoming Schedule */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Live Session Schedule</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-[#141b2d] rounded-xl border border-brand-blue/15 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] py-0.5 px-2 uppercase font-black tracking-wider rounded bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
                    Tue & Thu Batch
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">9:15 PM - 10:45 PM</span>
                </div>
                <h4 className="font-extrabold text-xs text-white">Ethical Hacking & Handson Labs</h4>
                <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                  Interactive lessons covering CLI configurations, network scans, and security architectures.
                </p>
              </div>

              <div className="p-3 bg-[#0d1c1a]/95 rounded-xl border border-brand-emerald/15 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] py-0.5 px-2 uppercase font-black tracking-wider rounded bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald">
                    Sat & Sun Batch
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">8:00 PM - 9:30 PM</span>
                </div>
                <h4 className="font-extrabold text-xs text-white">Practical Audits & Recon Workflows</h4>
                <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                  Focusing on APK analysis, phishing forensic models, and web penetration tools.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#111622] rounded-xl border border-white/5 space-y-3">
              <h4 className="font-bold text-xs text-slate-300">Class Progress Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Labs Solutions Synced</span>
                  <span className="text-white font-medium">{completedLabsCount} of 16</span>
                </div>
                <div className="w-full h-1.5 bg-[#172033] rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full" style={{ width: `${labsPercentage}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Task Checklists</span>
                  <span className="text-white font-medium">{completedTasksCount} of 10</span>
                </div>
                <div className="w-full h-1.5 bg-[#172033] rounded-full overflow-hidden">
                  <div className="h-full bg-brand-emerald rounded-full" style={{ width: `${tasksPercentage}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>TOTAL ACADEMIC PROGRESS</span>
                <span className="text-brand-cyan">{overallPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#172033] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-linear-to-r from-brand-blue via-brand-cyan to-brand-emerald rounded-full" style={{ width: `${overallPercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Recent Audits / Pipeline Activity logs */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Student Audit Log Actions</h3>
            
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1" id="activity-log-wrapper">
              {recentActivities.reduce<RecentActivity[]>((acc, act) => {
                if (act && act.id && !acc.some((item) => item.id === act.id)) {
                  acc.push(act);
                }
                return acc;
              }, []).map((act) => (
                <div 
                  key={act.id}
                  className="p-3 bg-[#101420]/70 rounded-xl border border-white/5 flex gap-2.5 relative overflow-hidden"
                  id={`activity-${act.id}`}
                >
                  <div className={`w-1.5 absolute left-0 top-0 bottom-0 ${
                    act.type === 'lab' ? 'bg-brand-blue' :
                    act.type === 'task' ? 'bg-brand-emerald' :
                    act.type === 'hackathon' ? 'bg-brand-violet' :
                    act.type === 'badge' ? 'bg-pink-500' : 'bg-slate-400'
                  }`}></div>
                  
                  <div className="flex-1 pl-1 space-y-1">
                    <p className="text-xs font-medium text-slate-300 leading-normal">{act.message}</p>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>{act.time}</span>
                      {act.xpAwarded && (
                        <span className="text-brand-emerald font-bold font-mono">+{act.xpAwarded} XP</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
