import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  BookOpen, 
  Flame, 
  Check, 
  Play, 
  Trophy,
  Activity,
  ArrowRight,
  RefreshCw,
  Key,
  Eye,
  Info,
  Copy
} from 'lucide-react';
import { Lab, UserProgress } from '../types';
import LabSimulators from './LabSimulators';
import { motion } from 'motion/react';
import { LAB_SOLUTIONS_MAP } from '../data/solutions';

interface LabsViewProps {
  labs: Lab[];
  userProgress: UserProgress;
  onCompleteLab: (labId: number, xpReward: number) => void;
  onResetLab?: (labId: number) => void;
  triggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function LabsView({
  labs,
  userProgress,
  onCompleteLab,
  onResetLab,
  triggerToast
}: LabsViewProps) {
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'instructions' | 'solution' | 'theory'>('instructions');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [flagInputs, setFlagInputs] = useState<{[key: number]: string}>({});
  const [showHint, setShowHint] = useState<number | null>(null);

  useEffect(() => {
    setActiveTab('instructions');
  }, [selectedLabId]);

  // Active categories - dynamically generated to match labs exactly
  const categories = ['All', ...Array.from(new Set(labs.map(lab => lab.category)))];

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = 
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lab.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.difficulty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' ? true : lab.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'All' ? true : lab.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (diff: 'Beginner' | 'Intermediate' | 'Advanced') => {
    switch (diff) {
      case 'Beginner': return 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/15';
      case 'Intermediate': return 'bg-brand-blue/10 text-brand-blue border-brand-blue/15';
      case 'Advanced': return 'bg-brand-rose/10 text-brand-rose border-brand-rose/15';
    }
  };

  const handleFlagSubmit = (labId: number, targetLab: Lab) => {
    const input = (flagInputs[labId] || '').trim();
    if (!input) {
      triggerToast('Please type a security flag to submit.', 'info');
      return;
    }

    if (input === targetLab.flag) {
      if (userProgress.completedLabs.includes(labId)) {
        triggerToast('You have already validated this laboratory flag!', 'info');
        return;
      }
      onCompleteLab(labId, targetLab.xpReward);
      triggerToast(`Flag verified! You completed '${targetLab.title}' and earned ${targetLab.xpReward} XP!`, 'success');
      setFlagInputs({...flagInputs, [labId]: ''});
    } else {
      triggerToast('Invalid Flag format or payload. Review hints and check syntax.', 'error');
    }
  };

  // Pwnbox Deployment Simulator states
  const [deployStatus, setDeployStatus] = useState<'idle' | 'allocating' | 'routing' | 'ready'>('idle');
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [spawnedIP, setSpawnedIP] = useState<string>('');

  const handleDeployInstance = () => {
    if (deployStatus !== 'idle') return;
    
    setDeployStatus('allocating');
    setDeployLogs(["> Initializing virtual machine cluster deployment..."]);
    
    setTimeout(() => {
      setDeployLogs(prev => [...prev, "> Contacting container fleet hypervisors...", "> Allocating RAM cores and computational sandboxes..."]);
    }, 1000);

    setTimeout(() => {
      setDeployLogs(prev => [...prev, "> Creating OpenVPN TAP interface configuration parameters...", "> Establishing tun0 tunnel bindings...", "> Target routing scope mapped to: 10.10.10.123"]);
      setDeployStatus('routing');
    }, 2200);

    setTimeout(() => {
      setSpawnedIP('10.10.14.35');
      setDeployLogs(prev => [...prev, "> SUCCESS: Security container cluster successfully provisioned!", "> Virtual Kali Linux OS fully initialized.", "> Direct tunneling IP assigned: 10.10.14.35"]);
      setDeployStatus('ready');
      triggerToast('Pwnbox Kali Linux instance successfully deployed!', 'success');
    }, 3500);
  };

  const handleTerminateInstance = () => {
    setDeployStatus('idle');
    setDeployLogs([]);
    setSpawnedIP('');
    triggerToast('Security sandbox container terminated cleanly.', 'info');
  };

  const selectedLab = labs.find(l => l.id === selectedLabId);

  return (
    <div className="space-y-6" id="labs-view-root">
      
      {/* Tab Header Banner */}
      {!selectedLabId ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Practical Training Laboratories</h1>
              <p className="text-sm text-slate-400">Apply your offensive/defensive commands in secure sandboxed simulators.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-[#111218] p-3 rounded-xl border border-white/5 text-sm font-semibold text-slate-300">
              <span className="font-mono text-brand-cyan">{userProgress.completedLabs.length} / 16</span>
              <span className="text-slate-500">|</span>
              <span className="text-xs text-slate-400">Total Complete</span>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-cyan rounded-full" style={{ width: `${(userProgress.completedLabs.length / 16) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* HACK THE BOX STYLE VIRTUAL INSTANCE CONTROLLER */}
          <div className="glass-panel border border-[#1e293b]/50 rounded-2xl p-6 relative overflow-hidden bg-[#111218] shadow-xl" id="htb-style-virtual-instance-controller">
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#9fef00] to-transparent"></div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="p-1 px-2.5 bg-[#9fef00]/10 border border-[#9fef00]/25 rounded text-[10px] text-[#9fef00] font-mono tracking-widest font-black uppercase">
                    Pwnbox Lab Instance
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                    Hacker Sandbox Workspace
                  </span>
                </div>
                <h2 className="text-lg font-black text-white leading-tight">Virtual Kali Linux Pwnbox Environment</h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  Deploy a self-contained, interactive cloud hacking instance fully loaded with security tools (Nmap, Metasploit, Burp Suite Proxy, custom scripts). Opens in a separate browser tab to mimic a real penetration testing station!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {deployStatus === 'idle' && (
                  <button 
                    onClick={handleDeployInstance}
                    className="relative cursor-pointer group bg-[#9fef00] hover:bg-[#8ed200] text-black font-extrabold px-6 py-3 rounded-xl border border-[#9fef00]/30 shadow-lg shadow-[#9fef00]/10 tracking-widest text-xs flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <Terminal className="w-4 h-4 shrink-0 text-black" />
                    <span>SPAWN ACADEMY INSTANCE</span>
                  </button>
                )}

                {(deployStatus === 'allocating' || deployStatus === 'routing') && (
                  <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl">
                    <span className="w-2.5 h-2.5 bg-[#9fef00] rounded-full inline-block animate-ping"></span>
                    <span className="text-xs text-[#9fef00] font-mono font-bold tracking-wider animate-pulse">ALLOCATING VIRTUAL RESOURCE CORES...</span>
                  </div>
                )}

                {deployStatus === 'ready' && (
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Glowing launch button */}
                    <button 
                      onClick={() => window.open(window.location.origin + '?view=kali', '_blank')}
                      className="cursor-pointer bg-brand-cyan hover:bg-brand-cyan/90 text-slate-950 font-black px-6 py-3 rounded-xl border border-brand-cyan/20 shadow-lg shadow-brand-cyan/25 text-xs tracking-wider uppercase flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                    >
                      <Play className="w-4 h-4 shrink-0 fill-current" />
                      <span>LAUNCH DESKTOP OS</span>
                    </button>
                    
                    <button 
                      onClick={handleTerminateInstance}
                      className="cursor-pointer bg-[#ea580c]/15 hover:bg-[#ea580c]/25 hover:text-white border border-[#ea580c]/30 text-[#ea580c] font-bold px-4 py-3 rounded-xl text-xs uppercase"
                    >
                      Terminate VM
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Container booting terminal micro logs output stream */}
            {deployLogs.length > 0 && (
              <div className="mt-4 p-3 bg-black/90 border border-slate-900 rounded-xl font-mono text-[10px] leading-relaxed text-[#9fef00]/90 space-y-1 overflow-y-auto max-h-24 selection:bg-[#9fef00]/20 select-text">
                {deployLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('SUCCESS') ? 'text-brand-cyan font-bold' : ''}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filters & Searching columns */}
          <div className="glass-panel border border-white/5 bg-[#111218]/50 p-5 rounded-2xl space-y-4" id="filters-container">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between" id="search-difficulty-row">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-lg">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  placeholder="Search labs by title, topic keywords, or objective..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#161720] border border-slate-800/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 transition-all font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-505 hover:text-white text-xs cursor-pointer focus:outline-none px-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Difficulty filter buttons */}
              <div className="flex flex-wrap items-center gap-2" id="difficulty-filter-group">
                <span className="text-[10px] uppercase font-bold text-slate-550 tracking-wider block lg:inline">Difficulty:</span>
                <div className="bg-[#161720] border border-slate-800/80 p-1 rounded-xl flex gap-1 items-center">
                  {[
                    { id: 'All', label: 'All', colorClass: 'text-white border-white/10' },
                    { id: 'Beginner', label: 'Beginner', colorClass: 'text-brand-emerald border-brand-emerald/20 bg-brand-emerald/5' },
                    { id: 'Intermediate', label: 'Intermediate', colorClass: 'text-brand-blue border-brand-blue/20 bg-brand-blue/5' },
                    { id: 'Advanced', label: 'Advanced', colorClass: 'text-brand-rose border-brand-rose/20 bg-brand-rose/5' }
                  ].map((diff) => {
                    const isActive = difficultyFilter === diff.id;
                    return (
                      <button
                        key={diff.id}
                        onClick={() => setDifficultyFilter(diff.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase text-[10px] cursor-pointer ${
                          isActive 
                            ? `${diff.colorClass} border font-bold shadow-lg shadow-black/20` 
                            : 'bg-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        {diff.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Topic/Category filters */}
            <div className="space-y-2" id="category-filter-group">
              <div className="flex items-center justify-between text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <span>Filter by course topic module:</span>
                {categoryFilter !== 'All' && (
                  <button onClick={() => setCategoryFilter('All')} className="text-brand-blue hover:underline cursor-pointer">
                    Clear Module Filter
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full select-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border tracking-wide transition-all cursor-pointer ${
                      categoryFilter === cat 
                        ? 'bg-brand-blue/15 border-brand-blue/30 text-brand-blue shadow-lg shadow-brand-blue/5 font-bold' 
                        : 'bg-[#161720]/50 border-slate-800/50 text-slate-400 hover:text-white hover:bg-[#161720] hover:border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter diagnostics count & reset */}
            {(categoryFilter !== 'All' || difficultyFilter !== 'All' || searchQuery) && (
              <div className="flex flex-wrap items-center justify-between pt-1 border-t border-slate-800/40 text-xs text-slate-400 gap-2">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand-blue animate-pulse" />
                  <span>Showing <strong>{filteredLabs.length}</strong> of <strong>{labs.length}</strong> laboratories matching active criteria</span>
                </div>
                <button 
                  onClick={() => {
                    setCategoryFilter('All');
                    setDifficultyFilter('All');
                    setSearchQuery('');
                  }}
                  className="text-brand-rose hover:text-brand-rose/80 font-bold uppercase text-[10px] tracking-wider cursor-pointer border border-brand-rose/20 bg-brand-rose/5 px-2.5 py-1 rounded-lg hover:bg-brand-rose/10 transition-all font-sans"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Grid list of labs */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="labs-cards-grid">
            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab) => {
                const isCompleted = userProgress.completedLabs.includes(lab.id);
                return (
                  <div 
                    key={lab.id}
                    className={`glass-panel glass-panel-hover rounded-2xl p-5 border relative flex flex-col justify-between space-y-4 hover:border-slate-700/60 transition-all ${
                      isCompleted ? 'border-brand-emerald/15 bg-slate-900/10' : 'border-white/5'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getDifficultyColor(lab.difficulty)}`}>
                          {lab.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">LAB {lab.id < 10 ? `0${lab.id}`: lab.id}</span>
                      </div>
                      
                      <div>
                        <h3 className="font-extrabold text-sm text-white line-clamp-1 hover:text-brand-blue transition-colors cursor-pointer" onClick={() => setSelectedLabId(lab.id)}>
                          {lab.title}
                        </h3>
                        <p className="text-[10px] text-brand-blue/80 font-medium tracking-wide mt-1 uppercase block">{lab.category}</p>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {lab.objective}
                      </p>
                    </div>

                    <div className="border-t border-slate-800/60 pt-4 flex justify-between items-center text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/15 px-2 py-0.5 rounded text-[10px] font-bold">
                        <Flame className="w-3.5 h-3.5" /> +{lab.xpReward} XP
                      </div>
                      
                      {isCompleted ? (
                        <div className="flex items-center gap-2">
                          {onResetLab && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to redeploy Lab ${lab.id} ("${lab.title}") for repractice? This will temporarily adjust your course XP.`)) {
                                  onResetLab(lab.id);
                                }
                              }}
                              className="px-2.5 py-1 bg-white/5 hover:bg-brand-rose/10 hover:text-brand-rose hover:border-brand-rose/25 text-slate-400 border border-transparent rounded-lg text-[9px] uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1"
                              title="Redeploy for Repractice"
                            >
                              <RefreshCw className="w-2.5 h-2.5 shrink-0" />
                              Redeploy
                            </button>
                          )}
                          <div className="flex items-center gap-1.5 text-brand-emerald font-semibold text-xs cursor-pointer" onClick={() => setSelectedLabId(lab.id)}>
                            <CheckCircle2 className="w-4 h-4" /> Lab Passed
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setSelectedLabId(lab.id)}
                          className="px-3.5 py-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold rounded-lg text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          Launch Lab <Play className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                No laboratories found with current filters config. Try altering your keywords.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* LEVEL 2: DETAILED LAB WORKBENCH SCREEN */
        selectedLab && (
          <div className="space-y-6" id="individual-lab-workbench">
            
            {/* Top Back and Nav buttons */}
            <div className="flex justify-between items-center">
              <button 
                onClick={() => { setSelectedLabId(null); setShowHint(null); }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Laboratory Registry
              </button>
              
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 uppercase">
                <span>Active Core Sandbox</span>
                <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full inline-block animate-pulse"></span>
              </div>
            </div>

            {/* Header elements */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getDifficultyColor(selectedLab.difficulty)}`}>
                    {selectedLab.difficulty}
                  </span>
                  <span className="text-xs text-slate-500 font-bold font-mono">LAB {selectedLab.id < 10 ? `0${selectedLab.id}` : selectedLab.id}</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-white">{selectedLab.title}</h1>
                <p className="text-xs text-brand-blue font-bold uppercase tracking-wide">{selectedLab.category}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="px-3.5 py-2.5 bg-[#161720] border border-brand-blue/15 rounded-xl flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-brand-emerald" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Lab XP Pool</span>
                    <span className="text-sm font-bold text-white block">+{selectedLab.xpReward} XP</span>
                  </div>
                </div>
                {userProgress.completedLabs.includes(selectedLab.id) ? (
                  <div className="flex items-center gap-2">
                    {onResetLab && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to redeploy Lab ${selectedLab.id} ("${selectedLab.title}")? This will reset your solved status and let you practice hacking it again.`)) {
                            onResetLab(selectedLab.id);
                          }
                        }}
                        className="px-4 py-2 bg-brand-rose/10 hover:bg-brand-rose/25 text-brand-rose border border-brand-rose/20 hover:border-brand-rose/40 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all text-center uppercase tracking-wider text-[10px]"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                        Redeploy for Repractice
                      </button>
                    )}
                    <span className="px-4 py-2 bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/20 rounded-xl font-bold text-xs flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Lab Completed
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {onResetLab && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to redeploy Lab ${selectedLab.id} ("${selectedLab.title}")? This resets intermediate simulator states.`)) {
                            onResetLab(selectedLab.id);
                          }
                        }}
                        className="px-4 py-2 bg-white/5 hover:bg-brand-rose/10 text-slate-400 hover:text-brand-rose border border-transparent hover:border-brand-rose/20 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all text-center uppercase tracking-wider text-[10px]"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                        Redeploy / Reset
                      </button>
                    )}
                    <span className="px-4 py-2 bg-slate-800/40 text-slate-400 border border-slate-700/50 rounded-xl font-bold text-xs">
                      Pending Validation
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Split view: Simulator and Instruction blocks */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left columns - Objectives, instructions, explain guides */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Visual Tab Switcher: Instructions vs Solution vs Reference */}
                <div className="flex bg-[#161720] border border-slate-800 p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      activeTab === 'instructions'
                        ? 'bg-brand-blue/10 border-brand-blue/30 text-white shadow shadow-black/35'
                        : 'text-slate-400 hover:text-white border-transparent'
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    Instructions
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('solution');
                      triggerToast("Opened solution workbook walkthrough.", "info");
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      activeTab === 'solution'
                        ? 'bg-brand-rose/10 border-brand-rose/30 text-brand-rose shadow shadow-black/35 font-extrabold'
                        : 'text-slate-400 hover:text-white border-transparent'
                    }`}
                  >
                    <Key className="w-3 h-3 text-brand-rose animate-pulse" />
                    Solution 🔑
                  </button>

                  <button
                    onClick={() => setActiveTab('theory')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      activeTab === 'theory'
                        ? 'bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald'
                        : 'text-slate-400 hover:text-white border-transparent'
                    }`}
                  >
                    <Info className="w-3 h-3" />
                    Theory
                  </button>
                </div>

                {/* TAB 1: INSTRUCTIONS & OBJECTIVE */}
                {activeTab === 'instructions' && (
                  <div className="space-y-4">
                    {/* Objective */}
                    <div className="glass-panel rounded-xl p-5 border border-white/5 space-y-2.5">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-brand-blue" /> Sandbox Objective
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed bg-[#161720] p-3 rounded-xl border border-white/5 font-medium">
                        {selectedLab.objective}
                      </p>
                    </div>

                    {/* Step sequential instructions list */}
                    <div className="glass-panel rounded-xl p-5 border border-white/5 space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Execution Instructions</h3>
                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {selectedLab.instructions.map((stepStr, sIdx) => (
                          <div key={sIdx} className="flex gap-3 text-xs text-slate-300 leading-normal bg-[#161720]/50 p-2.5 rounded-lg border border-white/5">
                            <span className="w-5.5 h-5.5 rounded-full shrink-0 flex items-center justify-center font-bold text-xs bg-brand-blue/15 text-brand-cyan border border-brand-blue/10">
                              {sIdx + 1}
                            </span>
                            <p className="pt-0.5">{stepStr}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CRISP ACTION SOLUTIONS */}
                {activeTab === 'solution' && (() => {
                  const solution = LAB_SOLUTIONS_MAP[selectedLab.id];
                  return (
                    <div className="space-y-4">
                      <div className="glass-panel border border-brand-rose/15 rounded-xl p-5 space-y-3 bg-[#130d12]/60">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-brand-rose flex items-center gap-1.5">
                          <Key className="w-4 h-4 text-brand-rose" />
                          Step-by-Step Walkthrough Solution
                        </h3>
                        
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                          Follow these targeted manual steps on either the visual simulator models or inside your deployed shell session to achieve immediate resolution:
                        </p>

                        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                          {solution ? (
                            solution.steps.map((step, sIdx) => (
                              <div key={sIdx} className="flex gap-3 text-xs text-slate-300 leading-normal bg-[#1a1219]/90 p-2.5 rounded-lg border border-brand-rose/10">
                                <span className="w-5.5 h-5.5 rounded-full shrink-0 flex items-center justify-center font-black text-xs bg-brand-rose/10 text-brand-rose border border-brand-rose/25">
                                  {sIdx + 1}
                                </span>
                                <p className="pt-0.5 font-sans">{step}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-500">Walkthrough loading...</p>
                          )}
                        </div>
                      </div>

                      {solution?.commandSolution && (
                        <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#161720] space-y-2">
                          <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                            <span>Cmd Cheat Sheet (Direct Input)</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(solution.commandSolution || '');
                                triggerToast("Copied command shortcut to your clipboard!", "success");
                              }}
                              className="text-brand-rose hover:text-white transition-all cursor-pointer flex items-center gap-1 font-sans font-bold text-[9px]"
                            >
                              <Copy className="w-3 h-3" /> COPY CODE
                            </button>
                          </div>
                          <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between font-mono text-[10px] text-[#9fef00]">
                            <span className="truncate">{solution.commandSolution}</span>
                          </div>
                        </div>
                      )}

                      <div className="glass-panel rounded-xl p-4 border border-brand-blue/15 bg-[#0c1424]/60 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shrink-0" />
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-black">Pedagogical Lab Guideline</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-normal font-sans">
                          For the best learning outcome, perform the highlighted interactive terminal and model commands outlined above to organically reveal the secret token in the simulator viewport. The correct key is formatted as <code className="text-brand-magenta font-mono font-bold bg-black/40 px-1 py-0.5 rounded text-[10px]">EV{"{"}...{"}"}</code>.
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* TAB 3: REFERENCE & THEORETICAL CONTEXT */}
                {activeTab === 'theory' && (
                  <div className="space-y-4">
                    {/* Explanation */}
                    <div className="glass-panel rounded-xl p-5 border border-white/5 space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security Theoretical Context</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {selectedLab.explanation}
                      </p>
                    </div>

                    {/* Hints dropdown */}
                    <div className="glass-panel rounded-xl p-4 border border-white/5">
                      <button 
                        onClick={() => setShowHint(showHint === selectedLab.id ? null : selectedLab.id)}
                        className="w-full text-left text-xs font-bold text-slate-400 hover:text-white flex justify-between items-center"
                      >
                        Need assistance? Inquire Lab Hint
                        <ChevronLeft className={`w-4 h-4 transition-transform ${showHint === selectedLab.id ? '-rotate-90' : 'rotate-180'}`} />
                      </button>
                      {showHint === selectedLab.id && (
                        <div className="mt-3 p-3 bg-brand-blue/5 border border-brand-blue/25 rounded-md text-[11px] text-brand-blue leading-relaxed font-semibold">
                          {selectedLab.hints[0]}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Right column - Simulator and Flag submissions */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Deploy Lab Instance Area */}
                <div className="glass-panel border border-[#9fef00]/15 rounded-xl p-6 space-y-4 bg-[#111218] relative overflow-hidden" id="pwnbox-lab-deployer-card">
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#9fef00] to-transparent"></div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-[#9fef00]/10 border border-[#9fef00]/25 rounded text-[10px] text-[#9fef00] font-mono tracking-widest font-black uppercase">
                        LAB {selectedLab.id < 10 ? `0${selectedLab.id}` : selectedLab.id} GATEWAY
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                        Dedicated Instance
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white leading-tight">Virtual Kali Linux Workstation</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Deploy and inspect a self-contained, cloud-hosted security environment tailored specifically for <b>{selectedLab.title}</b>. This virtual network features live mock target systems (IP: <span className="text-brand-cyan font-mono">10.10.10.123</span>) and standard tools.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/60 pt-4">
                    <button 
                      onClick={() => {
                        triggerToast(`Launching dedicated Pwnbox instance for Lab ${selectedLab.id}...`, 'success');
                        window.open(window.location.origin + `?view=kali&labId=${selectedLab.id}`, '_blank');
                      }}
                      className="cursor-pointer bg-[#9fef00] hover:bg-[#8ed200] text-black font-extrabold px-6 py-3 rounded-xl border border-[#9fef00]/30 shadow-lg shadow-[#9fef00]/10 text-xs tracking-widest uppercase flex items-center gap-2 transition-all transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                    >
                      <Terminal className="w-4 h-4 shrink-0 text-black animate-pulse" />
                      <span>DEPLOY INSTANCE</span>
                    </button>

                    <div className="flex flex-col text-[10px] font-mono text-slate-500">
                      <span>Target Node: 10.10.10.123</span>
                      <span>Tunnel CIDR: 10.10.14.0/24</span>
                    </div>
                  </div>
                </div>

                {/* Flag submissions validation block */}
                <div className="glass-panel border border-[#1e293b]/50 rounded-xl p-5 space-y-3 relative overflow-hidden bg-[#111218]">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue to-transparent"></div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Validate Laboratory Token</h4>
                      <p className="text-[10px] text-slate-400">Pasted flag parameters here to log records</p>
                    </div>
                    {userProgress.completedLabs.includes(selectedLab.id) && (
                      <span className="text-xs text-brand-emerald font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Lab Solved
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="EV{FLAG_DATA_ENCRYPTED_2026}"
                      value={flagInputs[selectedLab.id] || ''}
                      onChange={(e) => setFlagInputs({...flagInputs, [selectedLab.id]: e.target.value})}
                      disabled={userProgress.completedLabs.includes(selectedLab.id)}
                      className="flex-1 bg-[#161720] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                    />
                    <button 
                      onClick={() => handleFlagSubmit(selectedLab.id, selectedLab)}
                      disabled={userProgress.completedLabs.includes(selectedLab.id)}
                      className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-white rounded-xl text-xs uppercase tracking-wider shadow-md shadow-brand-blue/5 transition-colors cursor-pointer"
                    >
                      Authenticate
                    </button>
                  </div>

                  {userProgress.completedLabs.includes(selectedLab.id) && (
                    <div className="text-center pt-1.5 border-t border-slate-800/40">
                      <p className="text-[10px] text-slate-400">
                        This lab is solved. Want to practice again?{' '}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to redeploy Lab ${selectedLab.id} ("${selectedLab.title}")? This resets its solved status.`)) {
                              onResetLab?.(selectedLab.id);
                            }
                          }}
                          className="text-brand-rose hover:underline font-bold cursor-pointer bg-transparent border-none p-0 inline font-sans uppercase tracking-wider text-[9px]"
                        >
                          Redeploy and reset credentials status
                        </button>
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )
      )}
    </div>
  );
}
