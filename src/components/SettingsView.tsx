import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Database, 
  Info, 
  Lock 
} from 'lucide-react';
import { UserProgress } from '../types';
import { motion } from 'motion/react';

interface SettingsViewProps {
  userProgress: UserProgress;
  onUpdateUser: (newName: string, newEmail: string) => void;
  onImportProgress: (importedJson: string) => void;
  onResetProgress: () => void;
  triggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function SettingsView({
  userProgress,
  onUpdateUser,
  onImportProgress,
  onResetProgress,
  triggerToast
}: SettingsViewProps) {
  const [nameInput, setNameInput] = useState(userProgress.username);
  const [emailInput, setEmailInput] = useState(userProgress.email);
  const [importString, setImportString] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) {
      triggerToast('Display name and corporate registration email cannot be left blank.', 'error');
      return;
    }
    onUpdateUser(nameInput.trim(), emailInput.trim());
    triggerToast('Student academic dossier successfully updated!', 'success');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(userProgress, null, 2);
    // Copy to clipboard
    navigator.clipboard.writeText(dataStr)
      .then(() => {
        triggerToast('Dossier progress string successfully copied to clipboard!', 'success');
      })
      .catch(() => {
        triggerToast('Clipboard copy failed. Try copying manually.', 'error');
      });
  };

  const handleImport = () => {
    const trimmedImport = importString.trim();
    if (!trimmedImport) {
      triggerToast('Please supply a serialized JSON string to restore progress.', 'info');
      return;
    }

    try {
      const parsed = JSON.parse(trimmedImport);
      if (parsed && typeof parsed === 'object' && 'xp' in parsed && 'completedLabs' in parsed) {
        onImportProgress(trimmedImport);
        triggerToast('Dossier progress successfully restored!', 'success');
        setImportString('');
      } else {
        triggerToast('JSON schema invalid. Please provide an authentic EV dossier backup string.', 'error');
      }
    } catch {
      triggerToast('JSON decryption failed. Ensure characters match exact backup strings.', 'error');
    }
  };

  const handleResetConfirm = () => {
    onResetProgress();
    setShowConfirmReset(false);
    triggerToast('All dossier files and local credentials successfully wiped.', 'info');
  };

  return (
    <div className="space-y-8 p-1 lg:p-4" id="settings-view-root">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Security Portal Settings</h1>
        <p className="text-sm text-slate-400">Configure credentials, back up academic history dossier records, or reset terminal caches.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Account and profile dossier modification */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-brand-blue" /> Dossier Enrollment Details
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Display Student Name</label>
                <input 
                  type="text" 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                  placeholder="Student Name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Email Registration Address</label>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                  placeholder="Email Address"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Theme locking / selection configurations */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-brand-cyan" /> Secure Portal Skins
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="theme-selectors">
              <div className="p-4 bg-brand-blue/15 border-2 border-brand-blue rounded-xl relative select-none">
                <div className="absolute right-2.5 top-2.5 p-0.5 bg-brand-blue text-white rounded">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-xs text-white block">Corporate Midnight</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">High-contrast dark slate skin</span>
              </div>

              <div className="p-4 bg-[#111522]/40 border border-slate-800/80 rounded-xl relative opacity-55">
                <div className="absolute right-2.5 top-2.5 text-slate-600">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-xs text-slate-500 block">Matrix Terminal</span>
                <span className="text-[10px] text-slate-600 block mt-0.5">Unauthorized. Standard lock active.</span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-normal">
              Theme switching is restricted by system guidelines to ensure consistent enterprise training layouts of the Cyber Security Starter Program 2026.
            </p>
          </div>
        </div>

        {/* Backups and resets parameters */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-brand-emerald" /> Backup Dossier Portability
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-[#111624] border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Export Current Dossier</h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Generate and copy progress data to migrate variables to other browsers.</p>
                </div>
                <button 
                  onClick={handleExport}
                  className="bg-[#1c2a3e] hover:bg-[#253954] text-brand-blue border border-brand-blue/20 font-bold text-xs uppercase px-3.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>

              <hr className="border-slate-850" />

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Restore Dossier Backup</h4>
                <textarea 
                  value={importString}
                  onChange={(e) => setImportString(e.target.value)}
                  placeholder="Paste verified backup JSON string here as provided..."
                  className="w-full bg-[#111624] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-brand-blue h-16"
                />
                <button 
                  onClick={handleImport}
                  className="w-full bg-brand-emerald/10 hover:bg-brand-emerald/15 border border-brand-emerald/20 text-brand-emerald font-bold text-xs uppercase py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" /> Restore Progress
                </button>
              </div>
            </div>
          </div>

          {/* Destructive Action block */}
          <div className="glass-panel border border-[#3b1c21]/40 bg-[#1c0e11]/25 rounded-2xl p-6 space-y-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-full bg-linear-to-l from-brand-rose/5 to-transparent pointer-events-none"></div>
            
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-rose flex items-center gap-2">
                <RotateCcw className="w-4.5 h-4.5 text-brand-rose" /> Diagnostics Hazard: Wipe Dossier
              </h3>
              <p className="text-xs text-slate-350 leading-relaxed">
                Clearing progress deletes all completed laboratories flags, homework checklists and achievements cached in localStorage. Recovery is impossible without export code strings.
              </p>
            </div>

            {!showConfirmReset ? (
              <button 
                onClick={() => setShowConfirmReset(true)}
                className="bg-brand-rose/10 hover:bg-brand-rose/15 border border-brand-rose/25 text-brand-rose text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Reset Dossier Records
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-[#241315]/80 p-3.5 border border-brand-rose/30 rounded-xl" id="reset-confirm-box">
                <Info className="w-5 h-5 text-brand-rose shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] text-white block uppercase font-bold">Are you absolutely sure?</span>
                  <div className="flex gap-2.5 mt-2">
                    <button onClick={handleResetConfirm} className="bg-brand-rose font-bold text-xs text-white px-3 py-1 rounded-lg">Yes, Wipe</button>
                    <button onClick={() => setShowConfirmReset(false)} className="bg-slate-800 text-xs text-slate-300 px-3 py-1 rounded-lg">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
