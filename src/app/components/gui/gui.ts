import { Component } from '@angular/core';
import { Header } from './header';
import { Body } from './body';

@Component({
  selector: 'app-gui',
  standalone: true,
  imports: [Header, Body],
  template: `
    <app-gui-header />
    <app-gui-body />
  `,
  styles: [],
})
export class Gui {}
