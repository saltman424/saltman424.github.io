import { inject, Injectable, signal } from '@angular/core';
import { UiStore } from './ui';

const MAX_COMMAND_LENGTH = 12;

interface HistoryEntry {
  command: string;
  timestamp: string;
  output: string[];
  type: 'default' | 'highlight' | 'success' | 'error' | 'warning';
  animated?: boolean;
}

interface Command {
  description: string;
  run: () => Omit<HistoryEntry, 'command' | 'timestamp'> | void;
}

@Injectable({ providedIn: 'root' })
export class CommandsStore {
  public input = '';

  public history = signal<HistoryEntry[]>([]);
  public commandHistory: string[] = [];
  public historyIndex = -1;

  private readonly uiStore = inject(UiStore);

  public commands: Record<string, Command> = {
    help: {
      description: 'Display this help message',
      run: () => ({
        output: [
          'Available commands:',
          ...Object.entries(this.commands).map(
            ([name, { description }]) =>
              `  ${name}${' '.repeat(MAX_COMMAND_LENGTH - name.length)}- ${description}`,
          ),
        ],
        type: 'default',
      }),
    },
    about: {
      description: 'Learn about Sander Altman',
      run: () => ({
        output: [
          '<h3>Sander Altman</h3>',
          '‣ Senior full-stack engineer with 8 years building enterprise software from 0→1, currently leading AI strategy and innovation initiatives.',
          '‣ Deep expertise in cloud-native architecture (AWS serverless), TypeScript/Node.js ecosystem, and LLM-powered solutions.',
          '‣ Transitioned team from feature-factory to outcome-driven product development while scaling from being a sole IC to managing 15+ developers and designers.',
        ],
        type: 'highlight',
      }),
    },
    skills: {
      description: 'List technical skills',
      run: () => ({
        output: [
          '→ <strong>Languages & Frameworks:</strong> TypeScript/JavaScript, Node.js, Angular, Python, GraphQL, SQL, Java, C/C++',
          '→ <strong>Cloud & Infrastructure:</strong> AWS serverless (Lambda, DynamoDB, RDS, AppSync, Cognito, S3, CloudFront), infrastructure-as-code (AWS CDK), CI/CD pipelines, multi-tenant SaaS architecture',
          '→ <strong>AI/ML:</strong> Amazon Bedrock, Microsoft 365 Agents SDK, LangGraph, RAG, MCP, context engineering',
        ],
        type: 'default',
      }),
    },
    links: {
      description: 'Find out where you can learn more',
      run: () => ({
        output: [
          ['LinkedIn', 'https://www.linkedin.com/in/sander-altman'],
          ['GitHub', 'https://github.com/saltman424'],
          ['Website', 'https://saltman424.github.io'],
        ].map(
          ([label, url]) =>
            `<strong>${label}:</strong> <a target="_blank" rel="noopener noreferrer" href="${url}">${url.replace(/^https?:\/\/(www.)?/, '')}</a>`,
        ),
        type: 'default',
      }),
    },
    luna: {
      description: 'See something magnificent',
      run: () => ({
        output: [
          `<img src="luna/${1 + Math.floor(Math.random() * 11)}.jpg" alt="Image of my dog, Luna"/>`,
        ],
        type: 'default',
      }),
    },
    // matrix: {
    //   description: 'Run matrix animation',
    //   run: () => ({
    //     output: [
    //       '0101010101010101010101010101',
    //       '1010101010101010101010101010',
    //       '0101010101010101010101010101',
    //       '1010101010101010101010101010',
    //       'MATRIX MODE ACTIVATED...',
    //     ],
    //     type: 'success',
    //   }),
    // },
    hack: {
      description: 'Initialize hacking sequence',
      run: () => ({
        output: [
          'INITIALIZING HACK SEQUENCE...',
          'Bypassing firewall... default',
          'Cracking encryption... default',
          'Accessing mainframe... default',
          '⚠ ACCESS GRANTED ⚠',
        ],
        type: 'warning',
        animated: true,
      }),
    },
    clear: {
      description: 'Clear the terminal',
      run: () => {
        this.history.set([]);
      },
    },
    quit: {
      description: 'Go back to the home screen',
      run: () => {
        this.uiStore.ui.set(undefined);
      },
    },
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
      timestamp: new Date().toLocaleTimeString(),
    };

    if (this.commands[cmd]) {
      const result = this.commands[cmd].run();
      if (result) {
        this.history.update((h) => [...h, { ...newEntry, ...result } as HistoryEntry]);
      }
    } else {
      this.history.update((h) => [
        ...h,
        {
          ...newEntry,
          output: [`Command not found: ${this.input}`, 'Type "help" for available commands'],
          type: 'error',
        } as HistoryEntry,
      ]);
    }

    this.input = '';
  }
}
