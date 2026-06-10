import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  Search, 
  MapPin, 
  Send, 
  Lock, 
  Unlock, 
  Database, 
  Mail, 
  AlertTriangle, 
  FileCode, 
  Cpu, 
  Bug,
  Shield,
  FileCheck
} from 'lucide-react';


interface SimulatorProps {
  labId: number;
  onSuccess: (flag: string) => void;
  savedState?: any;
}

// Global shared helper for supporting full suite of original Linux standard utility commands
function getCommonLinuxCommandResponse(cmd: string, arg?: string, cmdLine?: string): string | null {
  const normalizedCmd = cmd.toLowerCase();
  switch (normalizedCmd) {
    case 'whoami':
      return 'vimal_r';
    case 'id':
      return 'uid=1000(vimal_r) gid=1000(vimal_r) groups=1000(vimal_r),4(adm),27(sudo)';
    case 'uname':
      return 'Linux AcademyOS 5.15.0-generic #2026-Ubuntu SMP x86_64 x86_64 GNU/Linux';
    case 'date':
      return new Date().toUTCString();
    case 'echo': {
      if (cmdLine) {
        const echoMatch = cmdLine.match(/^echo\s+(.*)$/i);
        if (echoMatch && echoMatch[1]) {
          return echoMatch[1].replace(/['"]/g, '');
        }
      }
      return arg || '';
    }
    case 'df':
      return 'Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/sda1       41251136 8452100  32799036  21% /';
    case 'free':
      return '               total        used        free      shared  buff/cache   available\nMem:         8167812     1251200     4125890       45000     2790722     6512300\nSwap:        2097148           0     2097148';
    case 'uptime': {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      return `${timeStr} up 3 days, 4:12, 1 user, load average: 0.12, 0.08, 0.05`;
    }
    case 'ps':
      return '  PID TTY          TIME CMD\n 2511 pts/0    00:00:00 sh\n 2523 pts/0    00:00:01 academy-cli';
    case 'w': {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      return ` ${timeStr} up 3 days,  4:12,  1 user,  load average: 0.12, 0.08, 0.05\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\nvimal_r  pts/0    10.0.2.2         08:00    0.00s  0.11s  0.02s w`;
    }
    case 'history':
      return '    1  ls\n    2  pwd\n    3  help\n    4  whoami\n    5  uname -a\n    6  id';
    default:
      return null;
  }
}


export default function LabSimulators({ labId, onSuccess }: SimulatorProps) {
  switch (labId) {
    case 1:
      return <TerminalSimulator onSuccess={onSuccess} />;
    case 2:
      return <LinuxNavigationSimulator onSuccess={onSuccess} />;
    case 3:
      return <LinuxPermissionsSimulator onSuccess={onSuccess} />;
    case 4:
      return <NetworkInvestigationSimulator onSuccess={onSuccess} />;
    case 5:
      return <DNSSimulator onSuccess={onSuccess} />;
    case 6:
      return <PacketJourneySimulator onSuccess={onSuccess} />;
    case 7:
      return <HttpSnifferSimulator onSuccess={onSuccess} />;
    case 8:
      return <PortScannerSimulator onSuccess={onSuccess} />;
    case 9:
      return <WebDevToolsSimulator onSuccess={onSuccess} />;
    case 10:
      return <CookieInvestigationSimulator onSuccess={onSuccess} />;
    case 11:
      return <PasswordSecuritySimulator onSuccess={onSuccess} />;
    case 12:
      return <PhishingDetectorSimulator onSuccess={onSuccess} />;
    case 13:
      return <MobileApkSimulator onSuccess={onSuccess} />;
    case 14:
      return <ReconWorkflowSimulator onSuccess={onSuccess} />;
    case 15:
      return <VulnerabilityReportingSimulator onSuccess={onSuccess} />;
    case 16:
      return <FinalCapstoneSimulator onSuccess={onSuccess} />;
    default:
      return (
        <div className="p-6 text-center text-slate-500">
          No simulator available for this Lab. Check your credentials.
        </div>
      );
  }
}

// -----------------------------------------------------------------
// LAB 01: TERMINAL FUNDAMENTALS
// -----------------------------------------------------------------
function TerminalSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [history, setHistory] = useState<string[]>([
    "EV Cyber Academy POSIX Shell v1.0.26",
    "Type 'help' to view available operations.",
    ""
  ]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/');
  const [createdDirs, setCreatedDirs] = useState<string[]>([]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmdLine = input.trim();
    const parts = cmdLine.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    let response = '';

    setHistory((prev) => [...prev, `${currentDir} $ ${cmdLine}`]);

    // Check for general standard Linux utilities
    const commonResp = getCommonLinuxCommandResponse(cmd, arg, cmdLine);
    if (commonResp !== null) {
      setHistory((prev) => [...prev, commonResp, ""]);
      setInput('');
      return;
    }

    switch (cmd) {
      case 'help':
        response = "Available Commands: help, pwd, ls, cd [dir], mkdir [dir], cat [file], clear, whoami, id, uname, date, df, free, uptime, ps, w, echo";
        break;
      case 'pwd':
        response = currentDir;
        break;
      case 'ls': {
        const isLongFormat = arg && (arg.startsWith('-lh') || arg.startsWith('-l') || arg === '-la');
        if (currentDir === '/') {
          if (isLongFormat) {
            response = `total 16\ndrwxr-xr-x 2 root root 4096 Jun 10 08:00 etc/\ndrwxr-xr-x 2 root root 4096 Jun 10 08:00 var/\ndrwxr-xr-x 2 root root 4096 Jun 10 08:00 home/${createdDirs.includes('training') ? '\ndrwxr-xr-x 2 vimal_r vimal_r 4096 Jun 10 08:05 training/' : ''}`;
          } else {
            response = `etc/   var/   home/   ${createdDirs.includes('training') ? 'training/' : ''}`;
          }
        } else if (currentDir === '/training') {
          if (isLongFormat) {
            response = `total 4\n-rw-r--r-- 1 vimal_r vimal_r 24 Jun 10 08:05 flag.txt`;
          } else {
            response = "flag.txt";
          }
        } else {
          response = isLongFormat ? "total 0" : "(empty directory)";
        }
        break;
      }
      case 'mkdir':
        if (!arg) {
          response = "mkdir: missing operand (e.g. 'mkdir training')";
        } else if (arg === 'training') {
          if (createdDirs.includes('training')) {
            response = "mkdir: cannot create directory 'training': File exists";
          } else {
            setCreatedDirs([...createdDirs, 'training']);
            response = "Directory 'training' successfully created.";
          }
        } else {
          response = `mkdir: permissions restricted to make folder '${arg}'`;
        }
        break;
      case 'cd':
        if (!arg || arg === '/') {
          setCurrentDir('/');
        } else if (arg === 'training') {
          if (createdDirs.includes('training') && currentDir === '/') {
            setCurrentDir('/training');
            response = "Navigated to /training";
          } else {
            response = "cd: training: No such file or directory";
          }
        } else if (arg === '..') {
          if (currentDir === '/training') {
            setCurrentDir('/');
            response = "Navigated to /";
          } else {
            response = "cd: already at root";
          }
        } else {
          response = `cd: can't enter '${arg}' due to access locks`;
        }
        break;
      case 'cat':
        if (!arg) {
          response = "cat: specify target file (e.g. 'cat flag.txt')";
        } else if (arg === 'flag.txt' && currentDir === '/training') {
          response = "Flag retrieved: EV{TERMINAL_MASTER}";
          onSuccess("EV{TERMINAL_MASTER}");
        } else {
          response = `cat: ${arg}: No such file or directory in this folder`;
        }
        break;
      default:
        response = `sh: command not recognized: '${cmd}'. Try typing 'help' to see allowed variables.`;
    }

    setHistory((prev) => [...prev, response, ""]);
    setInput('');
  };

  return (
    <div className="bg-[#04060b] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs text-brand-emerald">
      <div className="bg-[#121622] px-4 py-2 border-b border-slate-800 flex justify-between items-center text-slate-400">
        <span className="flex items-center gap-2"><Terminal className="w-4 h-4 text-brand-blue" /> POSIX Interactive Workspace</span>
        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Port 3000</span>
      </div>
      <div className="p-4 space-y-2.5 h-64 overflow-y-auto" id="cli-history">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="bg-[#050912] p-2 border-t border-slate-800 flex items-center">
        <span className="text-brand-blue mr-2 font-bold">{currentDir} $</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent text-white focus:outline-none flex-1 font-mono"
          placeholder="Type command here (e.g. 'help')..."
          autoFocus
        />
      </form>
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 02: LINUX NAVIGATION CHALLENGE
// -----------------------------------------------------------------
function LinuxNavigationSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [history, setHistory] = useState<string[]>([
    "Apex Cyber Navigation Console v1.0",
    "Goal: Find hidden security logs in deep administrative root pools.",
    "Type 'ls' and start exploring your folder directories.",
    ""
  ]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmdLine = input.trim();
    const parts = cmdLine.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    let response = '';
    setHistory((prev) => [...prev, `${currentDir} $ ${cmdLine}`]);

    // Check for general standard Linux utilities
    const commonResp = getCommonLinuxCommandResponse(cmd, arg, cmdLine);
    if (commonResp !== null) {
      setHistory((prev) => [...prev, commonResp, ""]);
      setInput('');
      return;
    }

    switch (cmd) {
      case 'help':
        response = "Allowed commands: pwd, ls, cd [dir], cat [file], help, clear, whoami, id, uname, date, df, free, uptime, ps, w, echo";
        break;
      case 'pwd':
        response = currentDir;
        break;
      case 'ls': {
        const isLongFormat = arg && (arg.startsWith('-lh') || arg.startsWith('-l') || arg === '-la');
        if (currentDir === '/') {
          if (isLongFormat) {
            response = "total 20\ndrwxr-xr-x 2 root root 4096 Jun 10 08:00 home/\ndrwxr-xr-x 2 root root 4096 Jun 10 08:00 etc/\ndrwxr-xr-x 2 root root 4096 Jun 10 08:00 var/\n-r-------- 1 root root  512 Jun 10 08:00 root_sys.log";
          } else {
            response = "home/   etc/   var/   root_sys.log";
          }
        } else if (currentDir === '/home') {
          if (isLongFormat) {
            response = "total 12\ndrwxr-xr-x 2 guest_user guest_user 4096 Jun 10 08:00 guest_user/\ndrwxr-xr-x 2 instructor instructor 4096 Jun 10 08:00 instructor/\ndrwxr-xr-x 2 advisor    advisor    4096 Jun 10 08:00 academic_advisor/";
          } else {
            response = "guest_user/   instructor/   academic_advisor/";
          }
        } else if (currentDir === '/home/instructor') {
          if (isLongFormat) {
            response = "total 12\n-rw-r--r-- 1 instructor instructor  128 Jun 10 08:00 notes.txt\n-rw-r--r-- 1 instructor instructor 1024 Jun 10 08:00 syllabus_draft.pdf\n-rw------- 1 instructor instructor 2048 Jun 10 08:00 auth_priv_rsa.key";
          } else {
            response = "notes.txt   syllabus_draft.pdf   auth_priv_rsa.key";
          }
        } else {
          response = isLongFormat ? "total 0" : "(empty directory)";
        }
        break;
      }
      case 'cd':
        if (!arg || arg === '/') {
          setCurrentDir('/');
        } else if (arg === 'home' && currentDir === '/') {
          setCurrentDir('/home');
          response = "Changed to /home";
        } else if (arg === 'instructor' && currentDir === '/home') {
          setCurrentDir('/home/instructor');
          response = "Changed to /home/instructor. Secure directory resolved. Navigation confirmed.";
        } else if (arg === '..' && currentDir === '/home/instructor') {
          setCurrentDir('/home');
          response = "Changed to /home";
        } else if (arg === '..' && currentDir === '/home') {
          setCurrentDir('/');
          response = "Changed to /";
        } else {
          response = `Access restriction: Can't parse navigation to '${arg}' directly from current depth.`;
        }
        break;
      case 'cat':
        if (!arg) {
          response = "cat: specify file name (e.g. 'cat notes.txt')";
        } else if (arg === 'notes.txt' && currentDir === '/home/instructor') {
          response = "LOG DECRYPTED:\nTopic: Training Note Backup\nID: Cyber Starters 2026\nFLAG VALUE: EV{LINUX_NAVIGATOR}\nEncryption Mode: Static AES-256";
          onSuccess("EV{LINUX_NAVIGATOR}");
        } else if (arg === 'root_sys.log' && currentDir === '/') {
          response = "ERROR: ACCESS DENIED. Action logged to administrative audit tables.";
        } else {
          response = `cat: file parsing failed for '${arg}'. File does not exist here.`;
        }
        break;
      default:
        response = `Navigation shell cannot recognize '${cmd}'. Type 'ls' or 'help'.`;
    }

    setHistory((prev) => [...prev, response, ""]);
    setInput('');
  };

  return (
    <div className="bg-[#04060b] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs text-brand-cyan">
      <div className="bg-[#121622] px-4 py-2 border-b border-slate-800 flex justify-between items-center text-slate-400">
        <span className="flex items-center gap-2"><Search className="w-4 h-4 text-brand-cyan" /> Secure Directory Navigator</span>
        <span className="text-[10px] text-slate-500">Paths explorer</span>
      </div>
      <div className="p-4 space-y-2 h-64 overflow-y-auto">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="bg-[#050912] p-2 border-t border-slate-800 flex items-center">
        <span className="text-brand-cyan mr-2 font-bold">{currentDir} $</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent text-white focus:outline-none flex-1 font-mono"
          placeholder="Explore... (try 'ls' or 'cd home')"
        />
      </form>
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 03: LINUX PERMISSIONS
// -----------------------------------------------------------------
function LinuxPermissionsSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [owner, setOwner] = useState({ r: false, w: false, x: false });
  const [group, setGroup] = useState({ r: false, w: false, x: false });
  const [other, setOther] = useState({ r: false, w: false, x: false });
  const [consoleLog, setConsoleLog] = useState<string[]>(["Auditing security file 'run_backup.sh'..."]);

  const calculateOctal = () => {
    const calcDigit = (perms: {r: boolean, w: boolean, x: boolean}) => {
      let digit = 0;
      if (perms.r) digit += 4;
      if (perms.w) digit += 2;
      if (perms.x) digit += 1;
      return digit;
    };
    return `${calcDigit(owner)}${calcDigit(group)}${calcDigit(other)}`;
  };

  const getSymbolic = () => {
    const calcSym = (perms: {r: boolean, w: boolean, x: boolean}) => {
      return `${perms.r ? 'r' : '-'}${perms.w ? 'w' : '-'}${perms.x ? 'x' : '-'}`;
    };
    return `-${calcSym(owner)}${calcSym(group)}${calcSym(other)}`;
  };

  const executeBackup = () => {
    const oVal = (owner.r ? 4:0) + (owner.w ? 2:0) + (owner.x ? 1:0);
    const gVal = (group.r ? 4:0) + (group.w ? 2:0) + (group.x ? 1:0);
    const otVal = (other.r ? 4:0) + (other.w ? 2:0) + (other.x ? 1:0);

    const octal = `${oVal}${gVal}${otVal}`;

    setConsoleLog((prev) => [...prev, `[AUDIT] Running execution test with permissions: ${getSymbolic()} (${octal})`]);

    if (octal === '700' || octal === '755') {
      setTimeout(() => {
        setConsoleLog((prev) => [
          ...prev, 
          "✅ [SUCCESS] run_backup.sh executed with root containment security parameters.",
          "ACCESS LOG REVEALED FLAG: EV{PERMISSION_MASTER}"
        ]);
        onSuccess("EV{PERMISSION_MASTER}");
      }, 800);
    } else if (oVal < 5) {
      setConsoleLog((prev) => [...prev, "❌ we: Permission Denied. Owner must have Read & Execute privileges (5 or 7)."]);
    } else {
      setConsoleLog((prev) => [...prev, "❌ Security Breach Warning! File is overly permissive to external network domains. Ensure Group (Middle) and Others (Right) do NOT hold write permissions to block credential leakage."]);
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-5">
      <div className="text-center">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Interactive Permissions Configurator</h4>
        <p className="text-xs text-slate-400">Map flags to run secure administrative backup hooks.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Owner */}
        <div className="p-3 bg-[#111622] rounded-xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-brand-blue uppercase">Owner (User)</span>
          <div className="flex flex-col gap-1.5 pt-1.5 items-center">
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={owner.r} onChange={(e) => setOwner({...owner, r: e.target.checked})} className="accent-brand-blue" />
              <span>Read (4)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={owner.w} onChange={(e) => setOwner({...owner, w: e.target.checked})} className="accent-brand-blue" />
              <span>Write (2)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={owner.x} onChange={(e) => setOwner({...owner, x: e.target.checked})} className="accent-brand-blue" />
              <span>Execute (1)</span>
            </label>
          </div>
        </div>

        {/* Group */}
        <div className="p-3 bg-[#111622] rounded-xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-brand-cyan uppercase">Corporate Group</span>
          <div className="flex flex-col gap-1.5 pt-1.5 items-center">
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={group.r} onChange={(e) => setGroup({...group, r: e.target.checked})} className="accent-brand-cyan" />
              <span>Read (4)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={group.w} onChange={(e) => setGroup({...group, w: e.target.checked})} className="accent-brand-cyan" />
              <span>Write (2)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={group.x} onChange={(e) => setGroup({...group, x: e.target.checked})} className="accent-brand-cyan" />
              <span>Execute (1)</span>
            </label>
          </div>
        </div>

        {/* Others */}
        <div className="p-3 bg-[#111622] rounded-xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-brand-rose uppercase">World/Others</span>
          <div className="flex flex-col gap-1.5 pt-1.5 items-center">
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={other.r} onChange={(e) => setOther({...other, r: e.target.checked})} className="accent-brand-rose" />
              <span>Read (4)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={other.w} onChange={(e) => setOther({...other, w: e.target.checked})} className="accent-brand-rose" />
              <span>Write (2)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={other.x} onChange={(e) => setOther({...other, x: e.target.checked})} className="accent-brand-rose" />
              <span>Execute (1)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="p-3 bg-[#121623] rounded-xl border border-white/5 flex justify-between items-center text-sm font-mono text-center">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Symbolic String</span>
          <span className="text-brand-cyan font-bold block">{getSymbolic()}</span>
        </div>
        <div className="h-6 w-[1px] bg-slate-800"></div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Octal Code</span>
          <span className="text-brand-blue font-bold block">{calculateOctal()}</span>
        </div>
      </div>

      <button 
        onClick={executeBackup}
        className="w-full bg-[#1e293b] hover:bg-[#334155] border border-slate-700 font-bold py-2 px-4 rounded-xl text-xs text-white tracking-wider uppercase transition-colors"
      >
        Run Diagnostics Check
      </button>

      <div className="bg-[#04060c] border border-slate-800 rounded-xl p-3 h-28 overflow-y-auto text-[10px] font-mono text-slate-400 space-y-1">
        {consoleLog.map((log, idx) => (
          <div key={idx} className="leading-relaxed">{log}</div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 04: NETWORK INVESTIGATION
// -----------------------------------------------------------------
function NetworkInvestigationSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [ans3, setAns3] = useState('');
  const [result, setResult] = useState('');

  const runTriage = () => {
    if (ans1 === '192.168.1.45' && ans2 === '192.168.1.1' && ans3 === '8.8.8.8') {
      setResult("Topology matches perfectly! Triage confirms address validation mapping. Flag Resolved: EV{NETWORK_ANALYST}");
      onSuccess("EV{NETWORK_ANALYST}");
    } else {
      setResult("❌ Topology audit failed. Check details: Local private address, corporate router default gateways (.1) and public DNS (Google).");
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="p-3 bg-[#111522] rounded-xl border border-white/5 space-y-3 font-mono text-xs">
        <span className="text-[10px] text-brand-blue block uppercase font-sans font-bold">Network Core Diagnostics</span>
        <div className="space-y-1.5 text-slate-400">
          <div>• Host Node A: <strong className="text-white">192.168.1.45</strong> (Mainframe client)</div>
          <div>• Server Node B: <strong className="text-white">8.8.8.8</strong> (Global Registry)</div>
          <div>• Device Node C: <strong className="text-white">10.0.0.1</strong> (Virtual interface)</div>
          <div>• Interface Node D: <strong className="text-white">192.168.1.1</strong> (Edge Gateway router)</div>
        </div>
      </div>

      <div className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">1. Identify the Private LAN Client IP</label>
          <select 
            value={ans1} 
            onChange={(e) => setAns1(e.target.value)} 
            className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="">-- Choose IP --</option>
            <option value="192.168.1.45">192.168.1.45</option>
            <option value="8.8.8.8">8.8.8.8</option>
            <option value="10.0.0.1">10.0.0.1</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">2. Identify the Default LAN Gateway Router</label>
          <select 
            value={ans2} 
            onChange={(e) => setAns2(e.target.value)} 
            className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="">-- Choose Gateway --</option>
            <option value="192.168.1.1">192.168.1.1</option>
            <option value="8.8.8.8">8.8.8.8</option>
            <option value="10.0.0.1">10.0.0.1</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">3. Identify Public DNS resolver</label>
          <select 
            value={ans3} 
            onChange={(e) => setAns3(e.target.value)} 
            className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="">-- Choose Resolver --</option>
            <option value="192.168.1.45">192.168.1.45</option>
            <option value="8.8.8.8">8.8.8.8</option>
            <option value="192.168.1.1">192.168.1.1</option>
          </select>
        </div>
      </div>

      <button 
        onClick={runTriage}
        className="w-full bg-brand-blue hover:bg-brand-blue/90 border border-brand-blue/50 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
      >
        Submit Diagnostic Topology
      </button>

      {result && (
        <div className="p-3 bg-[#111622] rounded-xl border border-white/5 text-[10px] font-mono leading-relaxed text-brand-emerald">
          {result}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 05: DNS INVESTIGATOR
// -----------------------------------------------------------------
function DNSSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [domain, setDomain] = useState('evcyberacademy.org');
  const [recordType, setRecordType] = useState('A');
  const [results, setResults] = useState<string>('');

  const triggerQuery = () => {
    let output = '';
    if (domain !== 'evcyberacademy.org') {
      output = `Server: 8.8.8.8\nNon-authoritative answer:\n*** 8.8.8.8 can't find ${domain}: Non-existent registry domain`;
    } else {
      if (recordType === 'A') {
        output = `Domain: evcyberacademy.org\nRecord Type: A (IPv4 Address)\n\nName:\tevcyberacademy.org\nAddress:\t104.22.4.112\nTTL:\t300 SEC`;
      } else if (recordType === 'MX') {
        output = `Domain: evcyberacademy.org\nRecord Type: MX (Mail Exchange)\n\nPriority:\t10\tmail.evcyberacademy.org\nPriority:\t20\tbackup.evcyberacademy.org\nTTL:\t3600 SEC`;
      } else if (recordType === 'TXT') {
        output = `Domain: evcyberacademy.org\nRecord Type: TXT (Text values)\n\nContent:\t"v=spf1 include:_spf.google.com ~all"\nContent:\t"google-site-verification=mXN912aBC28"\nContent:\t"verification-flag=EV{DNS_HUNTER}"\nTTL:\t1800 SEC`;
        onSuccess("EV{DNS_HUNTER}");
      }
    }
    setResults(output);
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] text-slate-300 block font-bold uppercase tracking-wide">Target Domain</label>
          <input 
            type="text" 
            value={domain} 
            onChange={(e) => setDomain(e.target.value)} 
            className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-300 block font-bold uppercase tracking-wide">Record</label>
          <select 
            value={recordType} 
            onChange={(e) => setRecordType(e.target.value)} 
            className="bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
          >
            <option value="A">A</option>
            <option value="MX">MX</option>
            <option value="TXT">TXT</option>
          </select>
        </div>
      </div>

      <button 
        onClick={triggerQuery}
        className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-slate-950 font-bold py-2 rounded-xl text-xs"
      >
        NSLOOKUP QUERY
      </button>

      <div className="bg-[#04060c] border border-slate-800 rounded-xl p-4 h-44 overflow-y-auto font-mono text-xs text-brand-cyan">
        {results ? (
          <div className="whitespace-pre-line leading-relaxed">{results}</div>
        ) : (
          <span className="text-slate-600 block text-center mt-12">Submit nslookup records check to query DNS servers.</span>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 06: INTERNET JOURNEY
// -----------------------------------------------------------------
function PacketJourneySimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [resolved, setResolved] = useState(false);
  const [step, setStep] = useState(0); // 0=start, 1=DNS, 2=Router, 3=ISP, 4=Server
  const [logs, setLogs] = useState<string[]>(["Core packet system online. Pending DNS target root resolving..."]);

  const resolveDns = () => {
    setResolved(true);
    setLogs((prev) => [...prev, "✔ DNS resolved domain 'evcyberacademy.org' to WAN destination mapping 104.22.4.112."]);
    setStep(1);
  };

  const transmitRequest = () => {
    if (!resolved) {
      setLogs((prev) => [...prev, "❌ ERROR: Cannot route packets to un-resolved alpha name domains."]);
      return;
    }

    setStep(2);
    setLogs((prev) => [...prev, "⚡ Initiating TCP packet travel on port 80... [Sending client headers]"]);
    
    setTimeout(() => {
      setStep(3);
      setLogs((prev) => [...prev, "➔ Packet reached Local Gateway 192.168.1.1. Network Address Translation (NAT) applied safely."]);
    }, 1000);

    setTimeout(() => {
      setStep(4);
      setLogs((prev) => [...prev, "➔ Tracing ISP transit logs. Forwarded to Cloudflare server endpoint 104.22.4.112."]);
    }, 2000);

    setTimeout(() => {
      setStep(5);
      setLogs((prev) => [
        ...prev, 
        "✔ TCP Handshake Complete. STATUS: 200 OK arrived at server.",
        "SECURE FLAG DECRYPTED: EV{PACKET_TRACER}"
      ]);
      onSuccess("EV{PACKET_TRACER}");
    }, 3000);
  };

  const resetSim = () => {
    setResolved(false);
    setStep(0);
    setLogs(["Core system reset. Ready for packet tracking diagnostics."]);
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex justify-between gap-3">
        <button 
          onClick={resolveDns} 
          disabled={resolved}
          className="flex-1 bg-[#1e293b] hover:bg-[#334155] disabled:opacity-40 text-white font-bold py-2 rounded-xl text-xs uppercase"
        >
          Resolve DNS
        </button>
        <button 
          onClick={transmitRequest}
          className="flex-1 bg-brand-emerald hover:bg-brand-emerald/95 text-slate-950 font-bold py-2 rounded-xl text-xs uppercase"
        >
          Send HTTP Request
        </button>
        <button 
          onClick={resetSim}
          className="p-2 border border-slate-800 hover:bg-white/5 rounded-xl text-slate-400"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Visual map nodes */}
      <div className="grid grid-cols-5 gap-1.5 text-center bg-[#111624] p-3 rounded-xl border border-white/5 py-5 overflow-x-auto text-[10px]">
        <div className={`p-1.5 rounded-lg border ${step >= 0 ? 'bg-brand-blue/15 border-brand-blue/30 text-white font-bold':'bg-slate-900 border-slate-800 text-slate-500'}`}>
          <Cpu className="w-5 h-5 mx-auto mb-1 text-brand-blue" /> Client Device
        </div>
        <div className={`p-1.5 rounded-lg border ${step >= 2 ? 'bg-brand-cyan/15 border-brand-cyan/30 text-white font-bold':'bg-slate-900 border-slate-800 text-slate-500'}`}>
          <Send className="w-5 h-5 mx-auto mb-1 text-brand-cyan" /> Local Gateway
        </div>
        <div className={`p-1.5 rounded-lg border ${step >= 3 ? 'bg-brand-violet/15 border-brand-violet/30 text-white font-bold':'bg-slate-900 border-slate-800 text-slate-500'}`}>
          <MapPin className="w-5 h-5 mx-auto mb-1 text-brand-violet" /> ISP Grid
        </div>
        <div className={`p-1.5 rounded-lg border ${resolved ? 'bg-yellow-500/15 border-yellow-500/30 text-white font-bold':'bg-slate-900 border-slate-800 text-slate-500'}`}>
          <Search className="w-5 h-5 mx-auto mb-1 text-yellow-500" /> DNS Server
        </div>
        <div className={`p-1.5 rounded-lg border ${step >= 5 ? 'bg-brand-emerald/15 border-brand-emerald/30 text-white font-bold':'bg-slate-900 border-slate-800 text-slate-500'}`}>
          <Database className="w-5 h-5 mx-auto mb-1 text-brand-emerald" /> Target Host
        </div>
      </div>

      <div className="bg-[#04060c] border border-slate-800 rounded-xl p-3 h-32 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1">
        {logs.map((log, lIdx) => (
          <div key={lIdx}>{log}</div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 07: HTTP VS HTTPS
// -----------------------------------------------------------------
function HttpSnifferSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [activeChannel, setActiveChannel] = useState<'http' | 'https'>('http');
  const [questionAns, setQuestionAns] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const checkReportAnswers = () => {
    if (questionAns === 'http') {
      setLogs([
        "✔ Vulnerability Audit Pass!",
        "Explanation: Port 80 cleartext protocol is easily sniffed on local hotspots. Placing websites under TLS is standard validation.",
        "FLAG REVEALED: EV{WEB_FOUNDATION}"
      ]);
      onSuccess("EV{WEB_FOUNDATION}");
    } else {
      setLogs(["❌ Diagnostic mismatch. Audit indicates unencrypted HTTP leads directly to sniffing risk vectors."]);
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex border-b border-slate-800 pb-2">
        <button 
          onClick={() => setActiveChannel('http')}
          className={`flex-1 py-1 text-xs font-bold uppercase ${activeChannel === 'http'? 'text-brand-rose border-b border-brand-rose':'text-slate-500'}`}
        >
          Channel A: HTTP (Port 80)
        </button>
        <button 
          onClick={() => setActiveChannel('https')}
          className={`flex-1 py-1 text-xs font-bold uppercase ${activeChannel === 'https'? 'text-brand-blue border-b border-brand-blue':'text-slate-500'}`}
        >
          Channel B: HTTPS (Port 443)
        </button>
      </div>

      <div className="bg-[#04060c] border border-slate-800 rounded-xl p-4 h-40 overflow-y-auto font-mono text-[11px] leading-relaxed">
        {activeChannel === 'http' ? (
          <div className="text-slate-300 space-y-2">
            <span className="text-brand-rose font-bold block">// PLAIN TEXT UNPROTECTED TRANSMISSION:</span>
            <div>GET /admin/login.php HTTP/1.1</div>
            <div>Host: client.local</div>
            <div>Authorization-Payload: <strong className="text-brand-rose underline">username=academy_admin&pass=EV_Secure_2026</strong></div>
            <div>Cookie: session_id=81ac902d8f99e32a</div>
          </div>
        ) : (
          <div className="text-brand-blue space-y-2">
            <span className="font-bold block">// TLS-ENCRYPTED SECURE TRANSIT HANDSHAKE:</span>
            <div>0000: 16 03 01 02 00 01 00 01 fc 03 03 f1 d7 3e a3 89</div>
            <div>0010: a0 f7 fa 0d 96 bc be b4 db 55 c6 71 85 e1 aa 1b</div>
            <div>0020: [ENCRYPTED GIBBERISH DATA BLOCKS: AES_256_GCM]</div>
            <div>Payload: xX8F91a9BC800fa99bf7ac88cd20f...</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">Which protocol transmits plain secret parameters (sniffable)?</label>
        <select 
          value={questionAns}
          onChange={(e) => setQuestionAns(e.target.value)}
          className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        >
          <option value="">-- Choose Protocol --</option>
          <option value="http">Cleartext HTTP (Port 80)</option>
          <option value="https">Encrypted HTTPS (Port 443)</option>
        </select>
      </div>

      <button 
        onClick={checkReportAnswers}
        className="w-full bg-[#1e293b] hover:bg-[#334155] text-white py-2 rounded-xl text-xs font-bold transition-colors"
      >
        Submit Assessment Check
      </button>

      {logs.length > 0 && (
        <div className="p-3 bg-[#111622] rounded-xl border border-white/5 font-mono text-[10px] leading-relaxed text-brand-emerald space-y-1">
          {logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 08: PORTS AND SERVICES
// -----------------------------------------------------------------
function PortScannerSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [inputs, setInputs] = useState({
    p21: '',
    p22: '',
    p53: '',
    p80: '',
    p443: ''
  });
  const [status, setStatus] = useState('');

  const submitMapping = () => {
    if (
      inputs.p21 === 'FTP' &&
      inputs.p22 === 'SSH' &&
      inputs.p53 === 'DNS' &&
      inputs.p80 === 'HTTP' &&
      inputs.p443 === 'HTTPS'
    ) {
      setStatus("SUCCESS: All port registries matched correctly. Flag generated: EV{PORT_SCANNER}");
      onSuccess("EV{PORT_SCANNER}");
    } else {
      setStatus("❌ Mismatch detected. Remember: FTP=21, SSH=22, DNS=53, HTTP=80, HTTPS=443.");
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="text-center text-xs text-slate-400">
        Assign services to their appropriate TCP/UDP well-known sockets.
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between bg-[#111624] p-2 px-3 border border-slate-800 rounded-xl">
          <span className="font-mono text-xs text-brand-blue font-bold">Port 21:</span>
          <select 
            value={inputs.p21} 
            onChange={(e) => setInputs({...inputs, p21: e.target.value})}
            className="bg-[#0b0f19] border border-slate-800 rounded px-2 py-1 text-xs text-white"
          >
            <option value="">Choose Service</option>
            <option value="FTP">FTP (File Transfer)</option>
            <option value="SSH">SSH (Secure Shell)</option>
            <option value="DNS">DNS (Domain system)</option>
          </select>
        </div>

        <div className="flex items-center justify-between bg-[#111624] p-2 px-3 border border-slate-800 rounded-xl">
          <span className="font-mono text-xs text-brand-blue font-bold">Port 22:</span>
          <select 
            value={inputs.p22} 
            onChange={(e) => setInputs({...inputs, p22: e.target.value})}
            className="bg-[#0b0f19] border border-slate-800 rounded px-2 py-1 text-xs text-white"
          >
            <option value="">Choose Service</option>
            <option value="SSH">SSH (Secure Shell)</option>
            <option value="HTTP">HTTP (Web)</option>
            <option value="FTP">FTP (File Transfer)</option>
          </select>
        </div>

        <div className="flex items-center justify-between bg-[#111624] p-2 px-3 border border-slate-800 rounded-xl">
          <span className="font-mono text-xs text-brand-blue font-bold">Port 53:</span>
          <select 
            value={inputs.p53} 
            onChange={(e) => setInputs({...inputs, p53: e.target.value})}
            className="bg-[#0b0f19] border border-slate-800 rounded px-2 py-1 text-xs text-white"
          >
            <option value="">Choose Service</option>
            <option value="DNS">DNS (Domain Resolver)</option>
            <option value="HTTPS">HTTPS (Secured Web)</option>
            <option value="SSH">SSH (Secure Shell)</option>
          </select>
        </div>

        <div className="flex items-center justify-between bg-[#111624] p-2 px-3 border border-slate-800 rounded-xl">
          <span className="font-mono text-xs text-brand-blue font-bold">Port 80:</span>
          <select 
            value={inputs.p80} 
            onChange={(e) => setInputs({...inputs, p80: e.target.value})}
            className="bg-[#0b0f19] border border-slate-800 rounded px-2 py-1 text-xs text-white"
          >
            <option value="">Choose Service</option>
            <option value="HTTP">HTTP (Unencrypted Web)</option>
            <option value="HTTPS">HTTPS (Encrypted Web)</option>
            <option value="DNS">DNS (Resolver)</option>
          </select>
        </div>

        <div className="flex items-center justify-between bg-[#111624] p-2 px-3 border border-slate-800 rounded-xl">
          <span className="font-mono text-xs text-brand-blue font-bold">Port 443:</span>
          <select 
            value={inputs.p443} 
            onChange={(e) => setInputs({...inputs, p443: e.target.value})}
            className="bg-[#0b0f19] border border-slate-800 rounded px-2 py-1 text-xs text-white"
          >
            <option value="">Choose Service</option>
            <option value="HTTPS">HTTPS (Encrypted Web)</option>
            <option value="FTP">FTP (File Transfer)</option>
            <option value="HTTP">HTTP (Web)</option>
          </select>
        </div>
      </div>

      <button 
        onClick={submitMapping}
        className="w-full bg-[#1e293b] hover:bg-[#334155] font-bold text-white py-2 rounded-xl text-xs uppercase"
      >
        Run Scan Mapping
      </button>

      {status && (
        <div className="p-3 bg-[#111622] rounded-xl border border-white/5 font-mono text-[10px] text-brand-emerald">
          {status}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 09: WEB REQUEST ANALYSIS
// -----------------------------------------------------------------
function WebDevToolsSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [activeTab, setActiveTab] = useState<'network' | 'console' | 'cookies'>('network');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  return (
    <div className="bg-[#0c101a] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
      <div className="bg-[#1c2333] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-slate-300">
        <span className="text-[10px] uppercase font-bold text-slate-400">🌐 Chrome DevTools Emulator (F12)</span>
        <div className="flex gap-2">
          <button 
            onClick={() => { setActiveTab('network'); setSelectedRequest(null); }}
            className={`px-2 py-0.5 rounded text-[10px] uppercase ${activeTab === 'network' ? 'bg-brand-blue text-white':'text-slate-400 hover:text-white'}`}
          >
            Network
          </button>
          <button 
            onClick={() => setActiveTab('console')}
            className={`px-2 py-0.5 rounded text-[10px] uppercase ${activeTab === 'console' ? 'bg-brand-blue text-white':'text-slate-400 hover:text-white'}`}
          >
            Console
          </button>
        </div>
      </div>

      <div className="p-4 h-56 overflow-y-auto">
        {activeTab === 'network' && (
          <div className="grid grid-cols-3 h-full divide-x divide-slate-800">
            <div className="col-span-1 pr-2 space-y-1">
              <span className="text-[10px] text-slate-500 block">HTTP Request Name</span>
              <button 
                onClick={() => setSelectedRequest('login')}
                className={`w-full text-left px-2 py-1 rounded text-xs truncate font-mono ${selectedRequest === 'login' ? 'bg-slate-800 text-brand-blue':'text-white hover:bg-slate-800/55'}`}
              >
                /api/v1/auth/login
              </button>
              <button 
                onClick={() => setSelectedRequest('config')}
                className={`w-full text-left px-2 py-1 rounded text-xs truncate font-mono ${selectedRequest === 'config' ? 'bg-slate-800 text-brand-blue':'text-white hover:bg-slate-800/55'}`}
              >
                /academy-debug-config
              </button>
            </div>
            
            <div className="col-span-2 pl-3 space-y-2 text-[10px] leading-relaxed">
              {selectedRequest === 'login' ? (
                <div>
                  <div className="text-slate-500 font-bold text-xs uppercase mb-1">Authorization Details</div>
                  <div>Request: POST</div>
                  <div>Status Code: 200 OK</div>
                  <div>Response Payload: {'{"status": "linked", "role": "student"}'}</div>
                </div>
              ) : selectedRequest === 'config' ? (
                <div className="space-y-1">
                  <div className="text-slate-500 font-bold text-xs uppercase mb-1">Header Parameters</div>
                  <div>Request Path: GET /config-fetch.json</div>
                  <div>Status Code: 200 OK</div>
                  <hr className="border-slate-800 my-1" />
                  <div className="text-[#a074c4]">X-Powered-By: Express/Vite</div>
                  <div className="text-[#a074c4]">Cache-Control: private, no-store</div>
                  <div className="text-brand-emerald select-all font-bold">
                    X-Academy-Authorization-Flag: EV{'{DEVTOOLS_MASTER}'}
                  </div>
                  <div>Content-Type: application/json</div>
                  {useEffect(() => {
                    onSuccess("EV{DEVTOOLS_MASTER}");
                  }, [])}
                </div>
              ) : (
                <div className="text-slate-500 text-center mt-12">
                  Select a request name in the left column to audit network properties.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="space-y-1 text-slate-400">
            <div><span className="text-slate-600 font-bold">[12:44:02]</span> Loading modules static maps...</div>
            <div><span className="text-slate-600 font-bold">[12:44:03]</span> Connecting to Socket client...</div>
            <div className="text-blue-400"><span className="text-slate-600 font-bold">[12:44:05]</span> [DEBUG-LOG] Active Program Cohort: Cyber Security Starter Program 2026.</div>
            <div className="text-yellow-500"><span className="text-slate-600 font-bold">[12:44:06]</span> [WARN] HMR parameters are locked by administrator overrides because DISABLE_HMR=true.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 10: COOKIE INVESTIGATION
// -----------------------------------------------------------------
function CookieInvestigationSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  useEffect(() => {
    onSuccess("EV{COOKIE_ANALYST}");
  }, []);

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="text-center font-bold text-white text-xs uppercase tracking-wider">
        Storage Inspector: Active Browser Cookies
      </div>
      
      <div className="bg-[#04060c] border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-[10px] font-mono text-left divide-y divide-slate-800">
          <thead className="bg-[#111624] text-slate-400">
            <tr>
              <th className="p-2">Cookie Name</th>
              <th className="p-2">Value</th>
              <th className="p-2">Secure</th>
              <th className="p-2">HttpOnly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            <tr>
              <td className="p-2 font-bold text-white">session_token</td>
              <td className="p-2 truncate max-w-28 text-slate-500">8d91a9BC80f...</td>
              <td className="p-2 text-brand-rose">False</td>
              <td className="p-2 text-brand-rose">False</td>
            </tr>
            <tr>
              <td className="p-2 font-bold text-white">user_role</td>
              <td className="p-2">"student"</td>
              <td className="p-2 text-brand-emerald">True</td>
              <td className="p-2 text-brand-rose">False</td>
            </tr>
            <tr className="bg-brand-blue/5">
              <td className="p-2 font-bold text-brand-cyan">secret_academy_flag</td>
              <td className="p-2 font-bold text-brand-emerald select-all">EV{'{COOKIE_ANALYST}'}</td>
              <td className="p-2 text-brand-emerald font-bold">True</td>
              <td className="p-2 text-brand-emerald font-bold">True</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl text-[10px] leading-relaxed text-slate-300">
        <strong className="text-white block font-sans">Security Insight:</strong>
        Notice how 'secret_academy_flag' has HttpOnly activated. This blocks malicious javascript snippets (XSS) from looting cookies via 'document.cookie' vectors.
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 11: PASSWORD SECURITY
// -----------------------------------------------------------------
function PasswordSecuritySimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0);

  const calculateStrength = (val: string) => {
    let currentScore = 0;
    if (val.length >= 8) currentScore += 20;
    if (val.length >= 14) currentScore += 20;
    if (/[A-Z]/.test(val)) currentScore += 15;
    if (/[a-z]/.test(val)) currentScore += 15;
    if (/[0-9]/.test(val)) currentScore += 15;
    if (/[^A-Za-z0-9]/.test(val)) currentScore += 15;
    return Math.min(100, currentScore);
  };

  useEffect(() => {
    const s = calculateStrength(password);
    setScore(s);
    if (s >= 95) {
      onSuccess("EV{PASSWORD_GUARDIAN}");
    }
  }, [password]);

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">Design a strong master password</label>
        <input 
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="e.g. S3cur3_Ac@d3my_P@ssw0rd!"
          className="w-full bg-[#111624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Entropy Score</span>
          <span className={`font-bold ${score >= 95 ? 'text-brand-emerald': score >= 60 ? 'text-brand-blue':'text-brand-rose'}`}>
            {score}% Strength
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${score >= 95 ? 'bg-brand-emerald': score >= 60 ? 'bg-brand-blue':'bg-brand-rose'}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
        <div className={password.length >= 14 ? 'text-brand-emerald':'text-slate-600'}>✔ Minimum 14 chars</div>
        <div className={/[A-Z]/.test(password) ? 'text-brand-emerald':'text-slate-600'}>✔ Uppercase letters</div>
        <div className={/[a-z]/.test(password) ? 'text-brand-emerald':'text-slate-600'}>✔ Lowercase letters</div>
        <div className={/[0-9]/.test(password) ? 'text-brand-emerald':'text-slate-600'}>✔ Numbers</div>
        <div className={/[^A-Za-z0-9]/.test(password) ? 'text-brand-emerald':'text-slate-600'}>✔ Symbols / Spe. characters</div>
      </div>

      {score >= 95 && (
        <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-xl text-[10px] font-mono leading-relaxed">
          ✔ [PASS] Strong password detected! Zero brute-force susceptibility index matches. FLAG: EV{'{PASSWORD_GUARDIAN}'}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 12: PHISHING DETECTOR
// -----------------------------------------------------------------
function PhishingDetectorSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [choices, setChoices] = useState<{[key: number]: string}>({});
  const [feedback, setFeedback] = useState('');

  const submitClassification = () => {
    if (choices[1] === 'phishing' && choices[2] === 'phishing' && choices[3] === 'legitimate') {
      setFeedback("SUCCESS: Threat categorization is 100% accurate! Flag yielded: EV{PHISHING_HUNTER}");
      onSuccess("EV{PHISHING_HUNTER}");
    } else {
      setFeedback("❌ Categorization mismatch. Re-examine headers, attachments and hyperlinks.");
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="space-y-4 text-xs h-64 overflow-y-auto pr-1">
        {/* Email 1 */}
        <div className="p-3 bg-[#111624] border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <span className="font-bold text-white block">Email 1: Urgent Account suspension!</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sender: accounts-alert@secpay-verification-update-node.com</span>
            </div>
            <span className="text-[10px] text-brand-rose bg-brand-rose/10 px-2 py-0.5 rounded border border-brand-rose/10 font-bold">URGENT</span>
          </div>
          <p className="text-[11px] text-slate-400">"Dear bank customer, unverified access was observed. Log into http://secpay-portal-verify.com to lock down credit accounts before immediate forfeiture."</p>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setChoices({...choices, 1: 'legitimate'})} className={`flex-1 py-1 px-3 text-[10px] font-bold rounded-lg ${choices[1] === 'legitimate' ? 'bg-slate-700 text-white':'border border-slate-800 text-slate-400'}`}>LEGI</button>
            <button onClick={() => setChoices({...choices, 1: 'phishing'})} className={`flex-1 py-1 px-3 text-[10px] font-bold rounded-lg ${choices[1] === 'phishing' ? 'bg-brand-rose text-white':'border border-slate-800 text-slate-400'}`}>PHISH</button>
          </div>
        </div>

        {/* Email 2 */}
        <div className="p-3 bg-[#111624] border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <span className="font-bold text-white block">Email 2: Internal HR circular</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sender: backup-hr-node-office@internal-workplace-circulars.net</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">"Hello colleague, download company salary adjustments metrics from attachment 'allowance_list_2026.zip'. Enter administrative local domain passwords to unzip files."</p>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setChoices({...choices, 2: 'legitimate'})} className={`flex-1 py-1 px-3 text-[10px] font-bold rounded-lg ${choices[2] === 'legitimate' ? 'bg-slate-700 text-white':'border border-slate-800 text-slate-400'}`}>LEGI</button>
            <button onClick={() => setChoices({...choices, 2: 'phishing'})} className={`flex-1 py-1 px-3 text-[10px] font-bold rounded-lg ${choices[2] === 'phishing' ? 'bg-brand-rose text-white':'border border-slate-800 text-slate-400'}`}>PHISH</button>
          </div>
        </div>

        {/* Email 3 */}
        <div className="p-3 bg-[#111624] border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <span className="font-bold text-white block">Email 3: EV Cyber Academy Registration Complete</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sender: admissions@evcyberacademy.org</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">"Welcome! Your credentials are confirmed. Log into your dashboard to solve labs and review syllabus. Contact support lines if needed."</p>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setChoices({...choices, 3: 'legitimate'})} className={`flex-1 py-1 px-3 text-[10px] font-bold rounded-lg ${choices[3] === 'legitimate' ? 'bg-brand-emerald text-slate-950':'border border-slate-800 text-slate-400'}`}>LEGI</button>
            <button onClick={() => setChoices({...choices, 3: 'phishing'})} className={`flex-1 py-1 px-3 text-[10px] font-bold rounded-lg ${choices[3] === 'phishing' ? 'bg-brand-rose text-white':'border border-slate-800 text-slate-400'}`}>PHISH</button>
          </div>
        </div>
      </div>

      <button 
        onClick={submitClassification}
        className="w-full bg-[#1e293b] hover:bg-[#334155] text-white py-2 rounded-xl text-xs font-bold transition-colors"
      >
        Assess Threat Inbox
      </button>

      {feedback && (
        <div className="p-3 bg-[#111622] rounded-xl border border-white/5 font-mono text-[10px] leading-relaxed text-brand-emerald">
          {feedback}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 13: MOBILE SECURITY (APK)
// -----------------------------------------------------------------
function MobileApkSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [activeTab, setActiveTab] = useState<'manifest' | 'permissions'>('manifest');

  return (
    <div className="bg-[#0c101a] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
      <div className="bg-[#1c2333] px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase text-slate-400">📱 APK Decompiler (SecureWallet.apk)</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('manifest')}
            className={`px-2 py-0.5 rounded text-[10px] uppercase ${activeTab === 'manifest' ? 'bg-brand-blue text-white':'text-slate-400'}`}
          >
            AndroidManifest.xml
          </button>
          <button 
            onClick={() => setActiveTab('permissions')}
            className={`px-2 py-0.5 rounded text-[10px] uppercase ${activeTab === 'permissions' ? 'bg-brand-blue text-white':'text-slate-400'}`}
          >
            Dangerous nodes
          </button>
        </div>
      </div>

      <div className="p-4 h-56 overflow-y-auto leading-relaxed">
        {activeTab === 'manifest' ? (
          <div className="text-slate-400 select-all font-mono">
            <div>{'<?xml version="1.0" encoding="utf-8"?>'}</div>
            <div>{'<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.ev.wallet">'}</div>
            <div className="pl-4 text-brand-rose">{'<uses-permission android:name="android.permission.SEND_SMS"/>'}</div>
            <div className="pl-4 text-brand-rose">{'<uses-permission android:name="android.permission.RECEIVE_SMS"/>'}</div>
            <div className="pl-4 text-slate-500">{'<!-- DEBUG AUTHORIZATION BLOCKS -->'}</div>
            <div className="pl-4 text-brand-emerald font-bold">{'<!-- FLAG: EV{APK_ANALYST} -->'}</div>
            <div className="pl-4 text-slate-600">{'<application android:allowBackup="true" android:label="SecureMobiWallet">'}</div>
            <div className="pl-8 text-slate-600">{'<activity android:name=".MainPaymentView">'}</div>
            <div className="pl-12 text-slate-600">{'<intent-filter>'}</div>
            <div className="pl-16 text-slate-600">{'<action android:name="android.intent.action.MAIN"/>'}</div>
            <div className="pl-12 text-slate-600">{'</intent-filter>'}</div>
            <div className="pl-8 text-slate-600">{'</activity>'}</div>
            <div className="pl-4">{'</application>'}</div>
            <div>{'</manifest>'}</div>
            {useEffect(() => {
              onSuccess("EV{APK_ANALYST}");
            }, [])}
          </div>
        ) : (
          <div className="space-y-2 text-slate-300">
            <span className="text-brand-rose block font-bold">// DANGEROUS PERMISSION VECTORS WARNING:</span>
            <p className="text-[11px] leading-relaxed">
              1. <strong className="text-white">SEND_SMS / RECEIVE_SMS:</strong> This wallet application holds background triggers to capture verification codes or send hidden SMS charges. Highly suspicious.
            </p>
            <p className="text-[11px] leading-relaxed">
              2. <strong className="text-white">allowBackup="true":</strong> Exposes private SQLite files directly to custom debugging backups on external computer interfaces without passcode verification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 14: RECON WORKFLOW
// -----------------------------------------------------------------
function ReconWorkflowSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [target, setTarget] = useState('vulnerable-corp.com');
  const [stage, setStage] = useState(0); // 0=idle, 1=whois, 2=subdomains, 3=fingerprint
  const [logs, setLogs] = useState<string[]>(["Enter target scope to map security perimeter."]);

  const runRecon = () => {
    if (target !== 'vulnerable-corp.com') {
      setLogs(["❌ ERROR: Target out of program boundary. Scope restricted to 'vulnerable-corp.com'."]);
      return;
    }

    setStage(1);
    setLogs((prev) => [...prev, "🔎 Triggering WHOIS lookup on vulnerable-corp.com..."]);
    
    setTimeout(() => {
      setStage(2);
      setLogs((prev) => [
        ...prev, 
        "✔ Domain Registry: ApexRegistrar, INC.",
        "✔ Updated: 2026-05-12",
        "🔎 Pulling DNS Subdomain grids... (Scanning bruteforce files)"
      ]);
    }, 1000);

    setTimeout(() => {
      setStage(3);
      setLogs((prev) => [
        ...prev, 
        "★ Discovered active subdomain: staging-auth-test-portal-3000.vulnerable-corp.com",
        "🔎 Triggering Technology fingerprinter scans on staging host..."
      ]);
    }, 2000);

    setTimeout(() => {
      setStage(4);
      setLogs((prev) => [
        ...prev, 
        "✔ Port 3000 detected [Listening: Node/Express Server]",
        "✔ Admin parameters captured in custom response header banner.",
        "X-Server-Admin-Comment: EV{RECON_MASTER}"
      ]);
      onSuccess("EV{RECON_MASTER}");
    }, 3000);
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="space-y-1.5">
        <label className="text-[10px] text-slate-300 block uppercase font-bold tracking-wide">Target Domain Scope</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={target} 
            onChange={(e) => setTarget(e.target.value)} 
            className="flex-1 bg-[#111624] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 font-mono"
          />
          <button 
            onClick={runRecon}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Start Recon Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
        <div className={`p-1.5 border rounded-lg ${stage >= 1 ? 'bg-brand-blue/10 border-brand-blue/20 text-white':'bg-slate-900 border-slate-800 text-slate-500'}`}>1. WHOIS Registry</div>
        <div className={`p-1.5 border rounded-lg ${stage >= 2 ? 'bg-brand-cyan/10 border-brand-cyan/20 text-white':'bg-slate-900 border-slate-800 text-slate-500'}`}>2. Subdomains List</div>
        <div className={`p-1.5 border rounded-lg ${stage >= 3 ? 'bg-brand-emerald/10 border-brand-emerald/20 text-white':'bg-slate-900 border-slate-800 text-slate-500'}`}>3. Tech Profile</div>
      </div>

      <div className="bg-[#04060c] border border-slate-800 rounded-xl p-3 h-32 overflow-y-auto font-mono text-[10px] text-brand-emerald space-y-1">
        {logs.map((log, lIdx) => (
          <div key={lIdx}>{log}</div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 15: SECURITY REPORTING
// -----------------------------------------------------------------
function VulnerabilityReportingSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [severity, setSeverity] = useState('');
  const [remedi, setRemedi] = useState('');
  const [evalResult, setEvalResult] = useState('');

  const runEvaluation = () => {
    if (severity === 'critical' && remedi.length > 15) {
      setEvalResult("SUCCESS: Bug Report audits scored 98%! Outstanding documentation.\nFLAG GENERATED: EV{REPORTING_PRO}");
      onSuccess("EV{REPORTING_PRO}");
    } else if (severity !== 'critical') {
      setEvalResult("❌ Assessment mismatch. Leakage of master databases credentials via client script exposes backend pools entirely (Severity must be Critical).");
    } else {
      setEvalResult("❌ Assessment mismatch. Please write a detailed, professional recommendation block (e.g. 'Store the secret credentials safe in environment variables on the backend server').");
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
      <div className="bg-[#111624] p-3 rounded-xl border border-white/5 space-y-1 text-slate-400">
        <strong className="text-white block text-xs uppercase mb-0.5">Vulnerability Case parameters:</strong>
        "Frontend Javascript file 'app.config.js' contains hardcoded postgres server passwords 'db_pass_2026' visible to anyone in public inspect elements."
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-300 block uppercase font-bold tracking-wide">Assign CVSS Severity</label>
          <select 
            value={severity} 
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="">-- Choose Category --</option>
            <option value="low">Low (CVSS 0.1 - 3.9)</option>
            <option value="medium">Medium (CVSS 4.0 - 6.9)</option>
            <option value="high">High (CVSS 7.0 - 8.9)</option>
            <option value="critical">Critical (CVSS 9.0 - 10.0)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-300 block uppercase font-bold tracking-wide">Remediation Suggestion</label>
          <textarea 
            value={remedi} 
            onChange={(e) => setRemedi(e.target.value)}
            placeholder="e.g. Move credentials to .env configurations variables server side..."
            className="w-full bg-[#111624] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none h-16"
          />
        </div>
      </div>

      <button 
        onClick={runEvaluation}
        className="w-full bg-brand-blue text-white py-2 rounded-xl text-xs font-bold uppercase cursor-pointer"
      >
        Grade Security Report
      </button>

      {evalResult && (
        <div className="p-3 bg-[#111622] rounded-xl border border-white/5 font-mono text-[10px] leading-relaxed text-brand-emerald whitespace-pre-line">
          {evalResult}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// LAB 16: FINAL CAPSTONE EXAMINATION
// -----------------------------------------------------------------
function FinalCapstoneSimulator({ onSuccess }: { onSuccess: (flag: string) => void }) {
  const [cliInput, setCliInput] = useState('');
  const [cliLogs, setCliLogs] = useState<string[]>([
    "EV Cyber Academy Capstone Node v1.0.26",
    "Goal: Reach administrative panel of local server router and retrieve cookies.",
    "Type 'cat network_config.json' to initiate your examination mapping.",
    ""
  ]);
  const [stage, setStage] = useState(1); // 1=cat config, 2=scan, 3=devtools cook, 4=validate
  const [cookieToken, setCookieToken] = useState('');
  const [finalStatus, setFinalStatus] = useState('');

  const executeCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const cmdLine = cliInput.trim();
    const parts = cmdLine.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    if (cmd === 'clear') {
      setCliLogs([]);
      setCliInput('');
      return;
    }

    setCliLogs((prev) => [...prev, `$ ${cliInput}`]);

    // Check for general standard Linux utilities
    const commonResp = getCommonLinuxCommandResponse(cmd, arg, cmdLine);
    if (commonResp !== null) {
      setCliLogs((prev) => [...prev, commonResp]);
      setCliInput('');
      return;
    }

    if (cmd === 'help') {
      const stageHints: { [key: number]: string } = {
        1: "Objective: Access the central gateway configuration. Hint: type 'cat network_config.json'",
        2: "Objective: Analyze active ports map targeting gateway host. Hint: type 'scan 192.168.99.1'",
        3: "Objective: Extract security token identifiers from browser storage. Hint: type 'cookies'",
        4: "Standard Graduation Complete. Input token below."
      };
      setCliLogs((prev) => [
        ...prev,
        `Active Target: Final Capstone Examination Simulator`,
        `Current Stage: ${stage} / 4`,
        stageHints[stage] || "Process completed.",
        "General Linux Commands Available: help, clear, whoami, id, uname, date, df, free, uptime, ps, w, echo"
      ]);
      setCliInput('');
      return;
    }

    const inputClean = cmdLine.toLowerCase();

    if (stage === 1) {
      if (inputClean === 'cat network_config.json') {
        setCliLogs((prev) => [
          ...prev,
          "NET CONFIG ENCRYPTED LOADED:",
          "{\n  \"gateway_host\": \"192.168.99.1\",\n  \"active_subnets\": \"192.168.99.0/24\"\n}",
          "Next step: Scan open network sockets targeting this gateway host IP! (Type: 'scan 192.168.99.1')"
        ]);
        setStage(2);
      } else {
        setCliLogs((prev) => [...prev, "❌ Operation unauthorized. Target files: 'cat network_config.json'. Type 'help' for hints."]);
      }
    } else if (stage === stage) {
      if (stage === 2) {
        if (inputClean === 'scan 192.168.99.1' || inputClean === 'scan' || inputClean.startsWith('scan ')) {
          if (inputClean === 'scan 192.168.99.1') {
            setCliLogs((prev) => [
              ...prev,
              "★ Port analyzer scanning 192.168.99.1...",
              "★ Port 22 SSH -> Secure Shell bindings",
              "★ Port 8080 HTTP-ALT -> Mock Corporate Administrator Portal [Open]",
              "Stage 2 Passed! Open the Admin cookies next.",
              "Type 'cookies' to fetch storage inspector records."
            ]);
            setStage(3);
          } else {
            setCliLogs((prev) => [...prev, "❌ Scan parameter mismatch. Complete target as: 'scan 192.168.99.1'"]);
          }
        } else {
          setCliLogs((prev) => [...prev, "❌ Command execution fails. Target format: 'scan 192.168.99.1'"]);
        }
      } else if (stage === 3) {
        if (inputClean === 'cookies') {
          setCliLogs((prev) => [
            ...prev,
            "✔ Cookie inspectors fetched admin storage values:",
            "NAME: session_id  | VALUE: EV_ADMIN_TOKEN_91x",
            "NAME: secret_flag | VALUE: EV{CYBER_SECURITY_STARTER_2026}",
            "Enter this secret_flag value into the capstone secure validator below to graduate."
          ]);
          setStage(4);
        } else {
          setCliLogs((prev) => [...prev, "❌ Terminal failed to parse authorization context. Try typing 'cookies'."]);
        }
      } else {
        setCliLogs((prev) => [...prev, `System state consolidated. Graduation target cookie parsed already. Type 'help' to review.`]);
      }
    }

    setCliInput('');
  };

  const validateMasterFlag = () => {
    if (cookieToken.trim() === 'EV{CYBER_SECURITY_STARTER_2026}') {
      setFinalStatus("★ CONGRATULATIONS MASTER! Capstone diagnostic validates completely. Standard Academy graduation is officially open. Retrieve files directly in the Certificate tab.");
      onSuccess("EV{CYBER_SECURITY_STARTER_2026}");
    } else {
      setFinalStatus("❌ Invalid graduation token flag. Trace output in capstone terminal logs above.");
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="bg-[#04060c] border border-slate-800 rounded-xl font-mono text-[10px] h-48 overflow-y-auto p-3 text-brand-emerald space-y-1">
        {cliLogs.map((log, idx) => (
          <div key={idx} className="whitespace-pre-wrap">{log}</div>
        ))}
      </div>

      <form onSubmit={executeCommand} className="bg-[#060a13] p-1.5 border border-slate-800 rounded-xl flex items-center">
        <span className="text-brand-blue mr-2 text-xs font-mono font-bold">$</span>
        <input 
          type="text" 
          value={cliInput}
          onChange={(e) => setCliInput(e.target.value)}
          placeholder="Type capstone commands..."
          className="bg-transparent focus:outline-none flex-1 text-xs text-white font-mono"
        />
      </form>

      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
        <label className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">Master Capstone Validation Flag</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={cookieToken}
            onChange={(e) => setCookieToken(e.target.value)}
            placeholder="EV{...}"
            className="flex-1 bg-[#060a13] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
          />
          <button 
            onClick={validateMasterFlag}
            className="bg-brand-emerald hover:bg-brand-emerald/90 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer"
          >
            Authenticate
          </button>
        </div>
      </div>

      {finalStatus && (
        <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/20 text-xs font-mono leading-relaxed text-brand-emerald whitespace-pre-line rounded-xl">
          {finalStatus}
        </div>
      )}
    </div>
  );
}
