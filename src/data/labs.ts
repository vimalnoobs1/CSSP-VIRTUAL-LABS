import { Lab } from '../types';

export const LABS_DATA: Lab[] = [
  {
    id: 1,
    title: "Intro to Cyber Security & Termux Setup",
    difficulty: "Beginner",
    category: "Cyber Security Foundations",
    objective: "Initialize your academy virtual Termux shell, explore basics of ethical hacking, and verify user parameters.",
    instructions: [
      "Welcome to EV Cyber Academy! Let's initialize your terminal interface simulator.",
      "Type 'help' in the CLI terminal to review your starting core commands map.",
      "Check who iscurrently logged in inside this sandbox by typing 'whoami'.",
      "Notice your virtual hardware assigned adapter specs by running 'ifconfig'.",
      "Type 'pwd' to confirm that you are currently resting in your home folder (/home/kali).",
      "Create a new directory named 'training' using 'mkdir training' to complete terminal setup and uncover the starter flag."
    ],
    hints: [
      "Refer to Session 1 & 2 of the Foundations module.",
      "Your core command inputs are: 'help', then 'whoami', then 'ifconfig', then 'pwd'.",
      "Finally, type 'mkdir training' inside `/home/kali` to activate the automatic flag."
    ],
    explanation: "Welcome to the starter program! This lab establishes Termux/Kali Linux shell basics. Command lines are the cornerstone of automation and remote security. Knowing how to run basic system parameters helps you audit remote systems.",
    xpReward: 100,
    flag: "EV{TERMINAL_MASTER}"
  },
  {
    id: 2,
    title: "Linux Directory Navigation Practice",
    difficulty: "Beginner",
    category: "Linux Essentials",
    objective: "Master file system paths (pwd, ls, cd) and navigate through the nested folders to find secure academy files.",
    instructions: [
      "In this lab, we will traverse directories to simulate searching systems for hidden documents.",
      "Verify your present working directory using 'pwd'.",
      "List catalog items present in the directory using 'ls'. You will find 'home', 'etc', and 'var'.",
      "Navigate inside the home directory using 'cd home', then list its contents with 'ls'.",
      "Enter the 'instructor' folder with 'cd instructor', then look inside for private records.",
      "Print the contents of the secret notes file using 'cat notes.txt' to retrieve the flag."
    ],
    hints: [
      "Use 'cd ..' if you ever need to go back up a directory level.",
      "The fast route is: 'cd home', then 'ls', then 'cd instructor', then 'ls', then 'cat notes.txt'.",
      "Case sensitivity matters. Ensure all names match the directory listings exactly."
    ],
    explanation: "Module 2: Linux Essentials teaches you to explore the absolute and relative hierarchy. Security personnel navigate directory scopes to investigate indicators of compromise (IOCs), pull firewall logs, or locate system configuration backups during forensic audits.",
    xpReward: 120,
    flag: "EV{LINUX_NAVIGATOR}"
  },
  {
    id: 3,
    title: "Linux File Permissions & chmod",
    difficulty: "Intermediate",
    category: "Linux Essentials",
    objective: "Learn the Linux permissions model (symbolic & octal strings) and alter credentials to run an authorized script.",
    instructions: [
      "Examine the interactive Permissions Slider panel.",
      "We need to execute the administrative tool 'run_backup.sh', but it currently lacks run permissions.",
      "Using the symbolic mapping, we want rwx------ which translates to 700 in octal format (Owner has Read, Write, and Execute; Group and Others have nil).",
      "Configure the slides on the permissions panel, or execute 'chmod 700 run_backup.sh' directly in the terminal control bar.",
      "Execute the program by typing './run_backup.sh' or click 'Execute Script' to verify access and pull the flag."
    ],
    hints: [
      "Read is 4, Write is 2, Execute is 1. Thus 4+2+1 = 7 (Owner). Group (0) and Others (0) gives 700.",
      "Adjust the sliders so that only the Owner checked boxes are active, and no other boxes are selected.",
      "Once permissions display as rwx------, type './run_backup.sh' or run the script on the console."
    ],
    explanation: "Under Linux, everything is a file, restricted by a 3-tier user context: Owner, Group, and Others. Restricting critical tools to authorized users using chmod prevents unauthorized local privilege escalation (LPE).",
    xpReward: 150,
    flag: "EV{PERMISSION_MASTER}"
  },
  {
    id: 4,
    title: "Networking 101: IP Addressing",
    difficulty: "Beginner",
    category: "Networking Fundamentals",
    objective: "Analyze a simulated local area network (LAN) topology to map client subnets, router gateways, and public DNS servers.",
    instructions: [
      "Review the interactive Network Topology diagram in the simulator box showing connected clients and DNS routes.",
      "Examine the network scopes: A Client PC (192.168.1.45), Gateway Router (192.168.1.1), Public DNS Resolver (8.8.8.8), and Local Server (10.0.0.1).",
      "Answer the network validation questions by identifying which IP belongs to the private Client LAN space.",
      "Identify the IP address corresponding to the Default Gateway Router routing internal packets to the internet.",
      "Identify the public IP of the Google DNS recursive resolver, then submit diagnostics to claim your flag."
    ],
    hints: [
      "Client private devices rest on the local subnet 192.168.1.0/24. Find the IP ending in .45.",
      "The Gateway Router acts as the door outwards and usually ends in .1 (e.g. 192.168.1.1).",
      "The public DNS lookup router for Google is famous: 8.8.8.8."
    ],
    explanation: "Module 3: Networking Fundamentals covers IP Addressing. RFC 1918 defines private addresses (192.168.x.x, 10.x.x.x, 172.16.x.x) which aren't routable on the open web, needing Network Address Translation (NAT) via default gateway routers.",
    xpReward: 100,
    flag: "EV{NETWORK_ANALYST}"
  },
  {
    id: 5,
    title: "DNS Scout: nslookup & dig txt",
    difficulty: "Beginner",
    category: "Networking Fundamentals",
    objective: "Execute DNS record lookups to discover domain parameters and parse verification codes hidden in TXT records.",
    instructions: [
      "In this lab, we will use DNS lookup engines to footprint evcyberacademy.org.",
      "Within the interactive DNS lookup box, enter 'evcyberacademy.org'.",
      "Query normal IP address mappings by selecting 'A' record mapping to locate the host IP address.",
      "Select 'TXT' query type to fetch the SPF (Sender Policy Framework) and registration text parameters.",
      "Analyze the TXT output records list carefully to find the hidden credential key beginning with the EV format."
    ],
    hints: [
      "Select the 'TXT' option from the dropdown indicator.",
      "Enter the domain 'evcyberacademy.org' in the target textbox and click query.",
      "The returned string list holds an SPF configuration with an 'authentication_token=EV{...}' parameter."
    ],
    explanation: "The Domain Name System (DNS) translates user domain names to IP addresses. TXT records are used for domain registration verification, email security authentication mechanisms (SPF, DKIM, DMARC), and sometimes hold vulnerable metadata leaked by administrators.",
    xpReward: 130,
    flag: "EV{DNS_HUNTER}"
  },
  {
    id: 6,
    title: "Internet Journey: HTTP Packet Path",
    difficulty: "Intermediate",
    category: "Networking Fundamentals",
    objective: "Simulate a live web request packet to observe how data hops through clients, routers, ISPs, DNS, and servers.",
    instructions: [
      "Launch the Web Packet simulator to trace a client-side requests process.",
      "Observe the initial state of the browser. The packet cannot travel until the host's domain is converted to an IP.",
      "Click the 'Resolve DNS' button to fetch the server IP (104.22.4.112) for evcyberacademy.org.",
      "With the Destination IP pinned on the header, click 'Send HTTP Request' to initialize transport.",
      "Observe the animated packet traverse the steps: Client PC -> Local Router -> ISP Gateway -> DNS -> web target.",
      "Wait for the server to reply back with standard HTTP status code '200 OK' and capture the unlocked flag."
    ],
    hints: [
      "You must always click DNS Resolve first to give the packet its destination IP headers.",
      "Click 'Send HTTP Request' right after DNS returns coordinates.",
      "Watch the animation cycle through until the web request safely concludes with a successful payload delivery."
    ],
    explanation: "Web request flows move through the physical, data link, network, transport, and application layers. At each step, routers read headers to deliver packets cleanly. Tracing this path helps you understand defense choke points.",
    xpReward: 150,
    flag: "EV{PACKET_TRACER}"
  },
  {
    id: 7,
    title: "HTTP Plaintext vs HTTPS Encryption",
    difficulty: "Beginner",
    category: "Web Security Basics",
    objective: "Contrast unencrypted HTTP (Port 80) against encrypted HTTPS (Port 443) and analyze cleartext credential sniffing risks.",
    instructions: [
      "Open the Packet Sniffing comparison portal.",
      "Select 'Inspect Channel A' representing unencrypted HTTP traffic. Look at the login credential request details.",
      "Notice how the user's password parameter ('EV_Secure_2026') is completely visible in plain text.",
      "Select 'Inspect Channel B' representing secure HTTPS traffic over port 443.",
      "Observe that the HTTPS body payload is completely garbled ciphertext under modern AES-GCM encryption.",
      "Answer the validation questionnaire to classify which standard protocol is prone to network eavesdropping."
    ],
    hints: [
      "Unencrypted HTTP transmits values over clear text streams, allowing sniffers to extract authorization headers.",
      "HTTPS encapsulates data inside TLS/SSL packages.",
      "Select 'HTTP' as the unencrypted, vulnerable communication channel to secure the challenge flag."
    ],
    explanation: "Module 3 & 5 comparison. Transmitting sensitive credentials over HTTP (port 80) exposes organizations to Man-In-The-Middle (MITM) sniffing. HTTPS (port 443) uses TLS certificates to encrypt traffic, guaranteeing authenticity and confidentiality.",
    xpReward: 110,
    flag: "EV{WEB_FOUNDATION}"
  },
  {
    id: 8,
    title: "Network Sockets: Ports and Services",
    difficulty: "Beginner",
    category: "Networking Fundamentals",
    objective: "Identify standard network sockets and map standard services (FTP, SSH, DNS, HTTP, HTTPS) to their registered ports.",
    instructions: [
      "Open the Ports and Services correlation console.",
      "A scanned server directory exhibits several active sockets awaiting configuration mapping.",
      "Link each of the 5 key services to its reserved port allocation: 21, 22, 53, 80, 443.",
      "Drag or toggle FTP to 21, SSH to 22, DNS to 53, HTTP to 80, and HTTPS to 443.",
      "Click 'Run Scan Mapping' to audit the connections. If all ports match perfectly, the verification token is unlatched."
    ],
    hints: [
      "Port 22 is reserved for Secure Shell (SSH) diagnostics.",
      "Port 53 handles DNS translations, while 21 hosts File Transfer Protocol (FTP) directories.",
      "Port 80 serves basic HTTP webpages, whereas Port 443 hosts encrypted HTTPS."
    ],
    explanation: "Every internet utility binds to a numeric port (0-65535). Sockets 0-1023 are standard default channels. Scanning devices to inventory exposed entry points is the first step when implementing secure firewalls.",
    xpReward: 100,
    flag: "EV{PORT_SCANNER}"
  },
  {
    id: 9,
    title: "Web Recon: Browser Developer Tools",
    difficulty: "Intermediate",
    category: "Web Security Basics",
    objective: "Leverage standard Browser Developer Tools (F12) to trace network requests and uncover administrative header parameters.",
    instructions: [
      "Open the F12 Developer Tools Emulator simulator.",
      "Click the 'Network Tab' mock board representing local network request monitors.",
      "Click the button labeled 'Submit API Form' on the webpage panel to trigger an API web call.",
      "Observe the new network request 'config-fetch.json' pop up inside the transaction logging table.",
      "Click on that request and inspect the custom Response Headers section on the right side.",
      "Locate the custom credential parameter named 'X-Academy-Authorization-Flag' to pull the flag value."
    ],
    hints: [
      "You must inspect the 'Headers' tab of the requested 'config-fetch.json' packet.",
      "Look in the Response Headers list for a line starting with 'X-Academy-...'.",
      "Copy that flag value exactly (including the EV prefix)."
    ],
    explanation: "Module 5 teaches how to audit websites. F12 Browser Developer Tools allow engineers to inspect the DOM, read console scripts, study cookielists, and trace network transactions to catch leaked development parameters.",
    xpReward: 140,
    flag: "EV{DEVTOOLS_MASTER}"
  },
  {
    id: 10,
    title: "Cookie Audit: Attributes & Sessions",
    difficulty: "Intermediate",
    category: "Web Security Basics",
    objective: "Analyze security attributes (Secure, HttpOnly, SameSite) and investigate active session parameters.",
    instructions: [
      "Access the Cookie Inspection console of the browser simulator.",
      "A table displays active browser cookies: 'session_token', 'user_role', 'preferences', and 'secret_academy_flag'.",
      "Inspect the attributes for the vital authentication entry 'session_token'. Check if 'HttpOnly' and 'Secure' options are flagged.",
      "Examine the values stored in the cookies.",
      "Locate the value field containing the key named 'secret_academy_flag' to extract your security token."
    ],
    hints: [
      "Look at the row with the cookie key name 'secret_academy_flag'.",
      "Check the 'Value' column to locate the token directly.",
      "Observe why 'HttpOnly' is important: it locks out client-side javascript scripts from hijacking session flags."
    ],
    explanation: "Cookies preserve stateless HTTP authentication across logins. Unsecured session cookies lacking 'HttpOnly' or 'Secure' attributes allow attackers to steal identities through Cross-Site Scripting (XSS) or Man-In-The-Middle exploits.",
    xpReward: 140,
    flag: "EV{COOKIE_ANALYST}"
  },
  {
    id: 11,
    title: "Defense Metrics: Password Entropy",
    difficulty: "Beginner",
    category: "Social Engineering Awareness",
    objective: "Evaluate password characteristics to measure entropy, dictionary attack risks, and estimate brute force difficulty.",
    instructions: [
      "Access the interactive Passcode Analyzer playground.",
      "Test different password combinations in the input box to observe the strength indicators.",
      "Calculate entropy growth: short passwords and simple words (like 'admin123') trigger high dictionary risks.",
      "To pass this lab, you must construct a password that scores above 95/100 on the strength meter.",
      "Mix uppercase, lowercase letters, special symbols, digits, and exceed 14 characters to reveal the flag."
    ],
    hints: [
      "Use complex structures. Example password format: 'P@$$w0rd_Str0ng_3ntr0py_2026!'.",
      "Make sure to include numbers, uppercase letters, lowercase letters, and punctuation symbols.",
      "Once the rating goes green and reads 100%, the challenge flag will output."
    ],
    explanation: "Module 6: Security Awareness. Password security relies on alphabet space size and overall character count, which increases entropy bits exponentially. Using custom phrases shields databases against brute force dictionary lists.",
    xpReward: 100,
    flag: "EV{PASSWORD_GUARDIAN}"
  },
  {
    id: 12,
    title: "Social Engineering: Phishing Detector",
    difficulty: "Intermediate",
    category: "Social Engineering Awareness",
    objective: "Audit incoming mailbox notifications to identify spoofed domains, phishing templates, and malicious scripts.",
    instructions: [
      "Enter the email triage inbox sandbox viewer.",
      "Three suspicious new emails are listed awaiting review from the cybersecurity group admin.",
      "Email 1: Urgent support request from '@secure-pay-authentication-portal-update.com' demanding immediate action.",
      "Email 2: Internal HR document containing generic headers and an untrusted ZIP file attachment.",
      "Email 3: Standard academy enrollment welcome containing registered links to evcyberacademy.org.",
      "Classify each email status as either 'Phishing' or 'Legitimate' and submit your analysis."
    ],
    hints: [
      "Look for mismatching sender domain name layouts, emotional rush urgency, and untrusted file links.",
      "The lookalike billing update domain is a classic phishing proxy, as is the generic HR zip. The academy registration welcome is legitimate.",
      "Categorize: Email 1: Phishing, Email 2: Phishing, Email 3: Legitimate."
    ],
    explanation: "Phishing is the single leading vector for modern corporate entry. Attackers leverage psychological hooks, lookalike domain typos, and macro-enabled links to bypass defenses. Awareness training is key to first-line network defense.",
    xpReward: 150,
    flag: "EV{PHISHING_HUNTER}"
  },
  {
    id: 13,
    title: "Mobile Security: Android APK Manifest",
    difficulty: "Intermediate",
    category: "Mobile Security",
    objective: "Decompile an Android package file structure and analyze system manifest request parameters for security flaws.",
    instructions: [
      "Access the decompiled APK manifest viewer representing SecureMobiWallet.apk.",
      "Open the 'AndroidManifest.xml' file sheet.",
      "Scan the manifest node parameters for requested Android System permissions.",
      "Locate the security research comments section (`<!-- ... -->`) placed inside the XML markup code.",
      "Verify the custom hardcoded debug indicator flag placed there by the mobile development team."
    ],
    hints: [
      "Select the XML Manifest tab panel inside the APK emulator.",
      "Scroll down to find comments that start with `<!-- SECURITY RESEARCH NOTICE... `.",
      "You will find your flag stored as a decompilation research note."
    ],
    explanation: "Module 7: Mobile Security. Android applications declare permissions in AndroidManifest.xml. Attackers bundle tracking packages asking for dangerous permissions (SEND_SMS, READ_CONTACTS, etc.) to hijack device functions.",
    xpReward: 150,
    flag: "EV{APK_ANALYST}"
  },
  {
    id: 14,
    title: "Reconnaissance: Whois & Subdomain scanning",
    difficulty: "Intermediate",
    category: "Security Tools & Reconnaissance",
    objective: "Implement a step-by-step reconnaissance pipeline: look up domain holdings, discover hidden subdomains, and fingerprint server gateways.",
    instructions: [
      "Boot up the informational reconnaissance workflow dashboard.",
      "Select your target scope: 'vulnerable-corp.com'.",
      "Run Stage 1: Whois Scan to pull DNS registrants, admin emails, and registrant organizations.",
      "Run Stage 2: Subdomain Discovery to run scans mapping aliases. Identify a hidden staging portal on port 3000.",
      "Run Stage 3: Fingerprinting on that newly discovered portal to inspect the admin header banner and extract the flag."
    ],
    hints: [
      "Proceed through the 3 diagnostic buttons in order: Whois Lookup, Subdomain Enum, and Technical Fingerprint.",
      "Inspect the generated terminal outputs at each stage to trace clues.",
      "The fingerprinted port 3000 administrator header reveals the flag directly."
    ],
    explanation: "Module 4: Security Tools & Recon. Passive reconnaissance lets you gather intelligence without alerting targets. Subdomain enumeration exposes staging, testing, or backup assets that are often poorly guarded.",
    xpReward: 160,
    flag: "EV{RECON_MASTER}"
  },
  {
    id: 15,
    title: "Vulnerability Disclosure Reporting",
    difficulty: "Intermediate",
    category: "Professional Reporting",
    objective: "Document and draft an executive vulnerability disclosure report specifying severity scales, impacts, and fix plans.",
    instructions: [
      "Access the cybersecurity bug reporting template workspace.",
      "We are documenting a critical vulnerability: 'Unencrypted Database Root Credentials Exposed in Client-Side JavaScript'.",
      "Set the CVSS Severity grading level appropriately for an exposed credential error.",
      "Fill out the disclosure fields: clear Description, business Impact, and Remediation action plans.",
      "Submit your professional report to the review board to secure a grade above 90% and unlock the flag."
    ],
    hints: [
      "Exposed root passwords grant total bypass, making this a 'Critical' classification.",
      "Remediation: Recommend storing secrets in server-side environment files (.env) rather than front-end scripting.",
      "Select Critical severity and assign correct fix descriptions to pass."
    ],
    explanation: "Module 9: Reporting. Clear report templates ensure business leaders understand high-level risk metrics. Security professionals must translate technical flaws into business impacts and actionable developer fixes.",
    xpReward: 160,
    flag: "EV{REPORTING_PRO}"
  },
  {
    id: 16,
    title: "Course Capstone & GitHub Setup Overview",
    difficulty: "Advanced",
    category: "Final Practical Lab",
    objective: "Synthesize file navigation, DNS records, browser analytics, and credentials lookup in a comprehensive final review.",
    instructions: [
      "Launch the EV Cyber Academy Consolidated Capstone console interface.",
      "Stage 1: Check your local file holdings by printing 'cat network_config.json' inside the CLI.",
      "Stage 2: Run a port scan query on the gateway target IP discovered in your config sheet (e.g. 192.168.99.1).",
      "Stage 3: Load the admin gateway webpage mock, and inspect cookie parameters on the emulator browser.",
      "Stage 4: Key in the retrieved admin bypass token and answer the security review quiz to unlock your graduation flag!"
    ],
    hints: [
      "Read 'network_config.json' with terminal 'cat' to locate the router IP (192.168.99.1).",
      "Scan that router IP. Access port 8080 and pull the cookie parameter 'admin_session'.",
      "Input the cookie string 'EV{CYBER_SECURITY_STARTER_2026}' to satisfy the final assessment validator."
    ],
    explanation: "Congratulations! This Capstone represents the final live review session of your EV Cyber Academy course, combining Terminal shell commands, DNS record lookups, Web inspection, and reporting models to prepare you for modern cybersecurity careers.",
    xpReward: 300,
    flag: "EV{CYBER_SECURITY_STARTER_2026}"
  }
];
