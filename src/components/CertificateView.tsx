import { useState, useEffect } from 'react';
import { 
  Award, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Download 
} from 'lucide-react';
import { UserProgress } from '../types';
import { motion } from 'motion/react';

interface CertificateViewProps {
  userProgress: UserProgress;
  triggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function CertificateView({
  userProgress,
  triggerToast
}: CertificateViewProps) {
  const [certName, setCertName] = useState(userProgress.username);
  const [completionDate, setCompletionDate] = useState(userProgress.joinDate || 'June 09, 2026');

  useEffect(() => {
    setCertName(userProgress.username);
  }, [userProgress.username]);

  useEffect(() => {
    setCompletionDate(userProgress.joinDate || 'June 09, 2026');
  }, [userProgress.joinDate]);

  const totalLabs = 16;
  const isEligible = userProgress.completedLabs.length >= totalLabs;

  const handlePrint = () => {
    if (!isEligible) {
      triggerToast('Assessment parameters incomplete. You must solve all 16 practical labs to graduate with credentials.', 'error');
      return;
    }
    
    // Simple custom print logic
    triggerToast('Preparing certificate layouts for print stream export...', 'info');
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  return (
    <div className="space-y-8" id="certificate-page-panel">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Academic Certifications</h1>
          <p className="text-sm text-slate-400">Graduate from the starter program and claim your accredited credentials certificate.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column Configuration */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Graduation Parameters</h3>

            <div className="space-y-4">
              {/* eligibility check */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Eligibility check</span>
                {isEligible ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-xs text-brand-emerald font-bold">
                    <CheckCircle2 className="w-4.5 h-4.5" /> Eligible to Claim
                  </span>
                ) : (
                  <div className="p-3 bg-brand-rose/10 border border-brand-rose/15 rounded-xl text-xs text-brand-rose space-y-1.5">
                    <span className="font-bold flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 shrink-0" /> Ineligible</span>
                    <p className="text-[11px] leading-normal opacity-90">Verify all 16 practical laboratories to unlock the generator. Currently completed: <strong className="underline">{userProgress.completedLabs.length} of 16</strong>.</p>
                  </div>
                )}
              </div>

              {/* Dynamic Name Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-bold block">Student Display Name</label>
                <input 
                  type="text" 
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  disabled={!isEligible}
                  className="w-full bg-[#111624] border border-slate-800 disabled:opacity-40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue"
                  placeholder="Student Name"
                />
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-bold block">Completion Date</label>
                <input 
                  type="text" 
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  disabled={!isEligible}
                  className="w-full bg-[#111624] border border-slate-800 disabled:opacity-40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue"
                  placeholder="Date e.g. June 09, 2026"
                />
              </div>
            </div>

            {/* Print and Export Buttons */}
            <button 
              onClick={handlePrint}
              disabled={!isEligible}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-white text-xs uppercase cursor-pointer tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/5 transition-colors"
              id="print-certificate-trigger"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
          </div>

          <div className="p-4 bg-brand-cyan/5 border border-brand-cyan/15 rounded-xl text-[10px] text-slate-400 space-y-1">
            <h4 className="font-bold text-slate-200">Print Instructions:</h4>
            <p>1. Tap the print button above.</p>
            <p>2. Select "Save as PDF" as destination in prompt.</p>
            <p>3. Toggle "Background graphics" ON inside printing checklist layout to capture dark premium styles safely.</p>
          </div>
        </div>

        {/* Certificate preview wrapper */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Certificate Layout Preview</span>
            {isEligible && (
              <span className="text-brand-emerald font-bold flex items-center gap-1.5 animate-pulse"><Sparkles className="w-4 h-4" /> Graduate accredited</span>
            )}
          </div>

          {/* Core Certificate CSS Graphic panel */}
          <div className="relative overflow-hidden w-full" id="certificate-print-area">
            {/* Aspect container for standard A4 landscape proportions */}
            <div className="w-full border-12 border-[#162035] bg-[#070b14] relative text-center p-8 lg:p-14 select-none flex flex-col justify-between h-[450px] lg:h-[550px] rounded-3xl" id="inner-certificate-frame">
              {/* Complex Vector watermarks */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none"></div>
              
              {/* Outer double borders */}
              <div className="absolute inset-4 border border-[#e2b95c]/25 rounded-2xl pointer-events-none"></div>
              <div className="absolute inset-5 border-2 border-[#e2b95c]/10 rounded-xl pointer-events-none"></div>

              {/* Gold Crest Ribbon and Header */}
              <div className="space-y-3 relative z-10">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-br from-[#e2b95c]/20 to-[#e2b95c]/5 border border-[#e2b95c]/30 rounded-full text-[#e2b95c]">
                    <Award className="w-8 h-8 stroke-[1.5]" />
                  </div>
                </div>
                <span className="text-[10px] lg:text-xs font-black uppercase text-[#e2b95c] tracking-[0.25em] block">
                  EV CYBER ACADEMY CERTIFICATION
                </span>
                <span className="text-slate-500 font-serif italic text-xs lg:text-sm block">This accredited seal represents verified proficiency:</span>
              </div>

              {/* Dynamic Name and Body */}
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl lg:text-5xl font-black text-white font-sans tracking-tight leading-none px-4 max-w-full truncate py-1" id="cert-pdf-student-name">
                  {certName || "Vimal R"}
                </h2>
                
                <div className="max-w-lg mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#e2b95c]/40 to-transparent"></div>
                
                <p className="text-xs lg:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed px-4">
                  has satisfactorily solved all practical, offensive, and defensive curriculum security laboratories, confirming master status within the capstone scope and graduating with honor from the
                </p>
                <h3 className="text-sm lg:text-base font-extrabold text-[#e2b95c] uppercase tracking-wider block">
                  Cyber Security Starter Program 2026
                </h3>
              </div>

              {/* Footer signatures and seals */}
              <div className="flex justify-between items-end px-4 lg:px-12 relative z-10 pt-4" id="cert-footer-grid">
                {/* Authority Left */}
                <div className="text-left w-24 lg:w-40">
                  <div className="font-cursive text-brand-cyan text-sm lg:text-lg mb-1 italic font-semibold border-b border-slate-800 pb-1 text-center">
                    Vimal.R
                  </div>
                  <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-center">
                    ADVISOR LEAD
                  </span>
                </div>

                {/* Seal Center */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border border-[#e2b95c]/35 flex items-center justify-center bg-[#131b2c] shadow shadow-[#e2b95c]/10">
                    <ShieldCheck className="w-7 h-7 text-[#e2b95c]" />
                  </div>
                  <span className="text-[9px] font-mono text-[#e2b95c] uppercase mt-2 font-bold tracking-wider">VERIFIED SECURITY</span>
                </div>

                {/* Date Right */}
                <div className="text-right w-24 lg:w-40">
                  <div className="font-mono text-white text-xs lg:text-sm mb-1 font-bold border-b border-slate-800 pb-1 text-center">
                    {completionDate || "June 09, 2026"}
                  </div>
                  <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-center">
                    DATE GRANTED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded non-visible css specifically for print overlays. Removes sidebar and buttons */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          /* Hide surrounding layout elements completely */
          #side-bar-navigation,
          #mobile-top-header,
          #login-container,
          #certificate-page-panel > div:first-child,
          .lg\\:col-span-1 {
            display: none !important;
          }
          #certificate-page-panel {
            grid-template-columns: 1fr !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .lg\\:col-span-3 {
            grid-column: span 4 / span 4 !important;
          }
          #certificate-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          #inner-certificate-frame {
            border: none !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
