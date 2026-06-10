import { HackathonDay, LeaderboardUser } from '../types';

export const HACKATHON_DAYS: HackathonDay[] = [
  {
    day: 1,
    title: "Day 1: Footprint Dissemination",
    objective: "Identify the starting IP address of an unauthorized scanner and locate the target endpoint. ",
    scenario: "Apex Solutions web proxy logs are flooded with anomalous traffic. A rogue system is attempting to dictionary-attack our administrative interfaces. Scan the server access logs below to identify the offender's IP address and the exact directory resource they targeted.",
    steps: [
      "Scroll through the active Apache/Nginx web proxy logs.",
      "Identify the IP address generating hundreds of '401 Unauthorized' and '200 OK' administrative attempts.",
      "Type the client IP in the scanner tool to pull standard Whois properties.",
      "Input the flag revealed at the bottom of the registration records to complete Day 1."
    ],
    flag: "EV{HACK_DAY_1_RECON}",
    xpReward: 200,
    hint: "Look for IP addresses that are repeatedly hitting directories like '/admin' or '/config'. The IP of interest starts with 198.51.x.x!"
  },
  {
    day: 2,
    title: "Day 2: Intrusion Isolation & Port Hardening",
    objective: "Close unneeded public ports on the corporate perimeter firewall.",
    scenario: "The attacker gained administrative entry on a legacy service. Network mapping indicates that SQL Port 3306 and Redis Port 6379 are accidentally bound to the public '0.0.0.0' address instead of '127.0.0.1'. Adjust the simulated server's firewall rules to block internet-bound connections for internal databases.",
    steps: [
      "Select only security-safe profiles in the Network Config simulator.",
      "Move database bindings of port 3306 (MySQL) from WAN (Public) to LAN (Internal).",
      "Reject inbound web access to redis 6379 while keeping port 443 (HTTPS) open.",
      "Run the external compliance checker to generate the Day 2 patch token."
    ],
    flag: "EV{DAY_2_PORT_SHIELD}",
    xpReward: 250,
    hint: "Click on Port 3306 and Port 6379 under Public Interface. Change their rule status from 'Allow WAN' to 'Allow LAN Only' or 'Deny WAN', then tap 'Save & Verify'."
  },
  {
    day: 3,
    title: "Day 3: Powershell Cryptographic Audit",
    objective: "De-obfuscate a command payload to locate the server port and Command & Control IP.",
    scenario: "Our forensics team extracted a file 'payload.ps1' from the compromised staging container. It contains encoded PowerShell command lines. The malware connects outwards to a remote C2 controller. Inspect the script, execute the Base64 decoder tool to extract the remote payload, and read the connection parameters.",
    steps: [
      "Locate the cryptic obfuscated Base64 block in the PowerShell simulator.",
      "Copy and paste that Base64 string into our decryptor console.",
      "Read the decoded script variables containing the malicious server host IP.",
      "Input the server host IP and get your Day 3 shield flag."
    ],
    flag: "EV{DAY_3_MALWARE_BUSTED}",
    xpReward: 300,
    hint: "Identify the string following the '-EncodedData' block inside the PowerShell code, paste it into the provided Base64 decoder, and inspect the resulting IP target (e.g., 203.0.x.x)."
  },
  {
    day: 4,
    title: "Day 4: Incident Synthesis & Mitigation",
    objective: "Draft an incident report summary outlining root vectors, breach scope, and defensive remediation.",
    scenario: "The breach is contained, but compliance requires a formal Incident Post-Mortem. Integrate findings from previous days. Select proper metrics summarizing: entry point, vulnerability exploited, data lost, and future preventive safeguards (MFA & Least Privilege). Publish your diagnostic layout to receive your capstone challenge token.",
    steps: [
      "Select the right vector definitions in the reporting wizard.",
      "Specify root exploit: Weak Administrator Password.",
      "Highlight critical remediations: Enforce global MFA, relocate servers behind VPN bounds, and rotate system credentials.",
      "Submit report to and download the Day 4 digital badge."
    ],
    flag: "EV{DAY_4_SHIELD_COMPLETED}",
    xpReward: 350,
    hint: "Review your findings. Day 1: Brute Force login on Admin. Day 2: Public database ports. Day 3: Malware outbound C2. Combine these logically in the checklist details!"
  }
];

export const SIMULATED_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Aarav R", xp: 3520, avatar: "AR", status: 'online' },
  { rank: 2, name: "Priya Patel", xp: 3240, avatar: "PP", status: 'online' },
  { rank: 3, name: "Vikram Malhotra", xp: 2980, avatar: "VM", status: 'idle' },
  { rank: 4, name: "Ananya Iyer", xp: 2850, avatar: "AI", status: 'online' },
  { rank: 5, name: "Student (You)", xp: 0, avatar: "YU", isCurrentUser: true, status: 'online' }, // We will dynamically update user's XP here
  { rank: 6, name: "Devansh Mehta", xp: 2150, avatar: "DM", status: 'idle' },
  { rank: 7, name: "Neha Sen", xp: 1980, avatar: "NS", status: 'offline' },
  { rank: 8, name: "Kabir Joshi", xp: 1820, avatar: "KJ", status: 'offline' }
];
