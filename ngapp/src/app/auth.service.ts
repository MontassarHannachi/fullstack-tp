import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

const KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private token = signal<string | null>(localStorage.getItem(KEY));

  getToken(): string | null {
    return this.token();
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((r) => {
          localStorage.setItem(KEY, r.token);
          this.token.set(r.token);
        })
      );
  }

  logout() {
    localStorage.removeItem(KEY);
    this.token.set(null);
  }

  isLoggedIn(): boolean {
    const token = this.token();
    if (!token) return false;
    if (this.expired(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  private expired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
