import { Component, signal, effect, viewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandsStore } from '../../state';

const TITLE = 'INFO TERMINAL';

@Component({
  selector: 'app-cli',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="terminal-wrapper" animate.enter="terminal-enter" (click)="focusInput()">
      <!-- Terminal Header -->
      <div class="terminal-header">
        <div class="status-dots">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
        </div>
        <div class="terminal-title">
          {{ glitchText() }}
        </div>
        <div class="terminal-date">
          {{ currentDate }}
        </div>
      </div>

      <!-- Terminal Body -->
      <div #terminalBody class="terminal-body">
        <!-- Welcome Message -->
        <div class="welcome-message">
          <div class="welcome-line">╔═══════════════════════════════════╗</div>
          <!-- prettier-ignore -->
          <div class="welcome-line"
              ngPreserveWhitespaces>║   Sander Altman — Info Terminal   ║</div>
          <div class="welcome-line">╚═══════════════════════════════════╝</div>
          <div class="welcome-help">Type 'help' to see available commands</div>
        </div>

        <!-- Command History -->
        <div *ngFor="let entry of commandsStore.history()" class="history-entry">
          <div class="command-line">
            <span class="prompt">→</span>
            <span class="timestamp">[{{ entry.timestamp }}]</span>
            <span class="command-text">{{ entry.command }}</span>
          </div>
          <div class="output" [ngClass]="getTypeClass(entry.type)">
            <div
              *ngFor="let line of entry.output; let i = index"
              [ngClass]="{ 'animated-line': entry.animated }"
              [style.animation-delay]="entry.animated ? i * 0.1 + 's' : '0s'"
              [style.text-shadow]="entry.type === 'matrix' ? '0 0 10px currentColor' : 'none'"
            >
              {{ line }}
            </div>
          </div>
        </div>

        <!-- Input Line -->
        <div class="input-line">
          <span class="prompt-symbol">►</span>
          <span class="input-timestamp">[{{ currentTime() }}]</span>
          <input
            #terminalInput
            type="text"
            [(ngModel)]="commandsStore.input"
            (keydown)="handleKeyDown($event)"
            class="terminal-input"
            spellcheck="false"
            autocomplete="off"
          />
        </div>
      </div>

      <!-- Footer Status Bar -->
      <div class="status-bar">
        <div class="status-left">
          <span class="status-item">
            <span class="status-indicator"></span>
            ONLINE
          </span>
          <span class="status-item">CPU: {{ cpuUsage() }}%</span>
          <span class="status-item">MEM: {{ memUsage() }}%</span>
        </div>
        <div class="status-right">LATENCY: {{ latency() }}ms</div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        box-sizing: border-box;
        background-color: #0a0a0a;
      }

      .terminal-wrapper {
        z-index: 1;
        width: 100%;
        max-width: 64rem;
        overflow: hidden;
      }

      .terminal-enter {
        animation: 1s terminal-appear 0.4s ease-in-out backwards;
      }
      @keyframes terminal-appear {
        from {
          opacity: 0;
          max-width: 0;
          max-height: 0;
        }
        to {
          opacity: 1;
          max-width: 64rem;
          max-height: 100vh;
        }
      }

      .terminal-header {
        background: linear-gradient(to right, #1a1a1a, #262626, #1a1a1a);
        border: 2px solid #00ffff;
        border-radius: 0.5rem 0.5rem 0 0;
        padding: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 10px 15px -3px rgba(0, 255, 255, 0.2);
      }

      .status-dots {
        display: flex;
        gap: 0.5rem;
      }

      .dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .dot.red {
        background-color: #ef4444;
      }

      .dot.yellow {
        background-color: #eab308;
        animation-delay: 0.2s;
      }

      .dot.green {
        background-color: #22c55e;
        animation-delay: 0.4s;
      }

      .terminal-title {
        color: #00ffff;
        font-family: monospace;
        font-size: 0.875rem;
        letter-spacing: 0.1em;
        font-weight: bold;
      }

      .terminal-date {
        color: #00ffff;
        font-size: 0.75rem;
        font-family: monospace;
      }

      .terminal-body {
        background-color: #000000;
        border: 2px solid #00ffff;
        border-top: none;
        border-radius: 0 0 0.5rem 0.5rem;
        padding: 1.5rem;
        height: 24rem;
        overflow-y: auto;
        font-family: monospace;
        font-size: 0.875rem;
        background-image: repeating-linear-gradient(
          0deg,
          rgba(0, 255, 255, 0.03) 0px,
          rgba(0, 255, 255, 0.03) 1px,
          transparent 1px,
          transparent 2px
        );
        box-shadow:
          inset 0 0 100px rgba(0, 255, 255, 0.1),
          0 0 15px rgba(0, 255, 255, 0.3);
        cursor: text;
      }

      .terminal-body::-webkit-scrollbar {
        width: 8px;
      }

      .terminal-body::-webkit-scrollbar-track {
        background: #1a1a1a;
      }

      .terminal-body::-webkit-scrollbar-thumb {
        background: #00ffff;
        border-radius: 4px;
      }

      .welcome-message {
        margin-bottom: 1rem;
        color: #00ffff;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .welcome-line {
        font-size: 1.125rem;
        margin-bottom: 0.5rem;
        white-space: pre-wrap;
      }

      .welcome-help {
        font-size: 0.75rem;
        margin-top: 0.75rem;
        color: #67e8f9;
      }

      .history-entry {
        margin-bottom: 0.75rem;
      }

      .command-line {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
      }

      .prompt {
        color: #00ffff;
      }

      .timestamp {
        color: #9ca3af;
      }

      .command-text {
        color: #ffffff;
      }

      .output {
        margin-left: 1rem;
      }

      .output.success {
        color: #22d3ee;
      }

      .output.error {
        color: #f87171;
      }

      .output.warning {
        color: #fbbf24;
      }

      .output.info {
        color: #67e8f9;
      }

      .output.matrix {
        color: #4ade80;
      }

      .animated-line {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .input-line {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .prompt-symbol {
        color: #00ffff;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .input-timestamp {
        color: #9ca3af;
      }

      .terminal-input {
        flex: 1;
        background: transparent;
        color: #ffffff;
        border: none;
        outline: none;
        font-family: monospace;
        font-size: 0.875rem;
        caret-color: #00ffff;
      }

      .status-bar {
        margin-top: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        font-family: monospace;
        color: #00ffff;
        padding: 0 0.5rem;
      }

      .status-left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .status-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .status-indicator {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background-color: #4ade80;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `,
  ],
})
export class Cli {
  public readonly commandsStore = inject(CommandsStore);

  public readonly terminalInput = viewChild<ElementRef<HTMLInputElement>>('terminalInput');
  public readonly terminalBody = viewChild<ElementRef<HTMLDivElement>>('terminalBody');

  public readonly glitchText = signal(TITLE);
  public readonly currentDate = new Date().toLocaleDateString();
  public readonly currentTime = signal(new Date().toLocaleTimeString());
  public readonly cpuUsage = signal(Math.floor(Math.random() * 30 + 20));
  public readonly memUsage = signal(Math.floor(Math.random() * 40 + 40));
  public readonly latency = signal(Math.floor(Math.random() * 20 + 10));

  constructor() {
    // Glitch effect
    setInterval(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
      const glitch = TITLE.split('')
        .map((char) =>
          Math.random() > 0.9 ? chars[Math.floor(Math.random() * chars.length)] : char,
        )
        .join('');
      this.glitchText.set(glitch);
      setTimeout(() => this.glitchText.set(TITLE), 50);
    }, 3000);

    // Update time
    setInterval(() => {
      this.currentTime.set(new Date().toLocaleTimeString());
    }, 1000);

    // Update stats
    setInterval(() => {
      this.cpuUsage.set(Math.floor(Math.random() * 30 + 20));
      this.memUsage.set(Math.floor(Math.random() * 40 + 40));
      this.latency.set(Math.floor(Math.random() * 20 + 10));
    }, 2000);

    // Auto-scroll effect
    effect(() => {
      this.commandsStore.history();
      setTimeout(() => {
        const terminalBody = this.terminalBody()?.nativeElement;
        if (terminalBody) {
          terminalBody.scrollTop = terminalBody.scrollHeight;
        }
      }, 0);
    });
  }

  focusInput(): void {
    this.terminalInput()?.nativeElement.focus();
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        this.commandsStore.submitCommand();
        break;
      case 'ArrowUp':
        this.commandsStore.gotoPreviousCommand();
        break;
      case 'ArrowDown':
        this.commandsStore.gotoNextCommand();
        break;
      default:
        return; // Avoids preventing default
    }
    event.preventDefault();
  }

  getTypeClass(type: string): string {
    return type;
  }
}
