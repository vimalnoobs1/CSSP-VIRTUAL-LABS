import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ShieldAlert, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Terminal, 
  Database,
  Search,
  Lock,
  Unlock,
  Sparkles,
  Award
} from 'lucide-react';
import { HackathonDay, LeaderboardUser, UserProgress } from '../types';
import { HACKATHON_DAYS, SIMULATED_LEADERBOARD } from '../data/hackathon';
import { motion } from 'motion/react';

interface HackathonViewProps {
  userProgress: UserProgress;
  onCompleteHackathonDay: (day: number, xpReward: number) => void;
  triggerToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function HackathonView({
  userProgress,
  onCompleteHackathonDay,
  triggerToast
}: HackathonViewProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [flagInput, setFlagInput] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  // DAY 1 SIMULATOR STATES
  const [whoisQuery, setWhoisQuery] = useState('');
  const [whoisResult, setWhoisResult] = useState('');

  // DAY 2 SIMULATOR STATES
  const [mysqlBind, setMysqlBind] = useState<'LAN' | 'WAN'>('WAN');
  const [redisBind, setRedisBind] = useState<'LAN' | 'WAN'>('WAN');
  const [portLog, setPortLog] = useState('');

  // DAY 3 SIMULATOR STATES
  const [base64Input, setBase64Input] = useState('RVZ7REFZXzNfTUFMV0FSRV9CVVNURUR9');
  const [decodedOutput, setDecodedOutput] = useState('');

  // DAY 4 SIMULATOR STATES
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [reportLog, setReportLog] = useState('');

  // Synchronize or update leaderboard dynamically based on current user XP
  useEffect(() => {
    const updatedLeaderboard = SIMULATED_LEADERBOARD.map(user => {
      if (user.isCurrentUser) {
        return { ...user, xp: userProgress.xp, name: `${userProgress.username} (You)` };
      }
      return user;
    }).sort((a, b) => b.xp - a.xp);

    // Re-calculate ranks in sorted order
    const finalLeaderboard = updatedLeaderboard.map((user, idx) => ({
      ...user,
      rank: idx + 1
    }));
    
    setLeaderboard(finalLeaderboard);
  }, [userProgress.xp, userProgress.username]);

  const activeDayData = HACKATHON_DAYS.find(d => d.day === selectedDay)!;

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFlag = flagInput.trim();

    if (!cleanFlag) {
      triggerToast('Please input a flag to resolve this challenge.', 'info');
      return;
    }

    if (cleanFlag === activeDayData.flag) {
      if (userProgress.completedHackathonDays.includes(selectedDay)) {
        triggerToast('You have already validated this hackathon day!', 'info');
        return;
      }
      onCompleteHackathonDay(selectedDay, activeDayData.xpReward);
      triggerToast(`Day ${selectedDay} Secured! Earned +${activeDayData.xpReward} XP!`, 'success');
      setFlagInput('');
    } else {
      triggerToast('Passcode invalid. Re-evaluate simulation variables.', 'error');
    }
  };

  // Day 1: Whois query handler
  const handleWhoisQuery = () => {
    if (whoisQuery.trim() === '198.51.100.42') {
      setWhoisResult(
        `[WHOIS DECRYPT] IP Address: 198.51.100.42\n` +
        `OrgName:\tGhostProtocol Operations Lab\n` +
        `Ref:\t\thttps://whois.arin.net/rest/net/NET-198-51-100-0\n` +
        `RiskLevel:\tHighly Malicious Client\n` +
        `REGISTRY_TOKEN:\tEV{HACK_DAY_1_RECON}`
      );
      // Autofill flag input
      setFlagInput('EV{HACK_DAY_1_RECON}');
    } else {
      setWhoisResult("❌ Unknown client IP block. Check logs for the IP address attempting admin loggings.");
    }
  };

  // Day 2: Port rules handler
  const handlePortPatch = () => {
    if (mysqlBind === 'LAN' && redisBind === 'LAN') {
      setPortLog(
        `✔ Perimeter Shield validation matches.\n` +
        `✔ Port 3306 (MySQL): Bound to localhost (127.0.0.1)\n` +
        `✔ Port 6379 (Redis): Isolated internally.\n` +
        `COMPLIANCE FLAG: EV{DAY_2_PORT_SHIELD}`
      );
      setFlagInput('EV{DAY_2_PORT_SHIELD}');
    } else {
      setPortLog("❌ Warning: Database sockets remain exposed to WAN Public interface. Attackers can brute force root ports. Change WAN bindings to LAN Only.");
    }
  };

  // Day 3: Decoder handler
  const handleBase64Decode = () => {
    if (base64Input.trim() === 'RVZ7REFZXzNfTUFMV0FSRV9CVVNURUR9') {
      setDecodedOutput(
        "PowerShell decoded variables:\n" +
        "$RemoteHostIP = \"203.0.113.88\";\n" +
        "$DecryptToken = \"EV{DAY_3_MALWARE_BUSTED}\";\n" +
        "Write-Output \"C2 Handshake Complete.\""
      );
      setFlagInput('EV{DAY_3_MALWARE_BUSTED}');
    } else {
      setDecodedOutput("Base64 string format unrecognized or corrupt. Reset code strings.");
    }
  };

  // Day 4: Post-Mortem grader
  const handlePostMortemSubmit = () => {
    if (q1 === 'weak' && q2 === 'mfa') {
      setReportLog(
        "✔ Synthesis Report Accepted by Board of Directors.\n" +
        "✔ CVSS score mapped at 9.8 (Prior to mitigation).\n" +
        "✔ Remediations complete. Infrastructure locked down.\n" +
        "HACKATHON CAPSTONE PASS TOKEN: EV{DAY_4_SHIELD_COMPLETED}"
      );
      setFlagInput('EV{DAY_4_SHIELD_COMPLETED}');
    } else {
      setReportLog("❌ Compliance validation rejected. Check answers. Password weakness was the root, and MFA remains the highest defense priority.");
    }
  };

  const completedCount = userProgress.completedHackathonDays.length;

  return (
    <div className="space-y-8 p-1 lg:p-4" id="hackathon-portal-panel">
      
      {/* Header Splash banner */}
      <div className="rounded-2xl glass-panel border border-brand-violet/15 p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden" id="hackathon-banner">
        <div className="absolute right-0 top-0 w-96 h-full bg-linear-to-l from-brand-violet/10 to-transparent pointer-events-none"></div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-violet uppercase tracking-widest block">Active Tournament Challenge</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Apex Solutions Incident Response</h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Apex Solutions, a high-tech manufacturer, is suffering an acute cyber intrusion by APT threat actors. As the designated incident hander, you must investigate logs, isolate systems, audit malware, and draft mitigations.
          </p>
        </div>

        <div className="bg-[#1c142b] border border-brand-violet/20 px-4 py-3.5 rounded-xl text-center shrink-0 min-w-[200px]">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Hackathon Progress</span>
          <span className="text-2xl font-black text-white block mt-0.5">{completedCount} <span className="text-sm font-normal text-slate-500">of 4 Days</span></span>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-brand-violet rounded-full" style={{ width: `${(completedCount / 4) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Grid split: Workspaces on left, simulated leaderboard on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 columns - Workbenches */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chronological Day Picker tabs */}
          <div className="grid grid-cols-4 gap-2.5" id="hackathon-tabs">
            {[1, 2, 3, 4].map((dayNum) => {
              const isDone = userProgress.completedHackathonDays.includes(dayNum);
              const isSelected = selectedDay === dayNum;
              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`py-3 px-1 rounded-xl text-xs font-bold uppercase transition-all border flex flex-col justify-center items-center gap-1.5 cursor-pointer relative ${
                    isSelected 
                      ? 'bg-brand-violet/10 border-brand-violet/35 text-white bg-linear-to-b from-[#1b122c] to-transparent shadow-md shadow-brand-violet/5' 
                      : isDone
                      ? 'border-brand-emerald/15 bg-transparent text-slate-400'
                      : 'border-slate-800 bg-transparent text-slate-500 hover:text-slate-350'
                  }`}
                  id={`hackathon-day-btn-${dayNum}`}
                >
                  <span>Day {dayNum}</span>
                  {isDone ? (
                    <span className="text-[9px] text-brand-emerald font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Secured
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-normal">Pending</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Workstation Content */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-5" id="hackathon-main-workspace">
            <div>
              <span className="text-[10px] text-brand-violet bg-brand-violet/10 px-2.5 py-0.5 rounded-md font-bold tracking-wider uppercase border border-brand-violet/10 inline-block mb-1.5">
                Objective {selectedDay} of 4
              </span>
              <h2 className="text-xl font-extrabold text-white">{activeDayData.title}</h2>
              <p className="text-xs text-slate-400 font-mono tracking-normal mt-1 block">Scenario: {activeDayData.scenario}</p>
            </div>

            {/* Dynamic Day Simulators renderers */}
            <div className="p-5 bg-[#101422]/90 border border-slate-800 rounded-xl space-y-4">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Interactive Hackathon Simulator Sandbox</span>

              {/* Day 1: Logs analysis */}
              {selectedDay === 1 && (
                <div className="space-y-4">
                  <div className="bg-[#04060c] border border-slate-800 rounded-lg p-3 h-44 overflow-y-auto font-mono text-[10px] leading-relaxed text-slate-400 space-y-1">
                    <div className="text-slate-600 font-bold">// Apex Solutions Web Proxy Logs (Extract for 09/Jun/2026)</div>
                    <div>192.168.1.12 - - [09/Jun/2026:12:12:44] "GET /index.html HTTP/1.1" 200 4012</div>
                    <div>192.168.1.15 - - [09/Jun/2026:12:13:01] "GET /src/main.js HTTP/1.1" 200 1259</div>
                    <div className="text-brand-rose font-semibold bg-brand-rose/5 p-1 rounded">
                      ➔ [ALERT] 198.51.100.42 - - [09/Jun/2026:12:13:10] "POST /admin/login.php HTTP/1.1" 401 102
                    </div>
                    <div className="text-brand-rose font-semibold bg-brand-rose/5 p-1 rounded">
                      ➔ [ALERT] 198.51.100.42 - - [09/Jun/2026:12:13:12] "POST /admin/login.php HTTP/1.1" 401 98
                    </div>
                    <div className="text-brand-rose font-semibold bg-brand-rose/5 p-1 rounded">
                      ➔ [ALERT] 198.51.100.42 - - [09/Jun/2026:12:13:15] "POST /admin/login.php HTTP/1.1" 200 512
                    </div>
                    <div>192.168.1.45 - - [09/Jun/2026:12:14:02] "GET /dashboard.html HTTP/1.1" 200 4820</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-slate-300 block font-bold">Query Whois on Intrusion Scanner's IP</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="e.g. 198.51.100.42" 
                        value={whoisQuery}
                        onChange={(e) => setWhoisQuery(e.target.value)}
                        className="flex-1 bg-[#111624] border border-slate-800 rounded-xl px-3 py-1.5 font-mono text-xs text-white placeholder-slate-600 focus:outline-none"
                      />
                      <button 
                        onClick={handleWhoisQuery}
                        className="bg-brand-violet text-white text-xs font-bold px-4 rounded-xl cursor-pointer"
                      >
                        RUN WHOIS
                      </button>
                    </div>
                  </div>

                  {whoisResult && (
                    <pre className="p-3 bg-[#04060c] border border-slate-800 rounded-lg text-[10px] font-mono text-brand-emerald leading-relaxed whitespace-pre-wrap">
                      {whoisResult}
                    </pre>
                  )}
                </div>
              )}

              {/* Day 2: Ports bindings */}
              {selectedDay === 2 && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-300 leading-normal mb-3">
                    Change network socket rules configuration to bind internal databases entirely inside secure Localhost LAN loop schemes.
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between p-3 bg-[#111624] border border-slate-800 rounded-xl">
                      <div>
                        <span className="font-bold text-white block">Port 3306 (MySQL Socket)</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Current Scope: Bound publicly on WAN</span>
                      </div>
                      <div className="flex gap-1.5 text-[10px]">
                        <button onClick={() => setMysqlBind('WAN')} className={`px-2 py-1 rounded font-bold ${mysqlBind === 'WAN' ? 'bg-brand-rose text-white':'bg-slate-800 text-slate-400'}`}>WAN (Public)</button>
                        <button onClick={() => setMysqlBind('LAN')} className={`px-2 py-1 rounded font-bold ${mysqlBind === 'LAN' ? 'bg-brand-emerald text-slate-950':'bg-slate-800 text-slate-400'}`}>LAN (Secure)</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#111624] border border-slate-800 rounded-xl">
                      <div>
                        <span className="font-bold text-white block">Port 6379 (Redis Socket)</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Current Scope: Bound publicly on WAN</span>
                      </div>
                      <div className="flex gap-1.5 text-[10px]">
                        <button onClick={() => setRedisBind('WAN')} className={`px-2 py-1 rounded font-bold ${redisBind === 'WAN' ? 'bg-brand-rose text-white':'bg-slate-800 text-slate-400'}`}>WAN (Public)</button>
                        <button onClick={() => setRedisBind('LAN')} className={`px-2 py-1 rounded font-bold ${redisBind === 'LAN' ? 'bg-brand-emerald text-slate-950':'bg-slate-800 text-slate-400'}`}>LAN (Secure)</button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handlePortPatch}
                    className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white font-bold py-2 rounded-xl text-xs uppercase cursor-pointer"
                  >
                    Commit Security Patches
                  </button>

                  {portLog && (
                    <pre className="p-3 bg-[#04060d] border border-slate-800 rounded-lg text-[10px] font-mono text-brand-emerald leading-relaxed whitespace-pre-wrap">
                      {portLog}
                    </pre>
                  )}
                </div>
              )}

              {/* Day 3: PowerShell Script analyzer */}
              {selectedDay === 3 && (
                <div className="space-y-4">
                  <div className="bg-[#04060c] border border-slate-800 p-3 rounded-lg text-[10px] font-mono text-slate-400 leading-normal select-all">
                    <div className="text-slate-600">// extracted malware block payroll_audit.ps1</div>
                    <div>Powershell -NoProfile -ExecutionPolicy Bypass -Command {"{"}</div>
                    <div className="pl-4">$Base64EncodedPayload = "<strong>RVZ7REFZXzNfTUFMV0FSRV9CVVNURUR9</strong>"</div>
                    <div className="pl-4">$Decompressed = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Base64EncodedPayload))</div>
                    <div className="pl-4">Invoke-Expression $Decompressed</div>
                    <div>{"}"}</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-slate-300 block font-bold">Base64 Decrypter Portal</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={base64Input}
                        onChange={(e) => setBase64Input(e.target.value)}
                        className="flex-1 bg-[#111624] border border-slate-800 rounded-xl px-3 py-1.5 font-mono text-xs text-white"
                      />
                      <button 
                        onClick={handleBase64Decode}
                        className="bg-brand-violet text-white text-xs font-bold px-4 rounded-xl cursor-pointer"
                      >
                        DECODE BASE64
                      </button>
                    </div>
                  </div>

                  {decodedOutput && (
                    <pre className="p-3 bg-[#04060c] border border-slate-800 rounded-lg text-[10px] font-mono text-brand-emerald leading-relaxed whitespace-pre-wrap">
                      {decodedOutput}
                    </pre>
                  )}
                </div>
              )}

              {/* Day 4: Post-Mortem questions */}
              {selectedDay === 4 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 block text-xs font-bold">1. What was the root administrative entry vector?</label>
                      <select 
                        value={q1} 
                        onChange={(e) => setQ1(e.target.value)}
                        className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="">-- Choose Access Point --</option>
                        <option value="packet_leak">Routing Packet leakage on ISP networks</option>
                        <option value="weak">Administrative login using Weak Password (EV2026/dictionary)</option>
                        <option value="apk">Malicious Mobile APK Trojan upload</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 block text-xs font-bold">2. What mitigation yields the highest security posture boost here?</label>
                      <select 
                        value={q2} 
                        onChange={(e) => setQ2(e.target.value)}
                        className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="">-- Choose Priority Remediation --</option>
                        <option value="mfa">Enforcing globally mandatory MFA + unique rotated keys</option>
                        <option value="dns">Re-resolving DNS domain TXT properties</option>
                        <option value="chmod">Running chmod 777 on configuration directories</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handlePostMortemSubmit}
                    className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white font-bold py-2 rounded-xl text-xs uppercase cursor-pointer"
                  >
                    Grade Post-Mortem Compilation
                  </button>

                  {reportLog && (
                    <pre className="p-3 bg-[#04060c] border border-slate-800 rounded-lg text-[10px] font-mono text-brand-emerald leading-relaxed whitespace-pre-wrap">
                      {reportLog}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Steps & Guidelines instructions */}
            <div className="space-y-2 text-xs text-slate-300">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Procedural Checklist</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {activeDayData.steps.map((pStep, index) => (
                  <div key={index} className="p-2.5 bg-[#111623]/60 rounded-xl border border-white/5 flex gap-2.5">
                    <span className="font-bold text-brand-violet shrink-0">0{index + 1}.</span>
                    <span>{pStep}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation input form */}
            <form onSubmit={handleFlagSubmit} className="pt-4 border-t border-slate-850 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Log Hackathon Day {selectedDay} Passcode Token</h4>
                  <p className="text-[10px] text-slate-500">Submit decrypted flag payload to resolve scores</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Worth +{activeDayData.xpReward} XP</span>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="EV{HACK_DAY_x_...}"
                  disabled={userProgress.completedHackathonDays.includes(selectedDay)}
                  className="flex-1 bg-[#111624] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-brand-violet"
                />
                <button 
                  type="submit"
                  disabled={userProgress.completedHackathonDays.includes(selectedDay)}
                  className="bg-brand-violet hover:bg-brand-violet/90 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs px-6 py-2 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                >
                  SECURE DAY
                </button>
              </div>
            </form>

          </div>

          {/* completion rewards showcase footer */}
          <div className="p-4 rounded-xl border border-brand-violet/15 bg-[#17112a]/30 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-brand-violet" />
              <span>Complete all 4 Days of Hackathon to unlock the legendary <strong className="text-brand-violet">Hackathon Conqueror</strong> digital badge.</span>
            </div>
          </div>

        </div>

        {/* Right column - Simulated Realtime Leaderboard */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Top Students</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium font-mono uppercase">Cohort 2026</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[480px]">
              {leaderboard.map((user) => (
                <div 
                  key={user.rank}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 relative transition-all ${
                    user.isCurrentUser 
                      ? 'bg-brand-violet/10 border-brand-violet/30 shadow-md shadow-brand-violet/5' 
                      : 'bg-[#111624]/60 border-white/5'
                  }`}
                  id={`leaderboard-user-${user.rank}`}
                >
                  {/* Left rank and details */}
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-xs font-bold text-center ${
                      user.rank === 1 ? 'text-yellow-400 font-extrabold text-sm':
                      user.rank === 2 ? 'text-slate-300':
                      user.rank === 3 ? 'text-amber-600': 'text-slate-550'
                    }`}>
                      #{user.rank}
                    </span>
                    
                    {/* Avatar block */}
                    <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center font-bold text-xs text-white border ${
                      user.isCurrentUser 
                        ? 'bg-brand-violet/20 border-brand-violet/30 text-brand-violet' 
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
                    }`}>
                      {user.avatar}
                    </div>

                    <div>
                      <span className={`text-xs font-bold block ${user.isCurrentUser ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-cyan font-extrabold':'text-slate-300'}`}>
                        {user.name}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-brand-emerald': user.status === 'idle' ? 'bg-amber-500' : 'bg-slate-600'}`}></span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">{user.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-white font-mono block">{user.xp} <span className="text-[10px] text-slate-500 font-normal">XP</span></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-[10px] text-slate-500 font-medium border-t border-white/5 pt-3">
              Rankings recalculate dynamically as sandbox parameters validation feeds live XP streams.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
