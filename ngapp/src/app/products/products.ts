import { Component, computed, inject, signal } from '@angular/core';
import { CategoryCount, ProductPage } from '../models/product';
import { ProductService } from '../product.service';
import { ProductCard } from '../product-card/product-card';

const LIMIT = 12;

@Component({
  selector: 'app-products',
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private service = inject(ProductService);

  skip = signal(0);
  q = signal('');
  category = signal('');
  categories = signal<CategoryCount[]>([]);
  page = signal<ProductPage | null>(null);
  error = signal('');

  hasPrevious = computed(() => this.skip() > 0);
  hasNext = computed(() => {
    const p = this.page();
    return !!p && this.skip() + LIMIT < p.total;
  });
  rangeEnd = computed(() => this.skip() + (this.page()?.products.length ?? 0));

  constructor() {
    this.service.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: () => this.categories.set([]),
    });
    this.load();
  }

  load() {
    this.error.set('');
    this.service.getProducts(LIMIT, this.skip(), this.q(), this.category()).subscribe({
      next: (data) => this.page.set(data),
      error: () => this.error.set('Unable to load the products'),
    });
  }

  search(q: string, category: string) {
    this.q.set(q.trim());
    this.category.set(category);
    this.skip.set(0);
    this.load();
  }

  reset() {
    this.search('', '');
  }

  next() {
    this.skip.update((s) => s + LIMIT);
    this.load();
  }

  previous() {
    this.skip.update((s) => Math.max(0, s - LIMIT));
    this.load();
  }
}
