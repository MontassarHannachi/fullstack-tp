import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  id = signal<string | null>(null);
  private route = inject(ActivatedRoute);

  formData = {
    name: '',
    email: '',
  };

  constructor() {
    this.route.paramMap.subscribe((params) => this.id.set(params.get('id')));
  }

  onSubmit() {
    console.log('Form submitted:', this.formData);
  }
}
