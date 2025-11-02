import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// TODO: incorporate this into main cli

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="terminal-wrapper">
        <!-- Terminal Window -->
        <div class="terminal-window">
          <!-- Terminal Header -->
          <div class="terminal-header">
            <div class="header-buttons">
              <div class="button red"></div>
              <div class="button yellow"></div>
              <div class="button green"></div>
            </div>
            <div class="terminal-title">system.terminal</div>
          </div>
          
          <!-- Terminal Content -->
          <div class="terminal-content">
            <!-- Typed Text -->
            <div class="typed-text">
              <span class="prompt">$</span>
              <span class="text">
                {{ displayedText }}
                <span class="cursor"></span>
              </span>
            </div>
            
            <!-- Options -->
            <div class="options-container" [class.show]="showOptions">
              <!-- Graphical Option -->
              <button
                class="option-card"
                [class.selected]="selectedOption === 'graphical'"
                (click)="handleOptionClick('graphical')"
                (mouseenter)="hoveredOption = 'graphical'"
                (mouseleave)="hoveredOption = null"
                [class.hovered]="hoveredOption === 'graphical' && !selectedOption">
                <div class="glow-effect"></div>
                <div class="option-content">
                  <div class="icon">🖥️</div>
                  <div class="option-title">Graphical</div>
                  <div class="option-description">Modern visual interface</div>
                </div>
              </button>
              
              <!-- Command-line Option -->
              <button
                class="option-card"
                [class.selected]="selectedOption === 'command-line'"
                (click)="handleOptionClick('command-line')"
                (mouseenter)="hoveredOption = 'command-line'"
                (mouseleave)="hoveredOption = null"
                [class.hovered]="hoveredOption === 'command-line' && !selectedOption">
                <div class="glow-effect"></div>
                <div class="option-content">
                  <div class="icon">⌨️</div>
                  <div class="option-title">Command-line</div>
                  <div class="option-description">Terminal-based control</div>
                </div>
              </button>
            </div>
            
            <!-- Decorative Scan Line Effect -->
            <div class="scanline" *ngIf="showOptions"></div>
          </div>
        </div>
        
        <!-- Additional Glow -->
        <div class="background-glow"></div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background-color: #0a0a0a;
    }

    .terminal-wrapper {
      width: 100%;
      max-width: 48rem;
      position: relative;
    }

    .terminal-window {
      border-radius: 0.5rem;
      overflow: hidden;
      background-color: #0f0f0f;
      box-shadow: 
        0 0 60px rgba(0, 255, 255, 0.15),
        0 0 100px rgba(0, 255, 255, 0.05);
    }

    .terminal-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background-color: #1a1a1a;
      border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    }

    .header-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .button {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
    }

    .button.red { background-color: #ff5f56; }
    .button.yellow { background-color: #ffbd2e; }
    .button.green { background-color: #27c93f; }

    .terminal-title {
      flex: 1;
      text-align: center;
      font-size: 0.875rem;
      font-family: 'Courier New', monospace;
      color: #00ffff;
      opacity: 0.7;
    }

    .terminal-content {
      padding: 2rem;
      font-family: 'Courier New', monospace;
    }

    .typed-text {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
    }

    .prompt {
      margin-right: 0.5rem;
      color: #00ffff;
    }

    .text {
      color: #e0e0e0;
    }

    .cursor {
      display: inline-block;
      width: 0.5rem;
      height: 1.25rem;
      margin-left: 0.25rem;
      background-color: #00ffff;
      animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.7s ease;
    }

    .options-container.show {
      opacity: 1;
      transform: translateY(0);
    }

    @media (min-width: 640px) {
      .options-container {
        flex-direction: row;
      }
    }

    .option-card {
      flex: 1;
      position: relative;
      overflow: hidden;
      border-radius: 0.5rem;
      padding: 1.5rem;
      background-color: rgba(0, 255, 255, 0.05);
      border: 2px solid rgba(0, 255, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .option-card.hovered {
      background-color: rgba(0, 255, 255, 0.1);
      border-color: #00ffff;
      transform: translateY(-4px);
    }

    .option-card.selected {
      background-color: rgba(0, 255, 255, 0.15);
      border-color: #00ffff;
      transform: scale(1.05);
    }

    .glow-effect {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .option-card.hovered .glow-effect {
      opacity: 1;
    }

    .option-content {
      position: relative;
      z-index: 1;
    }

    .icon {
      font-size: 2.25rem;
      margin-bottom: 0.75rem;
    }

    .option-title {
      font-size: 1.125rem;
      font-weight: bold;
      color: #00ffff;
      margin-bottom: 0.5rem;
    }

    .option-description {
      font-size: 0.875rem;
      color: rgba(224, 224, 224, 0.7);
    }

    .scanline {
      margin-top: 1.5rem;
      height: 1px;
      background: linear-gradient(90deg, transparent, #00ffff, transparent);
      animation: scanline 3s ease-in-out infinite;
    }

    @keyframes scanline {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }

    .background-glow {
      position: absolute;
      inset: 0;
      z-index: -1;
      filter: blur(3rem);
      opacity: 0.2;
      background: radial-gradient(circle at center, #00ffff 0%, transparent 70%);
    }
  `]
})
export class Intro implements OnInit, OnDestroy {
  displayedText = '';
  showOptions = false;
  selectedOption: string | null = null;
  hoveredOption: string | null = null;
  
  private fullText = 'Welcome! To get started, which interface do you prefer?';
  private typingInterval: any;

  ngOnInit(): void {
    this.startTypingAnimation();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  private startTypingAnimation(): void {
    let currentIndex = 0;
    const typingSpeed = 50;

    this.typingInterval = setInterval(() => {
      if (currentIndex < this.fullText.length) {
        this.displayedText = this.fullText.slice(0, currentIndex + 1);
        currentIndex++;
      } else {
        clearInterval(this.typingInterval);
        setTimeout(() => {
          this.showOptions = true;
        }, 500);
      }
    }, typingSpeed);
  }

  handleOptionClick(option: string): void {
    this.selectedOption = option;
    setTimeout(() => {
      alert(`You selected: ${option}`);
      // In a real app, you would navigate or emit an event here
    }, 300);
  }
}