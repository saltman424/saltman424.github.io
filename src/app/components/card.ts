import { Component, output, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <button class="card" (click)="click.emit()">
      <div class="glow-effect"></div>
      <div class="content">
        <div class="icon">{{ icon() }}</div>
        <div class="title">{{ title() }}</div>
        <div class="description">{{ description() }}</div>
      </div>
    </button>
  `,
  styles: [
    `
      .card {
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

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        &:hover::before {
          left: 100%;
        }

        &:hover {
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

        &:active {
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
      }

      .glow-effect {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(0, 255, 255, 0.15) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .card:hover .glow-effect {
        opacity: 1;
      }

      .content {
        position: relative;
        z-index: 1;
      }

      .icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.3));
      }

      .title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #00ffff;
        margin-bottom: 0.5rem;
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }

      .description {
        font-size: 1rem;
        color: rgba(224, 224, 224, 0.7);
        font-family: 'Courier New', monospace;
      }
    `,
  ],
})
export class Card {
  public readonly click = output<void>();
  public readonly icon = input.required<string>();
  public readonly title = input.required<string>();
  public readonly description = input.required<string>();
}
