import { Component, inject, signal } from '@angular/core';
import { CarouselStore } from '../../state';

@Component({
  selector: 'app-gui-body',
  template: `
    @let sections = carouselStore.sections;
    @let activeIndex = carouselStore.activeIndex();

    <!-- Main Content Area -->
    <div class="content-area">
      <div class="corner-accent tl"></div>
      <div class="corner-accent tr"></div>
      <div class="corner-accent bl"></div>
      <div class="corner-accent br"></div>

      <div class="content">
        <h2 class="content-title">{{ sections[activeIndex].content }}</h2>
        <div class="content-details">
          @for (detail of sections[activeIndex].details; track $index) {
            <p class="detail-item" [innerHTML]="detail"></p>
          }
        </div>
      </div>
    </div>

    <!-- Animated Carousel -->
    <div class="carousel-wrapper">
      <div class="carousel-glow"></div>
      <button class="nav-button prev" (click)="carouselStore.previous()" aria-label="Previous">
        <span class="material-icons">chevron_left</span>
      </button>

      <div class="carousel-track-container">
        <div class="carousel-track" [style.transform]="carouselTransform">
          @for (section of sections; track $index) {
            <div
              class="carousel-item"
              [class.active]="$index === activeIndex"
              [class.adjacent]="$index === activeIndex - 1 || $index === activeIndex + 1"
              (click)="select($index)"
            >
              <div class="item-glow"></div>
              <span class="material-icons item-icon">{{ section.icon }}</span>
              <span class="item-title">{{ section.title }}</span>
              <div class="item-indicator"></div>
            </div>
          }
        </div>
      </div>

      <button class="nav-button next" (click)="carouselStore.next()" aria-label="Next">
        <span class="material-icons">chevron_right</span>
      </button>
    </div>

    <!-- Progress Dots -->
    <div class="progress-dots">
      @for (section of sections; track $index) {
        <button
          class="dot"
          [class.active]="$index === activeIndex"
          (click)="select($index)"
          [attr.aria-label]="'Go to ' + section.title"
        ></button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        top: 6rem;
        bottom: 0;
        width: 100%;
        max-width: 1200px;
        margin-left: 50%;
        transform: translateX(-50%);
        padding: 2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        animation: 1s fade-in 4s ease-in-out backwards;
      }

      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .content-area {
        position: relative;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 12px;
        padding: 3rem;
        margin-bottom: 1.2rem;
        min-height: 200px;
        box-shadow: 0 8px 32px rgba(0, 255, 255, 0.1);
        flex: 1;

        .corner-accent {
          position: absolute;
          width: 64px;
          height: 64px;

          &.tl {
            top: 0;
            left: 0;
            border-top: 2px solid rgba(0, 255, 255, 0.6);
            border-left: 2px solid rgba(0, 255, 255, 0.6);
            border-top-left-radius: 12px;
          }

          &.tr {
            top: 0;
            right: 0;
            border-top: 2px solid rgba(0, 255, 255, 0.6);
            border-right: 2px solid rgba(0, 255, 255, 0.6);
            border-top-right-radius: 12px;
          }

          &.bl {
            bottom: 0;
            left: 0;
            border-bottom: 2px solid rgba(0, 255, 255, 0.6);
            border-left: 2px solid rgba(0, 255, 255, 0.6);
            border-bottom-left-radius: 12px;
          }

          &.br {
            bottom: 0;
            right: 0;
            border-bottom: 2px solid rgba(0, 255, 255, 0.6);
            border-right: 2px solid rgba(0, 255, 255, 0.6);
            border-bottom-right-radius: 12px;
          }
        }

        .content {
          position: relative;
          z-index: 10;

          .content-title {
            font-size: 2rem;
            font-weight: bold;
            color: #00ffff;
            margin-bottom: 1.5rem;
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
          }

          .content-details {
            .detail-item {
              color: #d1d5db;
              line-height: 1.8;
              margin-bottom: 1rem;
              font-size: 1.1rem;
            }
          }
        }
      }

      .carousel-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .carousel-glow {
          position: absolute;
          width: 300px;
          height: 150px;
          background: radial-gradient(ellipse, rgba(0, 255, 255, 0.2), transparent);
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
        }

        .nav-button {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 255, 255, 0.5);
          color: #00ffff;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background: rgba(0, 255, 255, 0.2);
            border-color: #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
            transform: scale(1.05);
          }

          .material-icons {
            font-size: 28px;
          }

          &.prev {
            margin-right: 1rem;
          }

          &.next {
            margin-left: 1rem;
          }
        }

        .carousel-track-container {
          flex: 1;
          position: relative;
          max-width: 800px;
          overflow-x: clip;
          overflow-y: visible;
        }

        .carousel-track {
          display: flex;
          gap: 1rem;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .carousel-item {
          position: relative;
          min-width: 100px;
          height: 100px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.4;
          transform: scale(0.85);

          .item-glow {
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.3), transparent);
            border-radius: 12px;
            opacity: 0;
            transition: opacity 0.4s ease;
            filter: blur(8px);
          }

          .item-icon {
            font-size: 32px;
            color: rgba(0, 255, 255, 0.7);
            margin-bottom: 0.5rem;
            transition: all 0.3s ease;
          }

          .item-title {
            font-size: 0.9rem;
            color: #9ca3af;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .item-indicator {
            position: absolute;
            bottom: 8px;
            width: 40px;
            height: 3px;
            background: #00ffff;
            border-radius: 2px;
            opacity: 0;
            transition: all 0.3s ease;
          }

          &.adjacent {
            opacity: 0.6;
            transform: scale(0.9);
          }

          &.active {
            opacity: 1;
            transform: scale(1.1);
            border-color: #00ffff;
            background: rgba(0, 255, 255, 0.1);
            box-shadow:
              0 0 30px rgba(0, 255, 255, 0.3),
              inset 0 0 20px rgba(0, 255, 255, 0.1);

            .item-glow {
              opacity: 1;
            }

            .item-icon {
              color: #00ffff;
              transform: scale(1.1);
              filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.8));
            }

            .item-title {
              color: #00ffff;
            }

            .item-indicator {
              opacity: 1;
              box-shadow: 0 0 10px #00ffff;
            }
          }

          &:not(.active):hover {
            opacity: 0.8;
            transform: scale(0.95);
            border-color: rgba(0, 255, 255, 0.6);
          }
        }
      }

      .progress-dots {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 1.5rem;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0, 255, 255, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;

          &:hover {
            background: rgba(0, 255, 255, 0.5);
            transform: scale(1.2);
          }

          &.active {
            width: 24px;
            border-radius: 4px;
            background: #00ffff;
            box-shadow: 0 0 12px rgba(0, 255, 255, 0.8);
          }
        }
      }

      @media (max-width: 768px) {
        .carousel-item {
          min-width: 100px;
          height: 100px;

          .item-icon {
            font-size: 28px;
          }
        }
      }
    `,
  ],
})
export class Body {
  public readonly carouselStore = inject(CarouselStore);
  public readonly isAnimating = signal(false);

  public get carouselTransform(): string {
    const offset = this.carouselStore.activeIndex() * -120;
    return `translateX(calc(50% - 60px + ${offset}px))`;
  }

  public select(index: number) {
    if (index !== this.carouselStore.activeIndex() && !this.isAnimating()) {
      this.isAnimating.set(true);
      this.carouselStore.goto(index);
      setTimeout(() => this.isAnimating.set(false), 400);
    }
  }
}
