import { TaskItem } from '../types';

export const TASKS_DATA: TaskItem[] = [
  {
    id: "task_1",
    title: "Set Up Isolated Virtualized Linux VM",
    category: "Linux",
    xp: 60,
    description: "Install VirtualBox, VMware Player, or configure WSL2 to host an isolated Linux environment (such as Ubuntu or Kali Linux Server)."
  },
  {
    id: "task_2",
    title: "Enable Multi-Factor Authentication (MFA)",
    category: "Response",
    xp: 50,
    description: "Turn on dynamic Time-Based One-Time Password (TOTP) or security key authentication on your primary email, banking, and academic portals."
  },
  {
    id: "task_3",
    title: "Audit Home Wi-Fi Router Settings",
    category: "Networking",
    xp: 70,
    description: "Log into your home router's administrative gateway. Change default credentials, disable WPS, and audit active connected device lists."
  },
  {
    id: "task_4",
    title: "Determine Public & Gateway IPs",
    category: "Networking",
    xp: 40,
    description: "Use console utilities ('ipconfig' on Windows, 'ip a' or 'ifconfig' on Linux) and online lookups to document your gateway and external IPs."
  },
  {
    id: "task_5",
    title: "Analyze Let's Encrypt TLS Certificate",
    category: "Web Web Security",
    xp: 50,
    description: "Navigate to a HTTPS website in your browser, click the padlock, and inspect intermediate certificates, encryption algorithms, and validity dates."
  },
  {
    id: "task_6",
    title: "Audit Web Browser Manifest Permissions",
    category: "Web Web Security",
    xp: 50,
    description: "Analyze all installed browser extensions. Delete unneeded plugins and restrict file-system or host access permissions."
  },
  {
    id: "task_7",
    title: "Inspect Smartphone App Permissions",
    category: "Response",
    xp: 50,
    description: "Audit Android/iOS settings. Identify and revoke access for any apps requesting location, contacts, or notification fields unnecessarily."
  },
  {
    id: "task_8",
    title: "Generate Offline Keepass Database",
    category: "Linux",
    xp: 60,
    description: "Install a secure open-source password manager (such as KeePassXC or Bitwarden) and generate a high-entropy master key passphrase."
  },
  {
    id: "task_9",
    title: "Analyze Email Raw DKIM & SPF Headers",
    category: "Recon",
    xp: 60,
    description: "Examine the 'Show Original' headers in Gmail or Outlook to verify DKIM passes, SPF alignment, and DMARC enforcement on incoming newsletters."
  },
  {
    id: "task_10",
    title: "Study OWASP Top 10 Security Concepts",
    category: "Web Web Security",
    xp: 80,
    description: "Read the OWASP Top 15 Web Security Risks cheatsheets to synthesize theory regarding SQL injections, XSS, and broken access controls."
  }
];
