import { Component, inject } from '@angular/core';

import { UiStore } from './state'
import { Background, Gui, Cli, UiToggle } from './components'

@Component({
  selector: 'app-root',
  imports: [Background, Gui, Cli, UiToggle],
  template: `
    @let ui = uiStore.ui();

    <app-background />
    @if (ui) {
      <app-ui-toggle />
    }
    @if(ui === 'gui') {
      <app-gui />
    }
    @else {
      <app-cli />
    }
  `,
  styles: [],
})
export class App {
  public readonly uiStore = inject(UiStore)
}
