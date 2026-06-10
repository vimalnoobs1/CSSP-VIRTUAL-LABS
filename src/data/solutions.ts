export interface LabSolution {
  labId: number;
  steps: string[];
  commandSolution?: string;
  expectedFlag: string;
}

export const LAB_SOLUTIONS_MAP: Record<number, LabSolution> = {
  1: {
    labId: 1,
    steps: [
      "Type 'help' in the terminal command line to investigate the console adapter commands map.",
      "Execute 'whoami' inside the shell to authenticate user status (kali).",
      "Type 'ifconfig' to examine active interfaces and adapter settings.",
      "Run 'pwd' to confirm working directory (/home/kali).",
      "Type 'mkdir training' inside `/home/kali` to create the educational files category folder and generate the flag."
    ],
    commandSolution: "help && whoami && ifconfig && pwd && mkdir training",
    expectedFlag: "EV{TERMINAL_MASTER}"
  },
  2: {
    labId: 2,
    steps: [
      "Enter 'cd home' inside the terminal simulator to change working folder path downwards.",
      "Execute 'ls' to lists files. You will observe directory 'instructor'.",
      "Type 'cd instructor' to enter the nested academic administrator folder.",
      "Execute 'cat notes.txt' to extract and print the confidential dossier content holding the flag."
    ],
    commandSolution: "cd home && ls && cd instructor && ls && cat notes.txt",
    expectedFlag: "EV{LINUX_NAVIGATOR}"
  },
  3: {
    labId: 3,
    steps: [
      "Observe the Slider checkboxes representation on the permissions visual dashboard.",
      "Adjust the slider controls so Owner permissions are set to full checkmarks (Read, Write, Execute). Select nil for Group and Others permissions.",
      "This configuration maps to permission octal code 700 (symbolic: rwx------).",
      "Type 'chmod 700 run_backup.sh' in the terminal emulator, or press the 'chmod 700' button to apply variables.",
      "Execute the program by typing './run_backup.sh' or clicking 'Execute Script'."
    ],
    commandSolution: "chmod 700 run_backup.sh && ./run_backup.sh",
    expectedFlag: "EV{PERMISSION_MASTER}"
  },
  4: {
    labId: 4,
    steps: [
      "Study the interactive visual diagram tracing active client sockets and Google routing nodes.",
      "For Field #1 (Private LAN Client IP) ➔ select '192.168.1.45' representing the user PC node.",
      "For Field #2 (Default Router Gateway) ➔ select '192.168.1.1' acting as routing gateway endpoint.",
      "For Field #3 (Recursive Public DNS) ➔ select '8.8.8.8' representing the public resolver destination.",
      "Click 'Validate Network Config' to verify diagnostics alignment."
    ],
    expectedFlag: "EV{NETWORK_ANALYST}"
  },
  5: {
    labId: 5,
    steps: [
      "Open DNS lookup tool. Key in target domain: 'evcyberacademy.org'.",
      "Toggle the dropdown filter selector from 'A' record mapping status to 'TXT' records status.",
      "Click the 'Query DNS Server' trigger button.",
      "Review output lines list. Copy the SPF authentication verification token starting with EV{."
    ],
    expectedFlag: "EV{DNS_HUNTER}"
  },
  6: {
    labId: 6,
    steps: [
      "Open HTTP Packet routing flow mockup.",
      "Click the 'Resolve DNS' link to locate the destination IP for evcyberacademy.org database.",
      "Once DNS answers resolve mapped addresses (104.22.4.112), click 'Send HTTP Request'.",
      "Watch the packet transition through Client ➔ Router ➔ ISP ➔ DNS ➔ Server until '200 OK' is delivered."
    ],
    expectedFlag: "EV{PACKET_TRACER}"
  },
  7: {
    labId: 7,
    steps: [
      "Select 'Inspect Channel A' (HTTP Cleartext over Port 80) on the console layout.",
      "Scan headers list to detect explicit cleartext credentials leak: user password is sniffing-prone.",
      "Select 'Inspect Channel B' (HTTPS TLS Encryption over Port 443) and verify values are completely ciphered.",
      "Under Validation Quiz ➔ select 'HTTP' as vulnerable structure and press Authenticate."
    ],
    expectedFlag: "EV{WEB_FOUNDATION}"
  },
  8: {
    labId: 8,
    steps: [
      "Drag-drop or select corresponding socket entries for mapped ports:",
      "FTP ➔ Port 21 (File Transfer protocol registries)",
      "SSH ➔ Port 22 (Secure Shell administrators utility)",
      "DNS ➔ Port 53 (Name systems translations parameters)",
      "HTTP ➔ Port 80 (Plaintext web page systems)",
      "HTTPS ➔ Port 443 (Encrypted secure web transactions)",
      "Click 'Run Scan Mapping' to audit configuration bindings."
    ],
    expectedFlag: "EV{PORT_SCANNER}"
  },
  9: {
    labId: 9,
    steps: [
      "Boot up the F12 Developer Tools emulator.",
      "Toggle the browser secondary tab bar header to select 'Network' tab log scanner.",
      "On the mocked application page (left window), click 'Submit API Form'.",
      "Select the newly logged request row labeled 'config-fetch.json'.",
      "Verify the Response Headers box on the right pane to grab 'X-Academy-Authorization-Flag'."
    ],
    expectedFlag: "EV{DEVTOOLS_MASTER}"
  },
  10: {
    labId: 10,
    steps: [
      "Access simulator Cookie Viewer panel.",
      "Locate cookie records grid lines. Find record named: 'secret_academy_flag'.",
      "Verify and copy 'Value' field string contents starting with EV{."
    ],
    expectedFlag: "EV{COOKIE_ANALYST}"
  },
  11: {
    labId: 11,
    steps: [
      "Type a robust, high-entropy administrative passcode inside the text adapter field.",
      "Passcode must include: Uppercase, Lowercase, Numerical digits, and Special punctuation symbols.",
      "Ensure the length exceeds 14 characters to reach 100% entropy status (e.g. 'M@ster-Entr0py-Crypto-2026!').",
      "Once green verification badge outputs confirmation, capture the flag."
    ],
    expectedFlag: "EV{PASSWORD_GUARDIAN}"
  },
  12: {
    labId: 12,
    steps: [
      "Review the three academic user inbox items:",
      "Classify Mail 1 (urgent request from fake billing domain) ➔ mark 'Phishing'.",
      "Classify Mail 2 (generic corporate notification with zip executable) ➔ mark 'Phishing'.",
      "Classify Mail 3 (standard welcome registration linking to official portal) ➔ mark 'Legitimate'.",
      "Click 'Submit Classifications' to verify accuracy."
    ],
    expectedFlag: "EV{PHISHING_HUNTER}"
  },
  13: {
    labId: 13,
    steps: [
      "Launch decompiled packet emulator board.",
      "Select source inspector sub-tab: 'AndroidManifest.xml'.",
      "Review raw XML layout code carefully. Scroll down past application permissions.",
      "Locate XML documentation comments block `<!-- SECURITY RESEARCH NOTICE... -->` to capture flag."
    ],
    expectedFlag: "EV{APK_ANALYST}"
  },
  14: {
    labId: 14,
    steps: [
      "Enter target root scope domain: 'vulnerable-corp.com'.",
      "Click 'Step 1: Execute WHOIS Lookup' and review registrant organization tags.",
      "Click 'Step 2: Run Subdomain discovery' representing active port 3000 mapping scanner.",
      "Click 'Step 3: Technical Banner Fingerprint' to query header details and display the flag."
    ],
    expectedFlag: "EV{RECON_MASTER}"
  },
  15: {
    labId: 15,
    steps: [
      "For Target Bug rating Severity dropdown ➔ select critical rating: 'Critical (CVSS 9.0 - 10.0)' because database credentials are completely leaked front-end.",
      "For Description box, select choice/write guidelines on leaked javascript passwords.",
      "Select remediation strategy: migrate values to backend parameters (.env files).",
      "Click 'Submit Report to Security Auditor' to trigger verification."
    ],
    expectedFlag: "EV{REPORTING_PRO}"
  },
  16: {
    labId: 16,
    steps: [
      "Step 1: In the capstone shell console, type 'cat network_config.json' to read parameters. Retrieve gateway target address '192.168.99.1'.",
      "Step 2: Run router scanner: execute 'nmap -p 8080 192.168.99.1' on the client console shell.",
      "Step 3: Deploy web portal emulator on port 8080, open Cookie viewer, grab cookie value named 'admin_session' ➔ 'EV{CYBER_SECURITY_STARTER_2026}'.",
      "Step 4: Paste that cookie bypass key in academic verification input field and complete curriculum validation."
    ],
    expectedFlag: "EV{CYBER_SECURITY_STARTER_2026}"
  }
};
