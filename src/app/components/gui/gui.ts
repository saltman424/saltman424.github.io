import { Component } from '@angular/core';
import { Header } from './header';

@Component({
  selector: 'app-gui',
  standalone: true,
  imports: [Header],
  template: `<app-header />`,
  styles: []
})
export class Gui {}