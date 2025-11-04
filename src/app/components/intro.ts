import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStore } from '../state';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="content-wrapper">
        <!-- Typed Text - Free Floating -->
        <div class="typed-text">
          <span class="prompt">$</span>
          <span class="text">
            {{ displayedText() }}
            <span class="cursor"></span>
          </span>
        </div>

        <!-- Options -->
        <div class="options-container" [class.show]="showOptions()">
          <!-- Graphical Option -->
          <button class="option-card" (click)="uiStore.ui.set('gui')">
            <div class="glow-effect"></div>
            <div class="option-content">
              <div class="icon">🖥️</div>
              <div class="option-title">Graphical</div>
              <div class="option-description">Modern visual interface</div>
            </div>
          </button>

          <!-- Command-line Option -->
          <button class="option-card" (click)="uiStore.ui.set('cli')">
            <div class="glow-effect"></div>
            <div class="option-content">
              <div class="icon">⌨️</div>
              <div class="option-title">Command-line</div>
              <div class="option-description">Terminal-based control</div>
            </div>
          </button>
        </div>

        <!-- Decorative Scan Line Effect -->
        @if (showOptions()) {
          <div class="scanline"></div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        padding: 1rem;
        box-sizing: border-box;
        background-color: #0a0a0a;
      }

      .content-wrapper {
        width: 100%;
        max-width: 48rem;
        height: 500px;
        margin-top: max(calc(50vh - 250px), 0px);
        position: relative;
      }

      .typed-text {
        font-size: 1.75rem;
        margin-bottom: 3rem;
        display: flex;
        align-items: flex-start;
        font-family: 'Courier New', monospace;
        white-space: pre-line;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }

      @media (min-width: 640px) {
        .typed-text {
          font-size: 2rem;
        }
      }

      .prompt {
        margin: 0.4rem 0.75rem 0 0;
        color: #00ffff;
        font-weight: bold;
        text-shadow:
          0 0 10px rgba(0, 255, 255, 0.8),
          0 0 20px rgba(0, 255, 255, 0.4);
      }

      .text {
        color: #e0e0e0;
        line-height: 1.5;
      }

      .cursor {
        display: inline-block;
        width: 0.5rem;
        height: 1.5rem;
        margin-left: 0.25rem;
        background-color: #00ffff;
        box-shadow:
          0 0 10px rgba(0, 255, 255, 0.8),
          0 0 20px rgba(0, 255, 255, 0.4);
        animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }

      .options-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        opacity: 0;
        transform: translateY(20px);
        cursor: none;
        pointer-events: none;
        transition: all 0.7s ease;
      }

      .options-container.show {
        opacity: 1;
        transform: translateY(0);
        cursor: pointer;
        pointer-events: auto;
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
        padding: 2rem;
        background: linear-gradient(
          135deg,
          rgba(0, 255, 255, 0.05) 0%,
          rgba(0, 255, 255, 0.02) 100%
        );
        border: 2px solid rgba(0, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .option-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
        transition: left 0.5s ease;
      }

      .option-card:hover::before {
        left: 100%;
      }

      .option-card:hover {
        background: linear-gradient(
          135deg,
          rgba(0, 255, 255, 0.1) 0%,
          rgba(0, 255, 255, 0.05) 100%
        );
        border-color: #00ffff;
        transform: translateY(-4px);
        box-shadow:
          0 10px 30px rgba(0, 255, 255, 0.2),
          0 0 20px rgba(0, 255, 255, 0.1);
      }

      .option-card:active {
        background: linear-gradient(
          135deg,
          rgba(0, 255, 255, 0.15) 0%,
          rgba(0, 255, 255, 0.08) 100%
        );
        border-color: #00ffff;
        transform: scale(1.05);
        box-shadow:
          0 10px 40px rgba(0, 255, 255, 0.3),
          0 0 30px rgba(0, 255, 255, 0.2);
      }

      .glow-effect {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(0, 255, 255, 0.15) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .option-card:hover .glow-effect {
        opacity: 1;
      }

      .option-content {
        position: relative;
        z-index: 1;
      }

      .icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.3));
      }

      .option-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #00ffff;
        margin-bottom: 0.5rem;
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }

      .option-description {
        font-size: 1rem;
        color: rgba(224, 224, 224, 0.7);
        font-family: 'Courier New', monospace;
      }

      .scanline {
        margin-top: 2rem;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00ffff, transparent);
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
        animation: scanline 3s ease-in-out infinite;
      }

      @keyframes scanline {
        0%,
        100% {
          opacity: 0;
          transform: scaleX(0.5);
        }
        50% {
          opacity: 1;
          transform: scaleX(1);
        }
      }
    `,
  ],
})
export class Intro implements OnInit, OnDestroy {
  public readonly uiStore = inject(UiStore);

  public readonly displayedText = computed((displayedTextLength = this.displayedTextLength()) =>
    this.fullText.slice(0, displayedTextLength),
  );
  public readonly showOptions = signal(false);
  public readonly selectedOption: string | null = null;

  private readonly fullText = 'Welcome!\nTo get started, which interface do you prefer?';
  private readonly displayedTextLength = signal(0);
  private typingInterval?: number;

  ngOnInit(): void {
    this.startTypingAnimation();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  private startTypingAnimation(): void {
    const typingSpeed = 80;

    this.typingInterval = setInterval(() => {
      this.displayedTextLength.update((length) => {
        const newLength = length + 1;
        if (newLength === this.fullText.length) {
          clearInterval(this.typingInterval);
          setTimeout(() => {
            this.showOptions.set(true);
          }, 500);
        }
        return newLength;
      });
    }, typingSpeed);
  }
}
