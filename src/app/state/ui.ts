import { effect, Injectable, signal } from '@angular/core';

const UI_SESSION_STORAGE_KEY = 'ui';

@Injectable({ providedIn: 'root' })
export class UiStore {
  public readonly ui = signal<'cli' | 'gui' | undefined>(undefined);

  public toggleUi(): void {
    this.ui.update((ui) => (ui === 'cli' ? 'gui' : 'cli'));
  }

  constructor() {
    // Load from session storage
    const initialUi = window.sessionStorage.getItem(UI_SESSION_STORAGE_KEY);
    this.ui.set(initialUi === 'cli' || initialUi === 'gui' ? initialUi : undefined);
    // Save to session storage
    effect(() => {
      const ui = this.ui();
      if (ui) {
        window.sessionStorage.setItem(UI_SESSION_STORAGE_KEY, ui);
      } else {
        window.sessionStorage.removeItem(UI_SESSION_STORAGE_KEY);
      }
    });
  }
}
