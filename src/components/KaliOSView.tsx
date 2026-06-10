import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Globe, 
  Folder, 
  HelpCircle, 
  Cpu, 
  Settings, 
  Maximize2, 
  Minimize2, 
  X, 
  Play, 
  CheckCircle2, 
  Wifi, 
  Eye, 
  Code,
  FileText,
  Search,
  ChevronRight,
  Shield,
  Activity,
  ArrowRight,
  Database,
  Lock,
  RefreshCw,
  Clock,
  Compass,
  Key,
  Copy
} from 'lucide-react';
import { UserProgress } from '../types';
import { LABS_DATA } from '../data/labs';
import { LAB_SOLUTIONS_MAP } from '../data/solutions';

interface KaliOSViewProps {
  onSyncProgress?: (completedLabs: number[], xpAwarded: number) => void;
}

interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'terminal' | 'browser' | 'burp' | 'files' | 'notes' | 'nmap';
}

const DEFAULT_WINDOWS: WindowState[] = [
  { id: 'terminal', title: 'qterminal - vimal_r@kali:~', isOpen: true, isMaximized: false, zIndex: 10, x: 80, y: 60, width: 680, height: 420, type: 'terminal' },
  { id: 'browser', title: 'Firefox ESR - Chromium engine', isOpen: false, isMaximized: false, zIndex: 5, x: 180, y: 120, width: 720, height: 480, type: 'browser' },
  { id: 'burp', title: 'Burp Suite Community Edition Proxy', isOpen: false, isMaximized: false, zIndex: 4, x: 280, y: 160, width: 640, height: 440, type: 'burp' },
  { id: 'files', title: 'Thunar File Manager - system directory', isOpen: false, isMaximized: false, zIndex: 3, x: 140, y: 220, width: 580, height: 380, type: 'files' },
  { id: 'notes', title: 'Pwnbox Lab Companion Tracker', isOpen: false, isMaximized: false, zIndex: 2, x: 340, y: 100, width: 560, height: 450, type: 'notes' },
  { id: 'nmap', title: 'Zenmap GUI Port Scanner Console', isOpen: false, isMaximized: false, zIndex: 1, x: 220, y: 80, width: 600, height: 400, type: 'nmap' },
];

export default function KaliOSView({ onSyncProgress }: KaliOSViewProps) {
  const [windows, setWindows] = useState<WindowState[]>(DEFAULT_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<string>('terminal');
  const [topZ, setTopZ] = useState<number>(20);
  const [isApplicationsMenuOpen, setIsApplicationsMenuOpen] = useState(false);
  
  // Drag state
  const [draggedWindowId, setDraggedWindowId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // System statistics indicators
  const [cpuUsage, setCpuUsage] = useState(8.2);
  const [ramUsage, setRamUsage] = useState(32.4);
  const [timeLeft, setTimeLeft] = useState('01:59:59');

  // Load user progress for target dashboard integration 
  const [userProgress, setUserProgress] = useState<UserProgress>({
    username: 'Vimal R',
    email: 'vimalthenoob@gmail.com',
    joinDate: 'June 09, 2026',
    completedLabs: [],
    completedTasks: [],
    completedHackathonDays: [],
    xp: 0
  });

  // State managers for individual window logs and actions
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Kali Linux core GNU/Linux (amd64 architecture)",
    "EV Cyber Academy Virtual Pwnbox v2.0-stable",
    "Pulsing tunnel tunnels verified: tun0 interface bound to 10.10.14.35",
    "Type 'help' to review authorized security audits.",
    ""
  ]);
  const [cmdInput, setCmdInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Stateful active Lab ID
  const getInitialLabId = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const val = params.get('labId');
      if (val) return parseInt(val);
    }
    return 1;
  };

  const [selectedLabId, setSelectedLabId] = useState<number>(getInitialLabId());
  const [flagSubmittedInput, setFlagSubmittedInput] = useState('');
  const [showCompanionHints, setShowCompanionHints] = useState(false);
  const [companionTab, setCompanionTab] = useState<'instructions' | 'solution' | 'theory'>('instructions');

  useEffect(() => {
    setCompanionTab('instructions');
  }, [selectedLabId]);

  // File Manager states
  const [currentFolder, setCurrentFolder] = useState<string>('/home/kali');

  // Stateful Virtual Filesystem representing standard folder layouts
  const [vFS, setVFS] = useState<{
    [key: string]: { name: string; type: 'file' | 'folder'; size?: string; content?: string; permissions?: string }[];
  }>({
    '/home/kali': [
      { name: 'Desktop', type: 'folder' },
      { name: 'Downloads', type: 'folder' },
      { name: 'Documents', type: 'folder' },
      { name: 'lab_targets_brief.txt', type: 'file', size: '1.2 KB', content: 'EV CYBER ACADEMY TARGET LAB CODES BRIEF:\n\nValidate your command structures against our core test arrays.\nActive subdomains targeted: vulnerable-corp.com (Internal: 10.10.10.123)\nSecure key assets location is archived on /etc/hosts.' },
      { name: 'custom_wordlist.txt', type: 'file', size: '240 B', content: 'academy_admin\nEV_Secure_2026\nadmin123\npassword_kali\nroot\nadmin' },
      { name: 'SecureMobiWallet.apk', type: 'file', size: '4.8 MB', content: '[Binary Android Package Archive: SecureMobiWallet.apk]\nUse "apktool d SecureMobiWallet.apk" to decompile and inspect manifest details.' },
      { name: 'network_config.json', type: 'file', size: '420 B', content: '{\n  "gateway": "192.168.99.1",\n  "scope": "10.10.10.0/24"\n}' },
      { name: 'run_backup.sh', type: 'file', size: '320 B', content: '#!/bin/bash\necho "Initializing database backup sync..."\necho "Accessing server logs..."', permissions: '-rw-r--r--' }
    ],
    '/home/kali/Desktop': [
      { name: 'firefox.desktop', type: 'file', size: '150 B', content: 'Launch FireFox ESR Web Browser interface.' },
      { name: 'qterminal.desktop', type: 'file', size: '140 B', content: 'Launch secure qterminal shell console.' },
      { name: 'burpsuite.desktop', type: 'file', size: '210 B', content: 'Launch Burp Suite Community edition proxy intercept diagnostics.' },
      { name: 'vulnerable_ip_target.url', type: 'file', size: '82 B', content: 'URL: http://10.10.10.123' }
    ],
    '/home/kali/Downloads': [
      { name: 'admin_passwords.txt', type: 'file', size: '85 B', content: 'ADMINISTRATOR AUTH KEYS:\nUsername: academy_admin\nSecret Passcode: EV_Secure_2026\n' },
      { name: 'network_backup_config.json', type: 'file', size: '1.4 KB', content: '{\n  "dns_authority": "dns-primary.client.local",\n  "subdomains": ["vulnerable-corp.com", "admin.vulnerable-corp.com"],\n  "allowed_scopes": ["10.10.10.0/24"]\n}' }
    ],
    '/home/kali/Documents': [
      { name: 'cheat_sheet_pwnbox.txt', type: 'file', size: '480 B', content: 'USEFUL COMMAND CHEAT SHEET:\n- nmap -sC -sV 10.10.10.123\n- dirb http://10.10.10.123\n- msfconsole\n- cat /etc/hosts\n- hydra -l academy_admin -P custom_wordlist.txt ftp://10.10.10.123' }
    ],
    '/home/kali/instructor': [
      { name: 'notes.txt', type: 'file', size: '1.1 KB', content: 'SECRET ACADEMY INSTRUCTOR DOSSIER\n\nFLAG SECURITY PARAMETER MATCHED: EV{LINUX_NAVIGATOR}\nKeep this file highly confidential from students.' }
    ]
  });
  
  // Web Browser states
  const [browserUrl, setBrowserUrl] = useState('http://vulnerable-corp.com');
  const [browserSearch, setBrowserSearch] = useState('');
  const [browserPayloadResult, setBrowserPayloadResult] = useState<string>('');
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [cookieToken, setCookieToken] = useState('session_id=81ac902d8f99e32a; secure_guest=true');

  // Burp Suite States
  const [burpInterceptActive, setBurpInterceptActive] = useState(true);
  const [burpRequestHeaders, setBurpRequestHeaders] = useState<string>(
    "POST /api/authenticate_v3 HTTP/1.1\n" +
    "Host: client.local\n" +
    "User-Agent: Firefox ESR on Kali Linux\n" +
    "Content-Type: application/json\n" +
    "X-Session-Header: EV_USER_TOKEN_882\n" +
    "X-User-Role: guest\n" +
    "X-Security-Flag-Check: disabled\n\n" +
    '{"id": 1026, "username": "vimal_r", "group": "student"}'
  );
  const [burpHistory, setBurpHistory] = useState<string[]>([
    "Intercepted Request #1 to client.local [Captured]",
  ]);

  // Nmap Port Scan States
  const [scanTarget, setScanTarget] = useState('10.10.10.123');
  const [scanOutput, setScanOutput] = useState<string[]>([
    "Zenmap scan logs - pending scan trigger.",
    "Target scope recommended: 10.10.10.123 (Vulnerable Internal Gateway)"
  ]);
  const [isScanning, setIsScanning] = useState(false);

  // Sync state with localstorage on mount
  useEffect(() => {
    const cachedUser = localStorage.getItem('ev_cyber_academy_user');
    const cachedProgress = localStorage.getItem('ev_cyber_academy_progress');
    if (cachedUser && cachedProgress) {
      try {
        const u = JSON.parse(cachedUser);
        const p = JSON.parse(cachedProgress);
        setUserProgress({ ...userProgress, ...u, ...p });
      } catch (e) {
        console.error("Progress sync fail in Virtual VM", e);
      }
    }

    // Parse labId search params to auto-open notes manual and terminal on load
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const lId = params.get('labId');
    if (lId) {
      const parsedLabId = parseInt(lId);
      if (!isNaN(parsedLabId) && parsedLabId >= 1 && parsedLabId <= 16) {
        setSelectedLabId(parsedLabId);
        setWindows(prev => prev.map(w => {
          if (w.id === 'notes') {
            return { ...w, isOpen: true, zIndex: 30 };
          }
          if (w.id === 'terminal') {
            return { ...w, isOpen: true, zIndex: 15 };
          }
          return w;
        }));
        setActiveWindowId('notes');
        setTopZ(35);
      }
    }

    // System stats simulation ticker
    const timer = setInterval(() => {
      setCpuUsage(prev => Math.max(2.1, Math.min(98.3, +(prev + (Math.random() * 4 - 2)).toFixed(1))));
      setRamUsage(prev => Math.max(30.2, Math.min(45.6, +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1))));
    }, 2000);

    // VM expiration countdown clock
    let totalSeconds = 7200; // 2 hours
    const cdTimer = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        setTimeLeft(`${hrs}:${mins}:${secs}`);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(cdTimer);
    };
  }, []);

  const completeLabInOS = (labId: number, xpReward: number, labTitle: string) => {
    let completedLabs: number[] = [];
    let currentXp = 0;
    
    const cachedProgress = localStorage.getItem('ev_cyber_academy_progress');
    if (cachedProgress) {
      try {
        const parsed = JSON.parse(cachedProgress);
        completedLabs = parsed.completedLabs || [];
        currentXp = parsed.xp || 0;
      } catch (e) {
        console.error("Progress load error", e);
      }
    }
    
    if (!completedLabs.includes(labId)) {
      completedLabs.push(labId);
      currentXp += xpReward;
      
      const newProgress = {
        completedLabs,
        completedTasks: completedLabs.map(id => `lab_${id}`),
        completedHackathonDays: [],
        xp: currentXp
      };
      
      localStorage.setItem('ev_cyber_academy_progress', JSON.stringify(newProgress));
      setUserProgress(prev => ({
        ...prev,
        completedLabs,
        xp: currentXp
      }));
      
      let currentActivities = [];
      const cachedActivities = localStorage.getItem('ev_cyber_academy_activities');
      if (cachedActivities) {
        try {
          currentActivities = JSON.parse(cachedActivities);
        } catch (e) {
          console.error("Activities load error", e);
        }
      }
      
      const newActivity = {
        id: `act_${Date.now()}`,
        type: 'lab_complete' as const,
        label: `Completed Lab: ${labTitle}`,
        timestamp: 'Just now',
        xp: xpReward
      };
      
      currentActivities = [newActivity, ...currentActivities].filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id || t.label === item.label)
      );
      
      localStorage.setItem('ev_cyber_academy_activities', JSON.stringify(currentActivities));
      
      if (onSyncProgress) {
        onSyncProgress(completedLabs, currentXp);
      }
      
      alert(`🎉 EXPLOITATION CRITICAL RESOLVED!\n\nSuccessfully authenticated laboratory token! Awarded +${xpReward} XP.\nYour profile record and progress log have been synced.`);
    } else {
      alert(`ℹ️ Laboratory Token already verified! You have successfully completed this lab before.`);
    }
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ, isOpen: true } : w));
  };

  const closeWindow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const openWindow = (id: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: true, zIndex: nextZ } : w));
    setActiveWindowId(id);
    setIsApplicationsMenuOpen(false);
  };

  const toggleMaximize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  // Drag and drop mechanics for window elements
  const handleHeaderMouseDown = (id: string, e: React.MouseEvent) => {
    if (windows.find(w => w.id === id)?.isMaximized) return;
    
    focusWindow(id);
    setDraggedWindowId(id);
    const win = windows.find(w => w.id === id);
    if (win) {
      setDragStartPos({ x: e.clientX, y: e.clientY });
      setDragOffset({ x: win.x, y: win.y });
    }
  };

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (!draggedWindowId) return;
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    
    // Bounds limit logic to avoid losing window offscreen
    const newX = Math.max(10, Math.min(window.innerWidth - 150, dragOffset.x + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 100, dragOffset.y + dy));

    setWindows(prev => prev.map(w => w.id === draggedWindowId ? { ...w, x: newX, y: newY } : w));
  };

  const handleGlobalMouseUp = () => {
    setDraggedWindowId(null);
  };

  // We reference vFS state directly as virtual filesystem
  const systemFiles = vFS;

  // Commands Interpreter engine inside Virtual Kali environment
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const cmdLine = cmdInput.trim();
    const parts = cmdLine.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg1 = parts[1] ? parts[1].replace(/^\.\//, '') : '';

    setTerminalLogs(prev => [...prev, `vimal_r@kali:~$ ${cmdLine}`]);

    let response: string[] = [];

    // Nmap parser in commandline
    if (cmd === 'nmap') {
      if (!arg1) {
        response = ["Usage: nmap -sC -sV [IP_ADDRESS or domain]"];
      } else if (cmdLine.includes('staging-auth') || cmdLine.includes('10.10.10.144') || cmdLine.includes('port 3000') || cmdLine.includes('-p 3000')) {
        response = [
          "Starting Nmap 7.91 ( https://nmap.org ) at June 10 08:35 UTC",
          "Nmap scan report for staging-auth-test-portal-3000.vulnerable-corp.com (10.10.10.144)",
          "Host is up (0.0033s latency).",
          "PORT     STATE SERVICE VERSION",
          "3000/tcp open  http    NodeJS Express Admin Staging Portal",
          "|_ http-title: Admin Staging Sandbox Controller Release Candidate v3",
          "  Banner comment: Header authorization validation flag config is live.",
          "  TOKEN CRACKED: EV{RECON_MASTER}",
          "",
          "Nmap done: 1 IP address (1 host up) scanned in 0.82 seconds"
        ];
      } else {
        response = [
          "Starting Nmap 7.91 ( https://nmap.org ) at June 10 08:32 UTC",
          `Nmap scan report for ${arg1} (${arg1 === '10.10.10.123' || arg1 === 'vulnerable-corp.com' ? '10.10.10.123' : 'External Host'})`,
          "Host is up (0.0021s latency).",
          "Not shown: 996 closed ports",
          "PORT     STATE SERVICE VERSION",
          "21/tcp   open  ftp     vsftpd 3.0.3",
          "22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5",
          "80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))",
          "8080/tcp open  http-alt Mock Corporate Administrator Portal [Open]",
          "  |_http-server-header: Python/3.8.5 Werkzeug/1.0.1",
          `Nmap done: 1 IP address (1 host up) scanned in 1.45 seconds`,
          "",
          "💡 CLUE UNLOCKED: Port 21 (FTP), Port 80 (HTTP) and administration hub on 8080 look vulnerable. Try dirb or hydra next!"
        ];
      }
    } 
    // Dirb command line parser
    else if (cmd === 'dirb') {
      if (!arg1) {
        response = ["Usage: dirb [TARGET_URL]"];
      } else if (arg1.includes('10.10.10.123') || arg1.includes('vulnerable-corp.com')) {
        response = [
          "-----------------",
          "DIRB v2.22",
          "By DarkRaider",
          "-----------------",
          `START_TIME: Jun 10 08:34:25`,
          `URL_BASE: ${arg1}`,
          "WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt",
          "-----------------",
          "==> DIRECTORY: http://10.10.10.123/logs/",
          "==> DIRECTORY: http://10.10.10.123/backup/",
          "+ http://10.10.10.123/robots.txt (CODE:200|SIZE:154)",
          "==> DIRECTORY: http://10.10.10.123/admin_portal/",
          "+ http://10.10.10.123/api/v1 (CODE:200|SIZE:512)",
          "-----------------",
          "DOWNLOADED: 4612 FILES - FOUND: 4 DIRECTORIES",
          "💡 CLUE UNLOCKED: Browse http://10.10.10.123/admin_portal/ or /logs/ in Firefox web browser!"
        ];
      } else {
        response = [
          "-----------------",
          "DIRB - Parsing targeted domain...",
          "ERROR: Target out of sandbox loop domain configurations."
        ];
      }
    } 
    // Metasploit payload simulator!
    else if (cmd === 'msfconsole') {
      response = [
        "                                 ",
        "         ,           ,           ",
        "        /             \\         ",
        "       ((__---,,,---__))         ",
        "          (_) O O (_)            ",
        "             \\___/               ",
        "             /\\  /\\              ",
        "        _.._((_))((_))_.._       ",
        "      (____________________)     ",
        "                                 ",
        "       =[ metasploit v6.0.44-dev ]",
        "+ -- --=[ 2125 exploits - 1139 auxiliary ]",
        "+ -- --=[ 380 post - 912 payloads ]",
        "+ -- --=[ 45 encoders - 10 nops ]",
        "",
        "msf6 > ",
        "💡 EXPLOIT SHIELD TRIGGERED! Type 'use exploit/tomcat_mgr'",
      ];
    }
    else if (cmdLine.toLowerCase() === 'use exploit/tomcat_mgr') {
      response = [
        "[+] Using exploit/multi/http/tomcat_mgr_deploy",
        "msf6 exploit(multi/http/tomcat_mgr_deploy) > set rhosts 10.10.10.123",
        "rhosts => 10.10.10.123",
        "msf6 exploit(multi/http/tomcat_mgr_deploy) > run",
        "[*] Started reverse TCP handler on 10.10.14.35:4444",
        "[*] Attempting credentials attack over Port 8080...",
        "[+] Authenticated successfully with academy_admin:EV_Secure_2026",
        "[*] Injecting malicious WAR payload package dynamically...",
        "[*] Spawning meterpreter shell session 1 established!",
        "meterpreter > flag",
        "EV{METASPLOIT_WAR_PWN_DEPLOY_OK_883}",
        "Congratulations! You exploited the application using the msf Metasploit agent!",
      ];
    }
    // Hydra parser
    else if (cmd === 'hydra') {
      if (cmdLine.includes('ftp://10.10.10.123')) {
        response = [
          "Hydra v9.2-dev (c) 2026 by van Hauser / THC",
          "[*] Target: ftp://10.10.10.123 (Port 21)",
          "[*] Wordlist checking enabled: custom_wordlist.txt (6 items)",
          "[-][ftp] Attempt 1: admin / admin123 - Access denied",
          "[-][ftp] Attempt 2: root / root - Access denied",
          "[+][ftp] Host: 10.10.10.123 login: academy_admin password: EV_Secure_2026",
          "1 of 1 target successfully cracked on Host: 10.10.10.123 (ftp)",
          "💡 FLAG ACQUIRED: Use target login to access the files! Credentials cracked."
        ];
      } else {
        response = ["Usage: hydra -l academy_admin -P custom_wordlist.txt ftp://10.10.10.123"];
      }
    }
    // Apktool decompiler simulator (Lab 13)
    else if (cmd === 'apktool') {
      if (arg1 === 'd' && parts[2] === 'SecureMobiWallet.apk') {
        setVFS(prev => {
          const current = { ...prev };
          current['/home/kali/SecureMobiWallet'] = [
            { name: 'AndroidManifest.xml', type: 'file', size: '1.8 KB', content: '<?xml version="1.0" encoding="utf-8"?>\n<manifest xmlns:android="http://schemas.android.com/apk/res/android"\n    package="com.evcyberacademy.securewallet">\n\n    <!-- SECURITY RESEARCH NOTICE FOR CORE LAB 13 AUDIT:\n         FLAG DECRYPTED: EV{APK_ANALYST} -->\n\n    <uses-permission android:name="android.permission.SEND_SMS" />\n    <uses-permission android:name="android.permission.READ_CONTACTS" />\n    <uses-permission android:name="android.permission.INTERNET" />\n\n    <application\n        android:allowBackup="false"\n        android:icon="@mipmap/ic_launcher"\n        android:label="@string/app_name">\n        <activity android:name=".MainActivity"\n            android:exported="true">\n            <intent-filter>\n                <action android:name="android.intent.action.MAIN" />\n                <category android:name="android.intent.category.LAUNCHER" />\n            </intent-filter>\n        </activity>\n    </application>\n</manifest>' }
          ];
          if (!current['/home/kali'].some(f => f.name === 'SecureMobiWallet')) {
            current['/home/kali'] = [
              ...current['/home/kali'],
              { name: 'SecureMobiWallet', type: 'folder' }
            ];
          }
          return current;
        });
        response = [
          "I: Using Apktool v2.5.0 on SecureMobiWallet.apk",
          "I: Loading resource table...",
          "I: Decoding AndroidManifest.xml with resources...",
          "I: Loading resource table from file...",
          "I: Regular manifest decompilation done.",
          "I: Decompressing directory to /home/kali/SecureMobiWallet...",
          "💡 SUCCESS: Android configuration outputted to ./SecureMobiWallet/ (Use cd SecureMobiWallet && cat AndroidManifest.xml)"
        ];
      } else {
        response = ["Usage: apktool d SecureMobiWallet.apk"];
      }
    }
    // DNS Diagnostics utilities (Lab 5)
    else if (cmd === 'nslookup') {
      if (cmdLine.includes('evcyberacademy.org')) {
        const typeArg = cmdLine.includes('-type=txt') || cmdLine.includes('txt') || cmdLine.includes('TXT');
        if (typeArg) {
          response = [
            "Server:         10.0.2.3",
            "Address:        10.0.2.3#53",
            "",
            "Non-authoritative answer:",
            "evcyberacademy.org    text = \"v=spf1 include:_spf.google.com authentication_token=EV{DNS_HUNTER} -all\""
          ];
        } else {
          response = [
            "Server:         10.0.2.3",
            "Address:        10.0.2.3#53",
            "",
            "Non-authoritative answer:",
            "Name:   evcyberacademy.org",
            "Address: 104.22.4.112",
            "💡 CLUE: Look up the TXT record using 'nslookup -type=txt evcyberacademy.org' to find hidden DNS configurations."
          ];
        }
      } else {
        response = ["Usage: nslookup -type=txt evcyberacademy.org"];
      }
    }
    else if (cmd === 'dig') {
      if (cmdLine.includes('evcyberacademy.org')) {
        if (cmdLine.includes('txt') || cmdLine.includes('TXT')) {
          response = [
            "; <<>> DiG 9.16.22-Debian <<>> evcyberacademy.org txt",
            ";; global options: +cmd",
            ";; Got answer:",
            ";; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 14755",
            ";; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1",
            "",
            ";; QUESTION SECTION:",
            ";evcyberacademy.org.            IN      TXT",
            "",
            ";; ANSWER SECTION:",
            "evcyberacademy.org.     299     IN      TXT     \"v=spf1 include:_spf.google.com authentication_token=EV{DNS_HUNTER} -all\"",
            "",
            ";; Query time: 1.2 msec",
            ";; SERVER: 10.0.2.3#53(10.0.2.3)",
            ";; WHEN: Wed Jun 10 08:44:21 UTC 2026"
          ];
        } else {
          response = [
            "Usage: dig evcyberacademy.org txt"
          ];
        }
      } else {
        response = ["Usage: dig evcyberacademy.org txt"];
      }
    }
    // Web queries (Lab 6)
    else if (cmd === 'curl' || cmd === 'wget') {
      if (cmdLine.includes('104.22.4.112') || cmdLine.includes('evcyberacademy.org')) {
        response = [
          "HTTP/1.1 200 OK",
          "Date: Wed, 10 Jun 2026 08:45:10 GMT",
          "Server: Cloudflare",
          "Content-Type: text/html; charset=UTF-8",
          "Connection: keep-alive",
          "X-Frame-Options: SAMEORIGIN",
          "",
          "<!DOCTYPE html>",
          "<html>",
          "<head><title>Cyber Academy Web Gateway</title></head>",
          "<body>",
          "  <h2>Secure HTTP request packet fully verified.</h2>",
          "  <p>Your connection safely reached the destination routing node.</p>",
          "  <pre>KEY ACCREDITED: EV{PACKET_TRACER}</pre>",
          "</body>",
          "</html>"
        ];
      } else {
        response = [
          "Usage: curl http://104.22.4.112 or curl http://evcyberacademy.org"
        ];
      }
    }
    // Network Sniffing Utilities (Lab 7)
    else if (cmd === 'tcpdump') {
      response = [
        "tcpdump: verbose output suppressed, use -v[v] for full protocol decode",
        "listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes",
        "08:42:15.824213 IP 10.10.14.35.41221 > 10.10.10.123.80: Flags [P.], seq 101:254, ack 1, win 502, length 153: HTTP: POST /login.php HTTP/1.1",
        "   Host: 10.10.10.123",
        "   Content-Type: application/x-www-form-urlencoded",
        "   Cleartext credential dump:",
        "     username=academy_admin&password=EV_Secure_2026",
        "   FLAG DETECTED: EV{WEB_FOUNDATION}",
        "",
        "08:42:18.995341 IP 10.10.14.35.41222 > 10.10.10.123.443: Flags [P.], seq 1:350: TLSv1.3 Client Hello",
        "   [Payload is Fully Encrypted - AES-GCM Ciphertext]"
      ];
    }
    // Domain scouting trackers (Lab 14)
    else if (cmd === 'whois') {
      if (arg1.includes('vulnerable-corp.com')) {
        response = [
          "Domain Name: VULNERABLE-CORP.COM",
          "Registry Domain ID: 221054231_DOMAIN_COM-VULN",
          "Registrar WHOIS Server: whois.corporate-domains.net",
          "Creation Date: 2012-05-10T11:00:00Z",
          "Registrant Name: Security Admin",
          "Registrant Organization: Vulnerable Corp Infrastructure Ltd",
          "Registrant Email: admin@vulnerable-corp.com",
          "Name Server: DNS-PRIMARY.VULNERABLE-CORP.COM",
          "💡 CLUE MATCHED: Run recon mapping scans like subfinder or gobuster next!"
        ];
      } else {
        response = ["Protocol Usage: whois vulnerable-corp.com"];
      }
    }
    else if (cmd === 'subfinder' || cmd === 'gobuster') {
      if (cmdLine.includes('vulnerable-corp.com')) {
        response = [
          "               ____  _           _ ",
          " ___ _   _ |  _ \\| |__  _ __  | |_   _",
          "/ __| | | || |_) | '_ \\| '_ \\ | | | | |",
          "\\__ \\ |_| ||  __/| | | | | | || | |_| |",
          "|___/\\__,_||_|   |_| |_|_| |_|/ |\\__,_|",
          "                               |__/",
          "subfinder v2.4.9 - Subdomain scanner agent",
          "========================================",
          "[+] Scanning target scope: vulnerable-corp.com",
          "[+] Found 3 subdomains:",
          "  - www.vulnerable-corp.com",
          "  - admin.vulnerable-corp.com",
          "  - staging-auth-test-portal-3000.vulnerable-corp.com",
          "========================================",
          "💡 CLUE UNLOCKED: Staging portal is running on port 3000! Scan with nmap (e.g. nmap staging-auth-test-portal-3000.vulnerable-corp.com) next!"
        ];
      } else {
        response = ["Usage: subfinder -d vulnerable-corp.com or gobuster dns -d vulnerable-corp.com"];
      }
    }
    // Standard Unix utilities
    else if (cmd === 'help') {
      response = [
        "Authorized Pwnbox Utilities:",
        "  help                           Display available commands map.",
        "  whoami                         Verify active user context.",
        "  ifconfig                       Retrieve assigned ethernet network parameters.",
        "  pwd                            Print working folder directory path.",
        "  ls                             List folder catalogs of current directory.",
        "  cd [folder]                    Navigate current working folder directory.",
        "  mkdir [name]                   Create a brand new directory inside current folder.",
        "  rm [name]                      Remove target file or folder.",
        "  cat [file]                     Read plain text of file payload outputs.",
        "  chmod [opts] [file]            Modify file system read/write/execute permissions.",
        "  nmap [IP]                      Network scanner utility mappings.",
        "  dirb [host]                    Directory brute-forcing tool scanner.",
        "  hydra [service://IP]           Password analysis brute forcing agent.",
        "  msfconsole                     Launch Metasploit exploit framework panel.",
        "  apktool d [file]               Decompile android packages.",
        "  nslookup [host]                Scout DNS configuration metrics.",
        "  dig [host] txt                 Inspect detailed DNS TXT logs.",
        "  tcpdump                        Sniff live local ethernet interfaces.",
        "  clear                          Wipe shell terminal history."
      ];
    } else if (cmd === 'whoami') {
      response = ["vimal_r"];
    } else if (cmd === 'ifconfig') {
      response = [
        "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
        "        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255",
        "        inet6 fe80::a00:27ff:fecc:4c3d  prefixlen 64  scopeid 0x20<link>",
        "        ether 08:00:27:cc:4c:3d  txqueuelen 1000  (Ethernet)",
        "",
        "tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500",
        "        inet 10.10.14.35  netmask 255.255.255.0  destination 10.10.14.1",
        "        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 500  (UNSPEC)"
      ];
    } else if (cmd === 'pwd') {
      response = [currentFolder];
    } else if (cmd === 'ls') {
      const files = systemFiles[currentFolder] || [];
      if (files.length === 0) {
        response = ["total 0"];
      } else {
        response = [
          `total ${files.length * 4}`,
          files.map(f => `${f.type === 'folder' ? 'drwxr-xr-x' : (f.permissions || '-rw-r--r--')}  kali  kali  ${f.size || '4.0 KB'}  ${f.name}${f.type === 'folder' ? '/' : ''}`).join('\n')
        ];
      }
    } else if (cmd === 'cd') {
      if (!arg1 || arg1 === '~') {
        setCurrentFolder('/home/kali');
        response = ["Navigated back to /home/kali"];
      } else if (arg1 === '..') {
        const folders = currentFolder.split('/');
        if (folders.length <= 2) {
          setCurrentFolder('/');
          response = ["Navigated to /"];
        } else {
          folders.pop();
          const parent = folders.join('/');
          setCurrentFolder(parent || '/');
          response = [`Navigated to ${parent || '/'}`];
        }
      } else {
        const targetPath = arg1.startsWith('/') ? arg1 : (currentFolder === '/' ? `/${arg1}` : `${currentFolder}/${arg1}`);
        if (systemFiles[targetPath]) {
          setCurrentFolder(targetPath);
          response = [`Navigated to ${targetPath}`];
        } else {
          // Check if it's a folder in standard folder array
          const currentFiles = systemFiles[currentFolder] || [];
          const match = currentFiles.find(f => f.name.toLowerCase() === arg1.toLowerCase() && f.type === 'folder');
          if (match) {
            const nextDir = currentFolder === '/' ? `/${match.name}` : `${currentFolder}/${match.name}`;
            setCurrentFolder(nextDir);
            response = [`Navigated to ${nextDir}`];
          } else {
            response = [`cd: file or folder path not found: '${arg1}'`];
          }
        }
      }
    } else if (cmd === 'cat') {
      if (!arg1) {
        response = ["Usage: cat [file_name]"];
      } else {
        const files = systemFiles[currentFolder] || [];
        const match = files.find(f => f.name.toLowerCase() === arg1.toLowerCase() && f.type === 'file');
        
        // Hosts exception helper
        if (arg1 === '/etc/hosts' || (currentFolder === '/etc' && arg1 === 'hosts')) {
          response = [
            "127.0.0.1\tlocalhost",
            "10.10.10.123\tvulnerable-corp.com",
            "10.10.10.123\tclient.local",
            "10.10.10.144\tstaging-auth-test-portal-3000.vulnerable-corp.com",
            "192.168.99.1\tadmin-beacon-gateway.local"
          ];
        } else if (match) {
          response = (match.content || '').split('\n');
        } else {
          response = [`cat: ${arg1}: File not found in folder.`];
        }
      }
    } else if (cmd === 'mkdir') {
      if (!arg1) {
        response = ["Usage: mkdir [directory_name]"];
      } else {
        const folderName = arg1.trim();
        const currentFiles = systemFiles[currentFolder] || [];
        if (currentFiles.some(f => f.name.toLowerCase() === folderName.toLowerCase())) {
          response = [`mkdir: cannot create directory '${folderName}': File exists`];
        } else {
          const updatedDir = [...currentFiles, { name: folderName, type: 'folder' as const }];
          const updatedFS = { ...vFS, [currentFolder]: updatedDir };
          const newPath = currentFolder === '/' ? `/${folderName}` : `${currentFolder}/${folderName}`;
          updatedFS[newPath] = [];
          
          // HACK triggers for Lab 1:
          if (selectedLabId === 1 && folderName.toLowerCase() === 'training') {
            updatedFS[newPath] = [
              { name: 'flag.txt', type: 'file' as const, size: '22 B', content: 'EV{TERMINAL_MASTER}' }
            ];
          }
          
          setVFS(updatedFS);
          response = [`Created directory '${folderName}' successfully.`];
        }
      }
    } else if (cmd === 'rm') {
      if (!arg1) {
        response = ["Usage: rm [file_or_directory_name]"];
      } else {
        const targetName = arg1.trim();
        const currentFiles = systemFiles[currentFolder] || [];
        const index = currentFiles.findIndex(f => f.name.toLowerCase() === targetName.toLowerCase());
        if (index === -1) {
          response = [`rm: cannot remove '${targetName}': No such file or directory`];
        } else {
          const removedItem = currentFiles[index];
          const updatedDir = currentFiles.filter((_, i) => i !== index);
          const updatedFS = { ...vFS, [currentFolder]: updatedDir };
          
          if (removedItem.type === 'folder') {
            const targetPath = currentFolder === '/' ? `/${removedItem.name}` : `${currentFolder}/${removedItem.name}`;
            delete updatedFS[targetPath];
          }
          setVFS(updatedFS);
          response = [`Removed '${targetName}' successfully.`];
        }
      }
    } else if (cmd === 'chmod') {
      const isExecutable = cmdLine.includes('+x') || cmdLine.includes('700') || cmdLine.includes('755') || cmdLine.includes('777');
      const filename = parts[parts.length - 1];
      if (!filename) {
        response = ["Usage: chmod +x [file_name]"];
      } else {
        const currentFiles = systemFiles[currentFolder] || [];
        const fIdx = currentFiles.findIndex(f => f.name.toLowerCase() === filename.toLowerCase());
        if (fIdx === -1) {
          response = [`chmod: cannot access '${filename}': No such file`];
        } else {
          setVFS(prev => {
            const current = { ...prev };
            const fls = [...current[currentFolder]];
            fls[fIdx] = { 
              ...fls[fIdx], 
              permissions: isExecutable ? '-rwx------' : '-rw-r--r--'
            };
            current[currentFolder] = fls;
            return current;
          });
          response = [`Modified '${filename}' permissions successfully.`];
        }
      }
    } else if (cmdLine.startsWith('./') || cmdLine === 'run_backup.sh') {
      const filename = cmdLine.replace(/^\.\//, '');
      const files = systemFiles[currentFolder] || [];
      const match = files.find(f => f.name.toLowerCase() === filename.toLowerCase());
      if (match) {
        if (match.permissions && match.permissions.includes('x')) {
          response = [
            "Initializing database backup sync...",
            "Accessing primary SQL server logging clusters...",
            "Backup cluster integrity checked cleanly.",
            "🔓 EXTREMELY LOGGED CORE RECORD: EV{PERMISSION_MASTER}"
          ];
        } else {
          response = [`bash: ./${filename}: Permission denied`];
        }
      } else {
        response = [`bash: ./${filename}: No such file or directory`];
      }
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setCmdInput('');
      return;
    } else {
      response = [
        `kali: command not recognized: '${cmd}'.`,
        "Type 'help' to review structural list of cyber tools."
      ];
    }

    setTerminalLogs(prev => [...prev, ...response, ""]);
    setCmdInput('');

    // scroll bottom sequence
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Simulated Web applications interactions
  const handleBrowserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = browserUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setBrowserUrl('http://' + url);
    }
  };

  // Intercept headers inside Burp proxy trigger
  const handleBurpForward = () => {
    setBurpHistory(prev => [`Forwarded intercepted request packet to server...`, ...prev]);
    
    // Check if user edited X-User-Role from guest/worker to admin!
    if (burpRequestHeaders.toLowerCase().includes("x-user-role: admin") || 
        burpRequestHeaders.toLowerCase().includes('"role": "admin"') ||
        burpRequestHeaders.toLowerCase().includes("x-security-flag-check: enabled")) {
      setBrowserPayloadResult("EV{BURP_PROXY_INTERCEPT_SUCCESS_991}");
      setCookieToken("session_id=81ac902d8f99e32a; secure_guest=false; role=admin; admin_token=EV_BURP_SUCCESS");
      alert("Proxy payload modifications processed! FLAG UNLOCKED: EV{BURP_PROXY_INTERCEPT_SUCCESS_991}");
    } else {
      setBrowserPayloadResult("ACCESS GRANTED: Status guest. Headers matched Default values.");
    }
  };

  // Nmap visual scanner sequence
  const startVisualScan = () => {
    setIsScanning(true);
    setScanOutput(["[+] Initializing zenmap process parameters...", "Target IP parsed: " + scanTarget]);
    
    let counter = 0;
    const scannerInterval = setInterval(() => {
      counter++;
      if (counter === 1) {
        setScanOutput(prev => [...prev, "[*] Executing intense TCP synchronisation handshake scan..."]);
      } else if (counter === 2) {
        setScanOutput(prev => [...prev, "[*] Analyzing active services on 1000 ports..."]);
      } else if (counter === 3) {
        setScanOutput(prev => [...prev, 
          "[+] Discovery of Open interfaces:",
          "  Port 21: vsftpd 3.0.3 FTP listener (Anonymous access blocked)",
          "  Port 22: OpenSSH service (Version 8.2p1)",
          "  Port 80: Apache server (Header comment: Academy Enterprise Platform)",
          "  Port 8080: Alternate python web admin console."
        ]);
      } else if (counter === 4) {
        setScanOutput(prev => [...prev, "[+] Port scan sequence finished. Machine ready for exploitation.", ""]);
        setIsScanning(false);
        clearInterval(scannerInterval);
      }
    }, 1000);
  };

  // Simple copy flag utility
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied flag: ${text}`);
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0d0f14] z-50 overflow-hidden flex flex-col font-mono select-none"
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
      id="kali-os-desktop-viewport"
    >
      
      {/* KALI TOP HEADER DESKTOP PANEL BAR */}
      <div className="h-9 bg-[#111218] border-b border-[#2d3748]/55 flex items-center justify-between px-3 text-xs text-slate-300 relative z-[9999]">
        
        {/* Left segment Application Menu */}
        <div className="flex items-center gap-3">
          {/* Applications Button */}
          <button 
            onClick={() => setIsApplicationsMenuOpen(!isApplicationsMenuOpen)}
            className="flex items-center gap-1.5 px-2 py-1 bg-[#1a202c]/65 hover:bg-[#2d3748] rounded border border-slate-700/50 cursor-pointer font-bold text-slate-100"
          >
            <Shield className="w-3.5 h-3.5 text-brand-cyan animate-pulse shrink-0" />
            <span className="text-[10px] tracking-wide uppercase">Applications</span>
          </button>

          {/* Quick Launch Shortcuts */}
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <button onClick={() => openWindow('terminal')} className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer" title="QTerminal Shell">
            <TerminalIcon className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => openWindow('browser')} className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer" title="Firefox ESR Web Browser">
            <Globe className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => openWindow('burp')} className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer" title="Burp Suite Interceptor">
            <Code className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => openWindow('files')} className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer" title="Thunar Files">
            <Folder className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => openWindow('nmap')} className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer" title="Zenmap scan utility">
            <Activity className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center active target telemetry banner */}
        <div className="hidden md:flex items-center gap-2.5 bg-brand-cyan/5 border border-brand-cyan/20 px-3 py-0.5 rounded-full text-[10px]">
          <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full inline-block animate-ping"></span>
          <span className="text-slate-400">ACTIVE VM LAB LINK:</span>
          <span className="font-bold text-brand-cyan">10.10.10.123 (vulnerable-corp.com)</span>
          <span className="bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-semibold">tun0: 10.10.14.35</span>
        </div>

        {/* Right segment widgets */}
        <div className="flex items-center gap-4">
          
          {/* CPU telemetry */}
          <div className="hidden lg:flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] text-slate-400">CPU</span>
            <div className="w-12 h-1.5 bg-slate-800 rounded-sm overflow-hidden">
              <div className="h-full bg-brand-cyan" style={{ width: `${cpuUsage}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-500 w-7 text-right">{cpuUsage}%</span>
          </div>

          {/* Ram telemetry */}
          <div className="hidden lg:flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] text-slate-400">MEM</span>
            <div className="w-12 h-1.5 bg-slate-800 rounded-sm overflow-hidden">
              <div className="h-full bg-brand-rose" style={{ width: `${ramUsage}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-500 w-8 text-right">{ramUsage}%</span>
          </div>

          {/* countdown timer clock */}
          <div className="flex items-center gap-1.5 bg-brand-rose/10 border border-brand-rose/25 px-2 py-0.5 rounded text-[10px] text-brand-rose font-bold">
            <Clock className="w-3 h-3 animate-spin text-brand-rose" />
            <span>TIME: {timeLeft}</span>
          </div>

          {/* Connection status indicator */}
          <div className="flex items-center gap-1 text-[10px] text-brand-emerald font-bold">
            <Wifi className="w-3.5 h-3.5" />
            <span>ONLINE</span>
          </div>

          <button onClick={() => window.close()} className="px-1.5 py-0.5 bg-brand-rose/15 hover:bg-brand-rose hover:text-white rounded border border-brand-rose/20 text-[10px] cursor-pointer text-brand-rose font-semibold">
            Term. Session
          </button>
        </div>
      </div>

      {/* APPLICATIONS DROPDOWN DRAWER */}
      {isApplicationsMenuOpen && (
        <div className="absolute top-9 left-3 w-64 bg-[#111218]/95 border border-[#2d3748]/70 rounded-b-xl shadow-2xl p-3 z-[99999] backdrop-blur-md">
          <div className="text-[10px] text-slate-500 font-bold uppercase pb-1.5 border-b border-slate-800 mb-2">Kali Security Tools Catalog</div>
          <div className="space-y-1">
            <button onClick={() => openWindow('terminal')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left cursor-pointer">
              <TerminalIcon className="w-3.5 h-3.5 text-brand-cyan" />
              <span>QTerminal console interface</span>
            </button>
            <button onClick={() => openWindow('browser')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-brand-blue" />
              <span>Firefox ESR Web inspector</span>
            </button>
            <button onClick={() => openWindow('burp')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left cursor-pointer">
              <Code className="w-3.5 h-3.5 text-[#ff6600]" />
              <span>Burp Proxy interceptor suite</span>
            </button>
            <button onClick={() => openWindow('nmap')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left cursor-pointer">
              <Activity className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Zenmap Scanner GUI</span>
            </button>
            <button onClick={() => openWindow('files')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left cursor-pointer">
              <Folder className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Thunar Files system explorer</span>
            </button>
            <button onClick={() => openWindow('notes')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5 text-[#e2b95c]" />
              <span>Pwnbox Hack Labs manual</span>
            </button>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-slate-500 text-center uppercase tracking-wider font-semibold">
            EV Cyber Academy Capstone OS
          </div>
        </div>
      )}

      {/* DESKTOP DESK CONTAINING ICONS AND FLOATING WINDOWS */}
      <div className="flex-1 relative p-6 mt-1 flex flex-col justify-between" id="kali-os-glass-wallpaper">
        
        {/* Subtle grid elements and dragon design background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.06] pointer-events-none" id="background-dragon-logo">
          <Shield className="w-96 h-96 text-brand-blue" />
          <div className="absolute font-sans font-black text-6xl tracking-wide text-brand-cyan select-none uppercase">KALI PWNBOX</div>
        </div>

        {/* Column of grid shortcuts */}
        <div className="grid grid-cols-1 auto-rows-[80px] gap-4 w-28 relative z-10" id="desktop-shortcuts">
          
          <div onDoubleClick={() => openWindow('terminal')} onClick={() => focusWindow('terminal')} className="flex flex-col items-center justify-center rounded-xl p-1 hover:bg-white/5 border border-transparent hover:border-white/10 text-center cursor-pointer group transition-all">
            <div className="w-9 h-9 bg-slate-900/40 rounded-xl flex items-center justify-center border border-slate-800/80 group-hover:bg-brand-cyan/10 group-hover:border-brand-cyan/20 transition-all shadow-md">
              <TerminalIcon className="w-5 h-5 text-brand-cyan" />
            </div>
            <span className="text-[10px] text-slate-300 font-semibold mt-1 shadow-sm truncate w-full text-center">Shell</span>
          </div>

          <div onDoubleClick={() => openWindow('browser')} onClick={() => focusWindow('browser')} className="flex flex-col items-center justify-center rounded-xl p-1 hover:bg-white/5 border border-transparent hover:border-white/10 text-center cursor-pointer group transition-all">
            <div className="w-9 h-9 bg-slate-900/40 rounded-xl flex items-center justify-center border border-slate-800/80 group-hover:bg-brand-blue/10 group-hover:border-brand-blue/20 transition-all shadow-md">
              <Globe className="w-5 h-5 text-brand-blue" />
            </div>
            <span className="text-[10px] text-slate-300 font-semibold mt-1 shadow-sm truncate w-full text-center">Web Browser</span>
          </div>

          <div onDoubleClick={() => openWindow('burp')} onClick={() => focusWindow('burp')} className="flex flex-col items-center justify-center rounded-xl p-1 hover:bg-white/5 border border-transparent hover:border-white/10 text-center cursor-pointer group transition-all">
            <div className="w-9 h-9 bg-slate-900/40 rounded-xl flex items-center justify-center border border-slate-800/80 group-hover:bg-orange-500/10 group-hover:border-orange-500/2 transition-all shadow-md">
              <Code className="w-5 h-5 text-[#ff6600]" />
            </div>
            <span className="text-[10px] text-slate-300 font-semibold mt-1 shadow-sm truncate w-full text-center">Burp Proxy</span>
          </div>

          <div onDoubleClick={() => openWindow('files')} onClick={() => focusWindow('files')} className="flex flex-col items-center justify-center rounded-xl p-1 hover:bg-white/5 border border-transparent hover:border-white/10 text-center cursor-pointer group transition-all">
            <div className="w-9 h-9 bg-slate-900/40 rounded-xl flex items-center justify-center border border-slate-800/80 group-hover:bg-brand-cyan/10 group-hover:border-brand-cyan/20 transition-all shadow-md">
              <Folder className="w-5 h-5 text-brand-cyan" />
            </div>
            <span className="text-[10px] text-slate-300 font-semibold mt-1 shadow-sm truncate w-full text-center">File System</span>
          </div>

          <div onDoubleClick={() => openWindow('notes')} onClick={() => focusWindow('notes')} className="flex flex-col items-center justify-center rounded-xl p-1 hover:bg-white/5 border border-transparent hover:border-white/10 text-center cursor-pointer group transition-all">
            <div className="w-9 h-9 bg-slate-900/40 rounded-xl flex items-center justify-center border border-slate-800/80 group-hover:bg-yellow-500/10 group-hover:border-yellow-500/2 transition-all shadow-md">
              <HelpCircle className="w-5 h-5 text-[#e2b95c]" />
            </div>
            <span className="text-[10px] text-slate-300 font-semibold mt-1 shadow-sm truncate w-full text-center">Lab Notebook</span>
          </div>

          <div onDoubleClick={() => openWindow('nmap')} onClick={() => focusWindow('nmap')} className="flex flex-col items-center justify-center rounded-xl p-1 hover:bg-white/5 border border-transparent hover:border-white/10 text-center cursor-pointer group transition-all">
            <div className="w-9 h-9 bg-slate-900/40 rounded-xl flex items-center justify-center border border-slate-800/80 group-hover:bg-brand-emerald/10 group-hover:border-brand-emerald/2 transition-all shadow-md">
              <Activity className="w-5 h-5 text-brand-emerald" />
            </div>
            <span className="text-[10px] text-slate-300 font-semibold mt-1 shadow-sm truncate w-full text-center">Zenmap Scan</span>
          </div>
        </div>

        {/* BOTTOM BRAND FOOTER IN KALI */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 relative z-10 w-full pt-10" id="kali-desktop-indicator-bar-brand-footer">
          <span>Kali OS GNU/Linux 2026.2 (EV Cyber Academy edition)</span>
          <span>Click and drag top headers of windows to move. Double click on shortcuts to launch.</span>
        </div>

        {/* FLOATING WINDOWING SYSTEM PORTAL */}
        {windows.map((win) => {
          if (!win.isOpen) return null;
          const isActive = activeWindowId === win.id;
          
          return (
            <div 
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className={`absolute rounded-xl border shadow-2xl flex flex-col overflow-hidden bg-[#0a0f1d] transition-all duration-75 ${
                isActive ? 'border-[#3b82f6]/70 shadow-[#3b82f6]/4' : 'border-slate-800/80 shadow-black/80'
              } ${
                win.isMaximized ? 'inset-x-0 inset-y-1 z-[5000]' : ''
              }`}
              style={win.isMaximized ? {} : {
                zIndex: win.zIndex,
                left: `${win.x}px`,
                top: `${win.y}px`,
                width: `${win.width}px`,
                height: `${win.height}px`
              }}
              id={`floating-window-${win.id}`}
            >
              
              {/* WINDOW HEAD TITLE BAR */}
              <div 
                onMouseDown={(e) => handleHeaderMouseDown(win.id, e)}
                className={`h-8 px-3 flex items-center justify-between cursor-move select-none ${
                  isActive ? 'bg-[#151d30]' : 'bg-[#111218]'
                }`}
                id={`window-head-${win.id}`}
              >
                {/* Title info */}
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider truncate text-slate-300">
                  {win.type === 'terminal' && <TerminalIcon className="w-3.5 h-3.5 text-brand-cyan" />}
                  {win.type === 'browser' && <Globe className="w-3.5 h-3.5 text-brand-blue" />}
                  {win.type === 'burp' && <Code className="w-3.5 h-3.5 text-[#ff6600]" />}
                  {win.type === 'files' && <Folder className="w-3.5 h-3.5 text-brand-cyan" />}
                  {win.type === 'notes' && <HelpCircle className="w-3.5 h-3.5 text-[#e2b95c]" />}
                  {win.type === 'nmap' && <Activity className="w-3.5 h-3.5 text-brand-emerald" />}
                  <span className="truncate">{win.title}</span>
                </div>

                {/* Window operations buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={(e) => toggleMaximize(win.id, e)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-2.5 h-2.5" />
                  </button>
                  <button 
                    onClick={(e) => closeWindow(win.id, e)}
                    className="p-1 hover:bg-rose-950/50 hover:text-rose-400 rounded text-slate-400 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* WINDOW WORKSPACE INTERIORS */}
              <div className="flex-1 overflow-auto flex flex-col text-xs text-slate-200">
                
                {/* 1. TERMINAL WINDOW ARCHITECTURE */}
                {win.type === 'terminal' && (
                  <div className="flex-1 bg-[#050811] p-4 font-mono overflow-y-auto flex flex-col justify-between select-text selection:bg-[#34495e]">
                    <div className="space-y-1.5 flex-1 pr-1">
                      {terminalLogs.map((logLine, logIdx) => (
                        <div key={logIdx} className="whitespace-pre-wrap leading-relaxed">
                          {logLine.startsWith('vimal_r@kali:~$') ? (
                            <span className="text-brand-cyan font-bold">{logLine}</span>
                          ) : logLine.includes('EV{') ? (
                            <span className="bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30 px-3 py-1.5 rounded-xl block font-black text-center my-2 animate-bounce">
                              🎉 FLAG UNLOCKED: {logLine}
                            </span>
                          ) : logLine.startsWith('kali') || logLine.includes('not recognized') ? (
                            <span className="text-brand-rose">{logLine}</span>
                          ) : (
                            <span>{logLine}</span>
                          )}
                        </div>
                      ))}
                      <div ref={terminalBottomRef} />
                    </div>

                    <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 border-t border-slate-900 pt-3 mt-3 shrink-0">
                      <span className="text-brand-cyan font-bold block">vimal_r@kali:~$</span>
                      <input 
                        type="text" 
                        value={cmdInput}
                        onChange={(e) => setCmdInput(e.target.value)}
                        className="flex-1 bg-transparent border-none text-brand-cyan outline-none font-mono text-xs focus:ring-0 focus:outline-none"
                        placeholder="e.g. nmap 10.10.10.123 or help"
                        autoFocus={isActive}
                      />
                    </form>
                  </div>
                )}

                {/* 2. FIREFOX WEB INSPECTOR BROWSER */}
                {win.type === 'browser' && (
                  <div className="flex-1 bg-[#1a1d24] flex flex-col overflow-hidden">
                    {/* Browser url nav interface */}
                    <div className="h-10 bg-[#12141a] px-3 border-b border-slate-800 flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-700 inline-block"></span>
                        <span className="w-2 h-2 rounded-full bg-slate-700 inline-block"></span>
                      </div>
                      
                      <form onSubmit={handleBrowserSubmit} className="flex-1 relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Lock className="w-3 h-3 text-brand-cyan" />
                        </span>
                        <input 
                          type="text" 
                          value={browserUrl}
                          onChange={(e) => setBrowserUrl(e.target.value)}
                          className="w-full bg-[#1c202a] border border-slate-800 rounded px-7 py-1 text-[11px] outline-none text-slate-100"
                        />
                      </form>

                      <button onClick={() => setCookieToken('session_id=81ac902d8f99e32a; secure_guest=false')} className="p-1 hover:bg-slate-800 rounded" title="Refresh Cookies">
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>

                    {/* render interactive vulnerable server subpages or web pages */}
                    <div className="flex-1 bg-slate-950 p-5 overflow-y-auto selection:bg-[#34495e] select-text">
                      {browserUrl.includes('vulnerable-corp.com') || browserUrl.includes('10.10.10.123') ? (
                        <div className="space-y-5">
                          {/* Top web logo header */}
                          <div className="bg-[#111218] rounded-xl p-4 border border-brand-rose/20 flex justify-between items-center">
                            <div>
                              <span className="text-[10px] text-brand-rose font-bold bg-brand-rose/10 px-2 py-0.5 rounded border border-brand-rose/15 uppercase">Internal Sandbox Page Target</span>
                              <h2 className="text-base font-extrabold text-white tracking-tight mt-15 mt-1">Vulnerable-Corp Administrative Infrastructure</h2>
                            </div>
                            <span className="text-slate-500 text-[10px] font-mono leading-none">Status: 200 OK</span>
                          </div>

                          {/* Login Credentials exploit panel page */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            {/* Panel 1: Portal database */}
                            <div className="bg-[#111218]/85 p-4 rounded-xl border border-slate-800 space-y-3">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1 flex items-center gap-2">
                                <Database className="w-3.5 h-3.5 text-brand-blue" /> Administrative Control Hub
                              </h4>
                              <p className="text-[10px] text-slate-500 leading-normal">
                                Authenticate utilizing localized router administration credentials. Crack key strings using hydra or discover downloads inside file manager notes.
                              </p>

                              <div className="space-y-2">
                                <input 
                                  type="text" 
                                  placeholder="Username" 
                                  value={adminUsernameInput}
                                  onChange={(e) => setAdminUsernameInput(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white" 
                                />
                                <input 
                                  type="password" 
                                  placeholder="Password" 
                                  value={adminPasswordInput}
                                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white" 
                                />
                                <button 
                                  onClick={() => {
                                    if (adminUsernameInput === 'academy_admin' && adminPasswordInput === 'EV_Secure_2026') {
                                      setBrowserPayloadResult('FLAG_KEY: EV{ADMIN_PORTAL_BYPASS_COMPLETE_2026}');
                                      alert("Validated! Flag revealed: EV{ADMIN_PORTAL_BYPASS_COMPLETE_2026}");
                                    } else {
                                      alert("ERROR: ACCESS DENIED. Action has been recorded!");
                                    }
                                  }}
                                  className="w-full py-1.5 bg-brand-blue hover:bg-brand-blue/90 font-bold rounded text-xs text-white cursor-pointer uppercase transition-all"
                                >
                                  Authenticate Admin
                                </button>
                              </div>
                            </div>

                            {/* Panel 2: Cookies headers inspector */}
                            <div className="bg-[#111218]/85 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1 flex items-center gap-2">
                                  <Code className="w-3.5 h-3.5 text-brand-cyan" /> active cookies header
                                </h4>
                                <div className="bg-slate-900 p-2 rounded border border-slate-800 font-mono text-[10px] text-brand-cyan break-all leading-normal">
                                  {cookieToken}
                                </div>
                              </div>

                              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 mt-2">
                                <span className="text-[10px] text-slate-500 font-bold block mb-1">PROMPT INSTRUCTIONS:</span>
                                <span className="text-[11px] text-slate-300 block leading-normal">
                                  Need privilege escalation? Open Burp Proxy Interceptor tool, check Intercept is ON, edit request payload header <strong className="text-brand-rose">X-User-Role: guest</strong> to <strong className="text-brand-emerald">admin</strong>, and tap Forward payload!
                                </span>
                              </div>
                            </div>

                          </div>

                          {/* Database result container */}
                          {browserPayloadResult && (
                            <div className="bg-[#050a12] border border-brand-emerald/20 p-4 rounded-xl space-y-2">
                              <span className="text-[10px] text-brand-emerald font-bold uppercase tracking-wider block">Decrypted payload Response</span>
                              <div className="text-xs text-slate-100 font-bold font-mono">
                                {browserPayloadResult}
                              </div>
                              <button 
                                onClick={() => copyToClipboard(browserPayloadResult)}
                                className="px-3 py-1 bg-brand-emerald/10 hover:bg-brand-emerald/20 border border-brand-emerald/30 text-brand-emerald text-[10px] font-bold rounded cursor-pointer mt-1"
                              >
                                Copy Flag Token
                              </button>
                            </div>
                          )}

                          {/* Footer details */}
                          <div className="text-[9px] text-slate-600 text-center">
                            Designed security academy training sandbox server. 10.10.10.123
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center text-slate-500 text-xs">
                          <Compass className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                          Cannot find target IP payload database. Try entering <strong className="text-brand-cyan">http://10.10.10.123</strong> inside the browser URL address bar.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. BURP PROXY CONTROLLER */}
                {win.type === 'burp' && (
                  <div className="flex-1 bg-[#1a1c23] flex flex-col overflow-hidden select-text">
                    {/* Tool Bar controls */}
                    <div className="h-10 bg-[#12141a] px-3 flex items-center justify-between border-b border-slate-800 shrink-0">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setBurpInterceptActive(!burpInterceptActive)}
                          className={`px-3 py-1 text-[11px] font-bold rounded cursor-pointer uppercase transition-all ${
                            burpInterceptActive ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
                          }`}
                        >
                          Intercept is {burpInterceptActive ? 'ON' : 'OFF'}
                        </button>
                        <button 
                          onClick={handleBurpForward}
                          className="px-3 py-1 bg-[#1f2937] hover:bg-slate-700 border border-slate-800 text-xs rounded text-slate-200 cursor-pointer"
                        >
                          Forward Payload
                        </button>
                      </div>

                      <span className="text-[10px] text-[#ff6600] uppercase font-mono font-black">Target proxy: client.local</span>
                    </div>

                    {/* Split editors */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 p-4 gap-4 overflow-hidden">
                      <div className="md:col-span-3 flex flex-col space-y-2 overflow-hidden height-full">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Raw Request Packet Intercept (EDIT ME!)</span>
                        <textarea 
                          value={burpRequestHeaders}
                          onChange={(e) => setBurpRequestHeaders(e.target.value)}
                          className="flex-1 w-full bg-[#0d0f14] border border-slate-800 rounded p-3 font-mono text-[11px] text-brand-cyan focus:outline-none focus:border-[#ff6600]/60 resize-none h-48 focus:ring-0"
                        />
                      </div>
                      
                      <div className="md:col-span-2 flex flex-col space-y-2 overflow-hidden height-full">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Proxy logs dossier history</span>
                        <div className="flex-1 bg-[#0d0f14] border border-slate-800 rounded p-3 overflow-y-auto space-y-2 text-[10px] font-mono leading-relaxed">
                          {burpHistory.map((item, idx) => (
                            <div key={idx} className="border-b border-slate-900 pb-1 text-slate-400">
                              <span className="text-slate-600 block">[SYSTEM]</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. ZENMAP PORT SCANNER GUI */}
                {win.type === 'nmap' && (
                  <div className="flex-1 bg-[#161a22] p-4 flex flex-col justify-between overflow-hidden select-text">
                    <div className="space-y-4 flex-1 overflow-y-auto max-h-75 pr-1">
                      <div className="flex bg-[#111218] p-3 rounded-lg border border-slate-800 gap-3 items-center">
                        <span className="text-xs text-slate-400 uppercase font-bold">Scope Target:</span>
                        <input 
                          type="text" 
                          value={scanTarget}
                          onChange={(e) => setScanTarget(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-sm px-2.5 py-1 text-xs text-white" 
                        />
                        <button 
                          onClick={startVisualScan}
                          disabled={isScanning}
                          className="px-4 py-1.5 bg-brand-emerald hover:bg-brand-emerald/90 text-white text-xs font-bold rounded cursor-pointer transition-colors disabled:bg-slate-800 disabled:text-slate-500 uppercase"
                        >
                          {isScanning ? 'Scanning...' : 'Scan Port Array'}
                        </button>
                      </div>

                      <div className="bg-[#0b0c10] border border-slate-800 rounded p-3 h-48 overflow-y-auto font-mono text-[11px] text-brand-emerald leading-relaxed">
                        {scanOutput.map((l, idx) => (
                          <div key={idx}>{l}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. THUNAR FILE SYSTEM EXPLORER */}
                {win.type === 'files' && (
                  <div className="flex-1 bg-[#14161d] flex select-text">
                    {/* Left path navigations bar */}
                    <div className="w-36 bg-[#0f1115] border-r border-slate-800 p-2 space-y-1.5 shrink-0">
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider px-2 border-b border-slate-800/60 pb-1 mb-2">My File system</div>
                      <button 
                        onClick={() => setCurrentFolder('/home/kali')}
                        className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center gap-1.5 cursor-pointer ${
                          currentFolder === '/home/kali' ? 'bg-brand-cyan/15 text-brand-cyan':'text-slate-400'
                        }`}
                      >
                        <Folder className="w-3.5 h-3.5" /> ~/home/kali
                      </button>
                      <button 
                        onClick={() => setCurrentFolder('/home/kali/Desktop')}
                        className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center gap-1.5 cursor-pointer ${
                          currentFolder === '/home/kali/Desktop' ? 'bg-brand-cyan/15 text-brand-cyan':'text-slate-400'
                        }`}
                      >
                        <Folder className="w-3.5 h-3.5" /> Desktop
                      </button>
                      <button 
                        onClick={() => setCurrentFolder('/home/kali/Downloads')}
                        className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center gap-1.5 cursor-pointer ${
                          currentFolder === '/home/kali/Downloads' ? 'bg-brand-cyan/15 text-brand-cyan':'text-slate-400'
                        }`}
                      >
                        <Folder className="w-3.5 h-3.5" /> Downloads
                      </button>
                      <button 
                        onClick={() => setCurrentFolder('/home/kali/Documents')}
                        className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center gap-1.5 cursor-pointer ${
                          currentFolder === '/home/kali/Documents' ? 'bg-brand-cyan/15 text-brand-cyan':'text-slate-400'
                        }`}
                      >
                        <Folder className="w-3.5 h-3.5" /> Documents
                      </button>
                    </div>

                    {/* Files panel area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      <div className="text-[11px] text-slate-500 font-semibold border-b border-slate-800pb-1">
                        Current Directory: <span className="text-slate-300">{currentFolder}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(systemFiles[currentFolder] || []).map((file, fIdx) => (
                          <div 
                            key={fIdx} 
                            onDoubleClick={() => {
                              if (file.type === 'folder') {
                                setCurrentFolder(`${currentFolder}/${file.name}`);
                              } else {
                                // show file content
                                alert(`${file.name} CONTENT:\n\n${file.content}`);
                              }
                            }}
                            className="bg-[#1b1f2b]/40 hover:bg-[#1b1f2b]/80 border border-slate-800/80 hover:border-slate-700/60 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all h-20"
                          >
                            {file.type === 'folder' ? (
                              <Folder className="w-6 h-6 text-brand-cyan mb-1.5" />
                            ) : (
                              <FileText className="w-6 h-6 text-slate-400 mb-1.5" />
                            )}
                            <span className="text-[10px] text-slate-200 block truncate w-full font-semibold">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. LAB MANUAL / COMPANION HACK TRACKER */}
                {win.type === 'notes' && (() => {
                  const currentLab = LABS_DATA.find(l => l.id === selectedLabId) || LABS_DATA[0];
                  const isAlreadySolved = userProgress.completedLabs.includes(currentLab.id);

                  return (
                    <div className="flex-1 bg-[#0d0f14] flex flex-col overflow-hidden max-h-full">
                      {/* Top Action Header with dynamic lab selector */}
                      <div className="bg-[#12141a] px-4 py-3 border-b border-slate-800 flex flex-col gap-2 shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse"></span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LAB COMPANION MANUAL</span>
                          </div>
                          {isAlreadySolved ? (
                            <span className="px-2.5 py-0.5 bg-brand-emerald/15 hover:bg-brand-emerald/20 border border-brand-emerald/30 text-brand-emerald text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                              ✓ Solved & Synced
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                              ● Pending Solution
                            </span>
                          )}
                        </div>

                        {/* Interactive Selection Dropdown dropdown */}
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0 font-mono">SELECT MISSION:</label>
                          <select 
                            value={selectedLabId}
                            onChange={(e) => {
                              setSelectedLabId(parseInt(e.target.value));
                              setFlagSubmittedInput('');
                              setShowCompanionHints(false);
                            }}
                            className="bg-[#1c202a] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 outline-none flex-1 focus:border-brand-cyan max-w-full font-semibold cursor-pointer"
                          >
                            {LABS_DATA.map((lab) => (
                              <option key={lab.id} value={lab.id}>
                                LAB {lab.id < 10 ? `0${lab.id}` : lab.id}: {lab.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Manual body and dynamic workspace */}
                      <div className="flex-1 p-5 overflow-y-auto selection:bg-[#34495e] select-text space-y-5">
                        
                        {/* Dynamic Metadata Block */}
                        <div className="bg-[#12141a]/90 rounded-xl p-4 border border-slate-800/80 flex flex-wrap justify-between items-center gap-4">
                          <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-white tracking-tight">{currentLab.title}</h3>
                            <div className="flex items-center gap-2.5 text-[10px] font-mono">
                              <span className="text-slate-400 font-bold uppercase">{currentLab.category}</span>
                              <span className="text-slate-600">•</span>
                              <span className={`font-black uppercase ${
                                currentLab.difficulty === 'Beginner' ? 'text-brand-emerald' : 
                                currentLab.difficulty === 'Intermediate' ? 'text-yellow-500' : 'text-brand-rose'
                              }`}>{currentLab.difficulty}</span>
                            </div>
                          </div>
                          <div className="px-3.5 py-1.5 bg-[#9fef00]/10 border border-[#9fef00]/25 rounded-lg text-center">
                            <span className="text-[11px] text-[#9fef00] font-black uppercase tracking-widest font-mono">+{currentLab.xpReward} XP</span>
                          </div>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex bg-[#12141a] border border-slate-800 p-0.5 rounded-xl gap-1">
                          <button
                            onClick={() => setCompanionTab('instructions')}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                              companionTab === 'instructions'
                                ? 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan shadow shadow-black/40'
                                : 'text-slate-400 hover:text-white border-transparent'
                            }`}
                          >
                            <TerminalIcon className="w-3 h-3" />
                            Guide
                          </button>

                          <button
                            onClick={() => setCompanionTab('solution')}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                              companionTab === 'solution'
                                ? 'bg-brand-rose/15 border-brand-rose/25 text-brand-rose font-black shadow shadow-black/40'
                                : 'text-slate-400 hover:text-white border-transparent'
                            }`}
                          >
                            <Key className="w-3 h-3 text-brand-rose animate-pulse" />
                            Solution 🔑
                          </button>

                          <button
                            onClick={() => setCompanionTab('theory')}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                              companionTab === 'theory'
                                ? 'bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald'
                                : 'text-slate-400 hover:text-white border-transparent'
                            }`}
                          >
                            <Code className="w-3 h-3" />
                            Theory
                          </button>
                        </div>

                        {/* TAB 1: GUIDE */}
                        {companionTab === 'instructions' && (
                          <div className="space-y-4">
                            {/* Objective Section */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-brand-rose" /> Objective Goal
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed bg-[#1b1f2b]/15 p-3 rounded-lg border border-slate-800/40">
                                {currentLab.objective}
                              </p>
                            </div>

                            {/* Step-by-Step Instructions */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                <ArrowRight className="w-3.5 h-3.5 text-brand-cyan" /> Manual instructions
                              </h4>
                              <div className="space-y-2">
                                {currentLab.instructions.map((step, idx) => (
                                  <div key={idx} className="flex gap-2 text-xs text-slate-300 bg-[#161a24]/40 p-3 rounded-xl border border-slate-800/50 leading-relaxed">
                                    <span className="text-brand-cyan font-bold font-mono text-xs">{idx + 1}.</span>
                                    <div>{step}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 2: SOLUTION */}
                        {companionTab === 'solution' && (() => {
                          const solution = LAB_SOLUTIONS_MAP[currentLab.id];
                          return (
                            <div className="space-y-4">
                              <div className="bg-[#1a1219]/90 border border-brand-rose/20 rounded-xl p-4.5 space-y-3">
                                <h4 className="text-xs font-black uppercase text-brand-rose tracking-wider flex items-center gap-1.5">
                                  <Key className="w-3.5 h-3.5 text-brand-rose" /> Step-by-Step Solution
                                </h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                                  Execute these explicit actions inside your live desktop session or models to achieve completion:
                                </p>
                                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                  {solution ? (
                                    solution.steps.map((step, idx) => (
                                      <div key={idx} className="flex gap-2 text-xs text-slate-300 bg-[#241722]/50 p-2.5 rounded-lg border border-brand-rose/10 leading-relaxed">
                                        <span className="text-brand-rose font-black font-mono text-xs">{idx + 1}.</span>
                                        <div>{step}</div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs text-slate-500">Walkthrough loading...</p>
                                  )}
                                </div>
                              </div>

                              {solution?.commandSolution && (
                                <div className="bg-[#12141a]/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                                  <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-black font-mono">
                                    <span>Direct Command Cheat Sheet</span>
                                    <button 
                                      onClick={() => {
                                        copyToClipboard(solution.commandSolution || '');
                                      }}
                                      className="text-brand-rose hover:text-white flex items-center gap-1 font-sans text-[9px] uppercase tracking-wider font-extrabold cursor-pointer border border-[#f43f5e]/20 bg-brand-rose/5 px-2 py-0.5 rounded"
                                    >
                                      <Copy className="w-3 h-3" /> Copy Cmd
                                    </button>
                                  </div>
                                  <div className="p-2.5 bg-black/45 rounded border border-slate-800/80 font-mono text-[10px] text-[#9fef00] select-all truncate">
                                    {solution.commandSolution}
                                  </div>
                                </div>
                              )}

                              <div className="bg-[#0c1412] border border-brand-emerald/20 rounded-xl p-3.5 flex justify-between items-center gap-2">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wide block">Validation Flag Buffer:</span>
                                  <span className="text-xs font-mono font-black text-brand-emerald select-all break-all">{solution ? solution.expectedFlag : currentLab.flag}</span>
                                </div>
                                <button 
                                  onClick={() => copyToClipboard(solution ? solution.expectedFlag : currentLab.flag)}
                                  className="px-2.5 py-1 bg-brand-emerald/10 hover:bg-brand-emerald/20 border border-brand-emerald/30 text-brand-emerald text-[9px] rounded shrink-0 font-bold cursor-pointer uppercase font-mono"
                                >
                                  Copy Flag
                                </button>
                              </div>
                            </div>
                          );
                        })()}

                        {/* TAB 3: THEORY */}
                        {companionTab === 'theory' && (
                          <div className="space-y-4">
                            {/* Explanation block */}
                            {currentLab.explanation && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                  <Code className="w-3.5 h-3.5 text-brand-emerald" /> Operational Context
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed bg-[#1b1f2b]/10 p-3 rounded-lg border border-slate-800/30">
                                  {currentLab.explanation}
                                </p>
                              </div>
                            )}

                            {/* Expandable Hints Bar */}
                            <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-[#111218]">
                              <button 
                                onClick={() => setShowCompanionHints(!showCompanionHints)}
                                className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:bg-slate-800/45 transition-colors cursor-pointer text-left uppercase tracking-wider"
                              >
                                <span>💡 Access Laboratory hints / debug keys</span>
                                <span className="text-slate-500 font-bold font-mono text-base">{showCompanionHints ? '−' : '+'}</span>
                              </button>
                              {showCompanionHints && (
                                <div className="px-4 py-3 bg-[#0d0f14] border-t border-slate-800 text-xs text-slate-400 leading-relaxed space-y-3">
                                  <p className="border-l-2 border-yellow-500 pl-2.5 text-yellow-500/90 font-medium font-sans">
                                    {currentLab.hints[0] || 'Observe terminal output details closely to locate credentials or directories.'}
                                  </p>
                                  <div className="p-2.5 bg-[#12141a] rounded text-[11px] font-mono space-y-1.5 border border-slate-800">
                                    <span className="text-slate-500 font-bold block uppercase text-[9px]">SOLVER FLAG ACCREDITATION:</span>
                                    <div className="flex justify-between items-center gap-2">
                                      <span className="text-brand-cyan select-all break-all font-semibold select-text">{currentLab.flag}</span>
                                      <button 
                                        onClick={() => copyToClipboard(currentLab.flag)}
                                        className="px-2 py-0.5 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 text-brand-cyan text-[9px] rounded shrink-0 font-bold cursor-pointer uppercase"
                                      >
                                        Copy
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Interactive local Flag Solver validator Form */}
                        <div className="glass-panel border border-[#1e293b]/55 rounded-xl p-4.5 space-y-3 bg-[#12141a] relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9fef00] to-transparent"></div>
                          
                          <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-[#9fef00]" /> Authenticate Lab Token
                            </h4>
                            <p className="text-[10px] text-slate-500">Submit decrypted flag parameter key here to sync credentials and awards</p>
                          </div>

                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={flagSubmittedInput}
                              onChange={(e) => setFlagSubmittedInput(e.target.value)}
                              placeholder="e.g. EV{TOKEN_STRING}"
                              disabled={isAlreadySolved}
                              className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs flex-1 text-white placeholder-slate-600 font-mono tracking-wide outline-none focus:border-[#9fef00] disabled:opacity-50"
                            />
                            <button 
                              onClick={() => {
                                if (!flagSubmittedInput.trim()) {
                                  alert("Empty Value! Please enter a non-empty flag key.");
                                  return;
                                }
                                if (flagSubmittedInput.trim() === currentLab.flag) {
                                  completeLabInOS(currentLab.id, currentLab.xpReward, currentLab.title);
                                  setFlagSubmittedInput('');
                                } else {
                                  alert(`❌ AUTHENTICATION ERROR:\n\nInvalid flag key. Verify spelling, correct uppercase or trailing brackets.`);
                                }
                              }}
                              disabled={isAlreadySolved}
                              className="px-4 py-2 bg-[#9fef00] hover:bg-[#8ed200] disabled:bg-[#9fef00]/10 text-black font-extrabold text-[11px] rounded tracking-wider uppercase shrink-0 transition-colors cursor-pointer disabled:text-slate-500 disabled:cursor-not-allowed"
                            >
                              SOLVE LAB
                            </button>
                          </div>
                          
                          {isAlreadySolved && (
                            <div className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/5 border border-brand-emerald/10 p-2 rounded-lg text-center font-mono">
                              ✓ LABORATORY COMPLETED SUCCESSFULLY! PROGRESS BACKED UP TO YOUR LIVE STUDENT FILE.
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })()}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
