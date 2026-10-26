import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  private service = inject(ProductService);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);
  error = signal('');

  constructor() {
    this.route.paramMap.subscribe((params) => this.load(params.get('id')));
  }

  load(id: string | null) {
    this.product.set(null);
    this.error.set('');
    if (!id || !/^\d+$/.test(id)) {
      this.error.set('Product not found');
      return;
    }
    this.service.getProduct(Number(id)).subscribe({
      next: (data) => this.product.set(data),
      error: (e) => this.error.set(e.status === 404 ? 'Product not found' : 'Unable to load the product'),
    });
  }
}
