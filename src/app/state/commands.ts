import { Injectable, signal } from '@angular/core';

interface HistoryEntry {
  command: string;
  timestamp: string;
  output: string[];
  type: 'success' | 'error' | 'warning' | 'info' | 'matrix';
  animated?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CommandsStore {
  public input = '';

  public history = signal<HistoryEntry[]>([]);
  public commandHistory: string[] = [];
  public historyIndex = -1;

  public commands: Record<string, () => Omit<HistoryEntry, 'command' | 'timestamp'> | null> = {
    help: () => ({
      output: [
        'Available commands:',
        '  help      - Display this help message',
        '  about     - Information about this terminal',
        '  skills    - Display technical skills',
        '  projects  - List recent projects',
        '  contact   - Show contact information',
        '  clear     - Clear the terminal',
        '  matrix    - Run matrix animation',
        '  scan      - Perform system scan',
        '  hack      - Initialize hacking sequence',
      ],
      type: 'success'
    }),
    about: () => ({
      output: [
        'CYBER TERMINAL v3.14',
        'A next-generation command interface',
        'Built with cutting-edge Angular technology',
        'Designed for the modern web',
      ],
      type: 'info'
    }),
    skills: () => ({
      output: [
        'TECHNICAL PROFICIENCIES:',
        '→ Frontend: Angular, React, Vue.js',
        '→ Backend: Node.js, Python, Go',
        '→ Database: PostgreSQL, MongoDB, Redis',
        '→ DevOps: Docker, Kubernetes, AWS',
        '→ Other: TypeScript, GraphQL, WebGL',
      ],
      type: 'success'
    }),
    projects: () => ({
      output: [
        'RECENT PROJECTS:',
        '[01] Neural Network Dashboard',
        '[02] Blockchain Explorer',
        '[03] Real-time Analytics Engine',
        '[04] Cybersecurity Monitor',
        '[05] AI Chat Interface',
      ],
      type: 'info'
    }),
    contact: () => ({
      output: [
        'CONTACT INFORMATION:',
        'Email: dev@cyberterm.io',
        'GitHub: github.com/cyberdev',
        'LinkedIn: linkedin.com/in/cyberdev',
        'Website: cyberterm.io',
      ],
      type: 'success'
    }),
    clear: () => {
      this.history.set([]);
      return null;
    },
    matrix: () => ({
      output: [
        '0101010101010101010101010101',
        '1010101010101010101010101010',
        '0101010101010101010101010101',
        '1010101010101010101010101010',
        'MATRIX MODE ACTIVATED...',
      ],
      type: 'matrix'
    }),
    scan: () => ({
      output: [
        'Initiating system scan...',
        'Scanning ports... [████████████] 100%',
        'Analyzing network traffic...',
        'Checking security protocols...',
        '✓ All systems operational',
      ],
      type: 'success',
      animated: true
    }),
    hack: () => ({
      output: [
        'INITIALIZING HACK SEQUENCE...',
        'Bypassing firewall... SUCCESS',
        'Cracking encryption... SUCCESS',
        'Accessing mainframe... SUCCESS',
        '⚠ ACCESS GRANTED ⚠',
      ],
      type: 'warning',
      animated: true
    }),
  };

  public gotoNextCommand(): void {
    if (this.historyIndex > 0) {
      const newIndex = this.historyIndex - 1;
      this.historyIndex = newIndex;
      this.input = this.commandHistory[this.commandHistory.length - 1 - newIndex];
    } else if (this.historyIndex === 0) {
      this.historyIndex = -1;
      this.input = '';
    }
  }

  public gotoPreviousCommand(): void {
    if (this.commandHistory.length > 0) {
      const newIndex = this.historyIndex + 1;
      if (newIndex < this.commandHistory.length) {
        this.historyIndex = newIndex;
        this.input = this.commandHistory[this.commandHistory.length - 1 - newIndex];
      }
    }
  }

  public submitCommand(): void {
    if (!this.input.trim()) return;

    const cmd = this.input.trim().toLowerCase();
    this.commandHistory.push(this.input);
    this.historyIndex = -1;

    const newEntry: Partial<HistoryEntry> = {
      command: this.input,
      timestamp: new Date().toLocaleTimeString()
    };

    if (this.commands[cmd]) {
      const result = this.commands[cmd]();
      if (result) {
        this.history.update(h => [...h, { ...newEntry, ...result } as HistoryEntry]);
      }
    } else {
      this.history.update(h => [...h, {
        ...newEntry,
        output: [`Command not found: ${this.input}`, 'Type "help" for available commands'],
        type: 'error'
      } as HistoryEntry]);
    }

    this.input = '';
  }
}