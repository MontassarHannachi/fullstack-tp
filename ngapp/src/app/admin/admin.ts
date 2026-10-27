import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../models/product';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { AuthService } from '../auth.service';

const LIMIT = 10;
const EMPTY = { title: '', description: '', price: 1, thumbnail: '', stock: 0, category: '' };

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin.html',
})
export class Admin {
  private service = inject(ProductService);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  total = signal(0);
  skip = signal(0);
  editingId = signal<number | null>(null);
  message = signal('');
  error = signal('');

  form = this.fb.nonNullable.group({
    title: [EMPTY.title, [Validators.required, Validators.minLength(2)]],
    description: [EMPTY.description, Validators.required],
    price: [EMPTY.price, [Validators.required, Validators.min(0.01)]],
    thumbnail: [EMPTY.thumbnail, [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    stock: [EMPTY.stock, [Validators.required, Validators.min(0)]],
    category: [EMPTY.category, Validators.required],
  });

  constructor() {
    this.load();
  }

  load() {
    this.service.getProducts(LIMIT, this.skip()).subscribe({
      next: (page) => {
        this.products.set(page.products);
        this.total.set(page.total);
      },
      error: () => this.error.set('Unable to load the products'),
    });
  }

  next() {
    this.skip.update((s) => s + LIMIT);
    this.load();
  }

  previous() {
    this.skip.update((s) => Math.max(0, s - LIMIT));
    this.load();
  }

  startEdit(p: Product) {
    this.message.set('');
    this.error.set('');
    this.editingId.set(p.id);
    this.form.setValue({
      title: p.title,
      description: p.description,
      price: Number(p.price),
      thumbnail: p.thumbnail,
      stock: p.stock,
      category: p.category.name,
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  cancel() {
    this.editingId.set(null);
    this.form.reset(EMPTY);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.message.set('');
    this.error.set('');
    const value = this.form.getRawValue();
    const id = this.editingId();
    const request = id ? this.service.updateProduct(id, value) : this.service.createProduct(value);
    request.subscribe({
      next: (p) => {
        this.message.set('Product #' + p.id + (id ? ' updated' : ' created'));
        this.cancel();
        this.load();
      },
      error: (e: HttpErrorResponse) => this.error.set(this.describe(e)),
    });
  }

  remove(p: Product) {
    if (!confirm('Delete "' + p.title + '"?')) return;
    this.message.set('');
    this.error.set('');
    this.service.deleteProduct(p.id).subscribe({
      next: () => {
        this.message.set('Product #' + p.id + ' deleted');
        if (this.editingId() === p.id) this.cancel();
        this.load();
      },
      error: (e: HttpErrorResponse) => this.error.set(this.describe(e)),
    });
  }

  private describe(e: HttpErrorResponse): string {
    const details = e.error?.details as { path: (string | number)[]; message: string }[] | undefined;
    if (details) return details.map((d) => d.path.join('.') + ': ' + d.message).join(' | ');
    return e.error?.error ?? 'Request failed (' + e.status + ')';
  }
}

