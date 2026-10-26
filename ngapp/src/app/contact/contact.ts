import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  id = signal<string | null>(null);
  private route = inject(ActivatedRoute);

  constructor() {
    // paramMap est un Observable : il émet à chaque changement de paramètre
    this.route.paramMap.subscribe((params) => this.id.set(params.get('id')));
  }
}
