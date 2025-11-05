import { Component, OnInit, signal } from '@angular/core';

const ANIMATION_TIMINGS = [
  0, // Start
  1000, // First epithet
  1700, // Second epithet
  2400, // Third epithet
  3100, // Shrink
  4100, // Done
];

@Component({
  selector: 'app-gui-header',
  standalone: true,
  template: `
    <div
      class="content"
      [class.move-top]="animationStage() >= 4"
      [class.done]="animationStage() >= 5"
    >
      @if (animationStage() >= 0) {
        <h1 animate.enter="name-enter" [class.shrink]="animationStage() >= 4">Sander Altman</h1>
      }

      <div class="epithets-container" [class.shrink]="animationStage() >= 4">
        <div class="epithet-wrapper left">
          @if (animationStage() >= 1) {
            <div
              class="epithet"
              animate.enter="epithet-enter"
              [class.shrink]="animationStage() >= 4"
            >
              Senior Full-Stack Engineer
            </div>
          }
        </div>

        <div class="epithet-wrapper">
          @if (animationStage() >= 2) {
            <div
              class="epithet"
              animate.enter="epithet-enter"
              [class.shrink]="animationStage() >= 4"
            >
              AI Strategy Lead
            </div>
          }
        </div>

        <div class="epithet-wrapper right">
          @if (animationStage() >= 3) {
            <div
              class="epithet"
              animate.enter="epithet-enter"
              [class.shrink]="animationStage() >= 4"
            >
              Product-Minded Builder
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        pointer-events: none;
      }

      .content {
        text-align: center;
        transition: all 1s ease-out;

        &.move-top {
          transform: translateY(calc(-50vh + 4rem));
        }
        &.done {
          transition: none;
        }
      }

      h1 {
        font-size: 4.5rem;
        font-weight: bold;
        color: white;
        margin: 0;
        font-family:
          system-ui,
          -apple-system,
          sans-serif;
        letter-spacing: 0.02em;
        transition: font-size 1s ease-out;

        &.shrink {
          font-size: 3rem;
        }
      }

      .name-enter {
        animation: name-appear 1s ease-out;
      }

      @keyframes name-appear {
        from {
          opacity: 0;
          transform: scale(0.5);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .epithets-container {
        width: 100vw;
        max-width: 100vw;
        display: flex;
        gap: 10px;
        justify-content: center;
        height: 30px;
        transition: max-width 1s ease-out;

        &.shrink {
          max-width: 30rem;
        }
      }

      .epithet-wrapper {
        flex: 1;
        display: flex;
        justify-content: center;

        &.left {
          justify-content: flex-end;
        }
        &.right {
          justify-content: flex-start;
        }
      }

      .epithet {
        padding: 0 0.75rem;
        font-weight: 600;
        font-size: 1.125rem;
        line-height: 30px;
        text-align: center;
        white-space: nowrap;
        transition: all 1s ease-out;
        border-radius: 9999px;
        color: #f0fafb;
        background: linear-gradient(to right, rgba(20, 184, 166, 0.9), rgba(6, 182, 212, 0.9));
        filter: blur(0.3px);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);

        &.shrink {
          font-size: 0.8rem;
        }
      }

      .epithet-enter {
        animation: epithet-appear 1s ease-out;
      }

      @keyframes epithet-appear {
        from {
          opacity: 0;
          transform: translateY(3rem) scale(0.75);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `,
  ],
})
export class Header implements OnInit {
  public readonly animationStage = signal(0);

  ngOnInit() {
    ANIMATION_TIMINGS.forEach((delay, index) => {
      setTimeout(() => {
        this.animationStage.set(index);
      }, delay);
    });
  }
}
