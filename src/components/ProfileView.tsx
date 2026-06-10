import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Flame, 
  Award, 
  ShieldCheck, 
  Terminal, 
  Compass, 
  Activity, 
  Lock,
  Unlock,
  Check,
  Zap
} from 'lucide-react';
import { UserProgress, RankInfo, AchievementBadge } from '../types';
import { motion } from 'motion/react';

interface ProfileViewProps {
  userProgress: UserProgress;
  rank: RankInfo;
  allBadges: AchievementBadge[];
}

export default function ProfileView({
  userProgress,
  rank,
  allBadges
}: ProfileViewProps) {
  const completedLabsCount = userProgress.completedLabs.length;
  const completedTasksCount = userProgress.completedTasks.length;

  // Render a visual progress bar or list for subject mastery
  const linuxMastery = Math.round(
    ((userProgress.completedLabs.filter(id => [1,2,3].includes(id)).length + 
      userProgress.completedTasks.filter(id => ['task_1', 'task_8'].includes(id)).length) / 5) * 100
  );

  const networkingMastery = Math.round(
    ((userProgress.completedLabs.filter(id => [4,5,6,8].includes(id)).length + 
      userProgress.completedTasks.filter(id => ['task_3', 'task_4'].includes(id)).length) / 6) * 100
  );

  const webMastery = Math.round(
    ((userProgress.completedLabs.filter(id => [7,9,10].includes(id)).length + 
      userProgress.completedTasks.filter(id => ['task_5', 'task_6', 'task_10'].includes(id)).length) / 6) * 100
  );

  const defenseMastery = Math.round(
    ((userProgress.completedLabs.filter(id => [11,12,13,14,15,16].includes(id)).length + 
      userProgress.completedTasks.filter(id => ['task_2', 'task_7', 'task_9'].includes(id)).length) / 9) * 100
  );

  const getBadgeIconComponent = (id: string) => {
    switch(id) {
       case 'badge_1': return <Terminal className="w-5 h-5 text-sky-400" />;
       case 'badge_2': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
       case 'badge_3': return <Zap className="w-5 h-5 text-brand-cyan" />;
       case 'badge_4': return <Trophy className="w-5 h-5 text-brand-blue" />;
       case 'badge_5': return <Award className="w-5 h-5 text-pink-400" />;
       case 'badge_6': return <Compass className="w-5 h-5 text-violet-400" />;
       default: return <Award className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 p-1 lg:p-4" id="profile-page-root">
      
      {/* Top Profile Card Header */}
      <div className="rounded-2xl glass-panel border border-white/5 p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6" id="profile-executive-header">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan border border-brand-blue/35 flex items-center justify-center font-bold text-white text-3xl shrink-0 shadow-lg shadow-brand-blue/10">
          {userProgress.username.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2.5">
            <h1 className="text-2xl font-black text-white">{userProgress.username}</h1>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${rank.borderClass} ${rank.bgClass}`}>
              {rank.name}
            </span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-5 gap-y-2.5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-500" /> {userProgress.email}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-500" /> Member Since: June 09, 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#111624] border border-white/5 px-4.5 py-3.5 rounded-xl text-center shrink-0" id="xp-profile-counter">
          <Flame className="w-6 h-6 text-brand-emerald" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">TOTAL POINTS</span>
            <span className="text-xl font-bold font-mono text-white block">{userProgress.xp} <span className="text-xs text-slate-500 font-normal">XP</span></span>
          </div>
        </div>
      </div>

      {/* Core split grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats and Subject Mastery */}
        <div className="lg:col-span-1 space-y-6">
          {/* Training Stats summary */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Statistical Totals</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b border-white/5 pb-2.5">
                <span>Completed Labs Solve Rate</span>
                <span className="text-white font-bold font-mono">{completedLabsCount} of 16</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 pb-1">
                <span>Homework Task Solved</span>
                <span className="text-white font-bold font-mono">{completedTasksCount} of 10</span>
              </div>
            </div>
          </div>

          {/* Subject Mastery indicators */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Coverage Mastery</h3>
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-semibold">Linux Essentials</span>
                  <span className="font-mono text-brand-blue font-bold">{Math.min(100, linuxMastery)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full" style={{ width: `${Math.min(100, linuxMastery)}%` }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-semibold">Networking Fundamentals</span>
                  <span className="font-mono text-brand-cyan font-bold">{Math.min(100, networkingMastery)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-cyan rounded-full" style={{ width: `${Math.min(100, networkingMastery)}%` }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-semibold">Web Security</span>
                  <span className="font-mono text-brand-violet font-bold">{Math.min(100, webMastery)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-violet rounded-full" style={{ width: `${Math.min(100, webMastery)}%` }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-semibold">Defense & Synthesis</span>
                  <span className="font-mono text-brand-emerald font-bold">{Math.min(100, defenseMastery)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-emerald rounded-full" style={{ width: `${Math.min(100, defenseMastery)}%` }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right column - Achievements ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Milestone Achievement Badges
              </h3>
              <span className="text-xs text-slate-500 font-semibold uppercase">Gamified Badges</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="badges-detailed-grid">
              {allBadges.map((badge) => {
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
                    className={`p-4.5 rounded-xl border flex items-start gap-4 transition-all relative overflow-hidden ${
                      isUnlocked 
                        ? 'bg-[#10192e] border-brand-blue/15 shadow shadow-brand-blue/5' 
                        : 'bg-[#111522]/30 border-slate-850 opacity-45'
                    }`}
                  >
                    {isUnlocked && (
                      <span className="absolute right-3 top-3 p-0.5 bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/15 rounded">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    )}

                    <div className={`p-3 rounded-full shrink-0 ${isUnlocked ? 'bg-brand-blue/15' : 'bg-slate-800/40'}`}>
                      {getBadgeIconComponent(badge.id)}
                    </div>

                    <div className="space-y-1 pr-[1.25rem]">
                      <h4 className="font-extrabold text-xs text-white leading-tight">{badge.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">{badge.description}</p>
                      <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mt-1.5 font-mono">
                        {isUnlocked ? "Status: UNLOCKED" : "Status: LOCKED"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
