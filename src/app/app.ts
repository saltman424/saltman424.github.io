import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Background, Header } from './components'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Background, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
