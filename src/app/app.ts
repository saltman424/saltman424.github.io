import { Component, inject } from '@angular/core';

import { UiStore } from './state';
import { Background, Cli, Gui, Intro, UiToggle } from './components';

@Component({
  selector: 'app-root',
  imports: [Background, Cli, Gui, Intro, UiToggle],
  template: `
    @let ui = uiStore.ui();

    <app-background />
    @if (ui) {
      <app-ui-toggle />
    }
    @switch (ui) {
      @case ('gui') {
        <app-gui />
      }
      @case ('cli') {
        <app-cli />
      }
      @default {
        <app-intro />
      }
    }
  `,
  styles: [],
})
export class App {
  public readonly uiStore = inject(UiStore);
}
