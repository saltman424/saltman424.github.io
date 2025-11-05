import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { UiStore } from '../state';
import { Card } from './card';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [Card],
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
          <app-card
            (click)="uiStore.ui.set('gui')"
            icon="🖥️"
            title="Graphical"
            description="Modern visual interface"
          />

          <!-- Command-line Option -->
          <app-card
            (click)="uiStore.ui.set('cli')"
            icon="⌨️"
            title="Command-line"
            description="Terminal-based control"
          />
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
        flex-flow: row nowrap;
        justify-content: space-around;
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
