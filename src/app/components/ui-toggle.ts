import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStore } from '../state';

@Component({
  selector: 'app-ui-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    @let isCli = uiStore.ui() === 'cli';

    <button
      class="toggle-button"
      (click)="uiStore.toggleUi()"
      [attr.aria-label]="'Switch to ' + (isCli ? 'GUI' : 'CLI') + ' mode'"
    >
      <div class="toggle-track" [class.cli-active]="isCli">
        <div class="toggle-slider" [class.cli-active]="isCli">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            @if (isCli) {
              <path d="M8 9l3 3-3 3m5 0h4" stroke-linecap="round" stroke-linejoin="round" />
            } @else {
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            }
          </svg>
        </div>
        <span class="mode-label left" [class.active]="isCli">CLI</span>
        <span class="mode-label right" [class.active]="!isCli">GUI</span>
      </div>
    </button>
  `,
  styles: [
    `
      $track-height: 36px;
      $track-width: 64px;
      $track-radius: 24px;
      $track-h-padding: 16px;
      $slider-margin: 2px;
      $slider-height: calc($track-height - $slider-margin * 2);
      $slider-width: 44px;
      $slider-radius: 20px;

      :host {
        position: fixed;
        top: 10px;
        right: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
      }

      .toggle-button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        outline: none;
      }

      .toggle-button:focus-visible .toggle-track {
        box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.3);
      }

      .toggle-track {
        position: relative;
        width: $track-width;
        height: $track-height;
        background: rgba(20, 20, 20, 0.8);
        border: 1.5px solid rgba(0, 255, 255, 0.2);
        border-radius: $track-radius;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 $track-h-padding;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
      }

      .toggle-track:hover {
        border-color: rgba(0, 255, 255, 0.4);
        background: rgba(25, 25, 25, 0.8);
      }

      .toggle-slider {
        position: absolute;
        left: $slider-margin;
        width: $slider-width;
        height: $slider-height;
        background: linear-gradient(135deg, #00ffff 0%, #00cccc 100%);
        border-radius: $slider-radius;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 255, 255, 0.4);
      }

      .toggle-slider.cli-active {
        transform: translateX(
          calc($track-width + 2 * $track-h-padding - $slider-width - 2 * $slider-margin)
        );
      }

      .icon {
        width: 20px;
        height: 20px;
        color: #0a0a0a;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
      }

      .mode-label {
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1;
        user-select: none;
        text-transform: uppercase;
      }

      .mode-label.left {
        margin-left: 0;
      }

      .mode-label.right {
        margin-right: 0;
      }

      .mode-label.active {
        opacity: 1;
        color: rgba(0, 255, 255, 0.9);
        text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
      }

      @media (prefers-reduced-motion: reduce) {
        .toggle-slider,
        .toggle-track,
        .mode-label {
          transition: none;
        }
      }
    `,
  ],
})
export class UiToggle {
  public readonly uiStore = inject(UiStore);
}
