import { useState } from 'react';
import { 
  ClipboardCheck, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Award 
} from 'lucide-react';
import { TaskItem, UserProgress } from '../types';
import { motion } from 'motion/react';

interface TasksViewProps {
  tasks: TaskItem[];
  userProgress: UserProgress;
  onToggleTask: (taskId: string, isChecked: boolean, xpReward: number) => void;
  triggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function TasksView({
  tasks,
  userProgress,
  onToggleTask,
  triggerToast
}: TasksViewProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Linux' | 'Networking' | 'Web Web Security' | 'Response'>('All');

  const taskCategories = ['All', 'Linux', 'Networking', 'Web Web Security', 'Response'];

  const filteredTasks = tasks.filter(task => {
    if (activeCategory === 'All') return true;
    return task.category === activeCategory;
  });

  const completedTasksCount = userProgress.completedTasks.length;
  const totalTasks = tasks.length;
  const progressPercentage = Math.round((completedTasksCount / totalTasks) * 100);

  const getCategoryTheme = (cat: string) => {
    switch(cat) {
      case 'Linux': return 'bg-brand-blue/10 text-brand-blue border-brand-blue/15';
      case 'Networking': return 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/15';
      case 'Web Web Security': return 'bg-brand-violet/10 text-brand-violet border-brand-violet/15';
      case 'Response': return 'bg-brand-rose/10 text-brand-rose border-brand-rose/15';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const handleTaskToggle = (task: TaskItem) => {
    const isCurrentlyCompleted = userProgress.completedTasks.includes(task.id);
    onToggleTask(task.id, !isCurrentlyCompleted, task.xp);
    if (!isCurrentlyCompleted) {
      triggerToast(`Task completed! You earned +${task.xp} XP.`, 'success');
    } else {
      triggerToast(`Task reverted. XP removed.`, 'info');
    }
  };

  return (
    <div className="space-y-6" id="tasks-view-panel">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Supplemental Homework Exercises</h1>
          <p className="text-sm text-slate-400">Complete practical real-world challenges beyond the simulators to accelerate your learning.</p>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="flex items-center gap-4 bg-[#111624] p-3 rounded-xl border border-white/5 min-w-[200px]" id="tasks-progress-widget">
          <div className="p-2.5 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-lg">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Task Completion</span>
            <span className="text-lg font-bold text-white block">{completedTasksCount} <span className="text-xs text-slate-500 font-normal">/ {totalTasks}</span></span>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-brand-emerald rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" id="tasks-category-tabs">
        {taskCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
              activeCategory === cat 
                ? 'bg-brand-emerald/10 border-brand-emerald/30 text-white shadow-sm shadow-brand-emerald/5' 
                : 'bg-transparent border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'Web Web Security' ? 'Web Security' : cat}
          </button>
        ))}
      </div>

      {/* Task checklist grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="tasks-checklist-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isCompleted = userProgress.completedTasks.includes(task.id);
            return (
              <div 
                key={task.id}
                onClick={() => handleTaskToggle(task)}
                className={`p-5 rounded-2xl glass-panel border flex gap-4 transition-all hover:bg-[#111726]/40 relative cursor-pointer group ${
                  isCompleted 
                    ? 'border-brand-emerald/15 bg-brand-emerald/5/5 bg-linear-to-r from-brand-emerald/5 to-transparent' 
                    : 'border-white/5 bg-[#101524]/20'
                }`}
                id={`task-card-${task.id}`}
              >
                {/* Custom active glow on checked */}
                {isCompleted && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-emerald rounded-l"></span>
                )}

                {/* Checkbox block */}
                <div className="pt-1 select-none shrink-0" id={`checklist-toggle-${task.id}`}>
                  <div className={`w-5.5 h-5.5 rounded-md border flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-brand-emerald border-brand-emerald text-[#090d16]' 
                      : 'border-slate-700 group-hover:border-slate-500'
                  }`}>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-950 stroke-[3px]" />}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryTheme(task.category)}`}>
                      {task.category === 'Web Web Security' ? 'Web Security' : task.category}
                    </span>
                    <span className="text-[10px] text-brand-emerald font-semibold flex items-center gap-1 font-mono">
                      <Flame className="w-3.5 h-3.5 text-brand-emerald" /> +{task.xp} XP
                    </span>
                  </div>

                  <h3 className={`font-bold text-sm leading-snug transition-colors ${
                    isCompleted ? 'text-slate-400 line-through' : 'text-white'
                  }`}>
                    {task.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">
            No supplemental tasks discovered within this category classification.
          </div>
        )}
      </div>

      {/* Gamification Achievements Reminder */}
      <div className="p-5 rounded-2xl border border-brand-blue/10 bg-brand-blue/5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full bg-linear-to-l from-brand-blue/5 to-transparent pointer-events-none"></div>
        <div className="p-3 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-brand-blue shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-white flex items-center justify-center sm:justify-start gap-1.5 uppercase tracking-wide">
            Task finisher Milestone <Sparkles className="w-4 h-4 text-yellow-400" />
          </h4>
          <p className="text-xs text-slate-300 leading-normal">
            Mark off <strong className="text-white">all 10 homework checklist exercises</strong> to unlock the exclusive <strong className="text-brand-cyan">Task Finisher Achievement badge</strong> and secure an additional 100 XP bonus!
          </p>
        </div>
      </div>
    </div>
  );
}
