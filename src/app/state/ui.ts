import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStore {
  public readonly ui = signal<'cli' | 'gui' | undefined>(undefined);

  public toggleUi(): void {
    this.ui.update((ui) => (ui === 'cli' ? 'gui' : 'cli'));
  }
}
