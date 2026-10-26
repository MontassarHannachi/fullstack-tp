import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Child } from './child/child';
import { Products } from './products/products';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Child, Products],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);

  content = 'Content from Parent';
  states = ['Tozeur', 'Tunis', 'Nabeul'];
  chosen = signal('');

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  gotoContact() {
    this.router.navigate(['/contact']);
  }

  onSelected(state: string) {
    this.chosen.set(state);
  }
}
