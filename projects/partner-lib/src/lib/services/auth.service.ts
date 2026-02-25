import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { LoginResponse, Partenaire } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<Partenaire | null>(null);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.authApiUrl}/auth/partenaire/login`, { username, password })
      .pipe(
        tap((response) => {
          const token = response.authToken ?? response.token ?? response.access_token;
          if (token) {
            localStorage.setItem('access_token', String(token));
          }
        }),
      );
  }

  getMe(): Observable<Partenaire> {
    const token = localStorage.getItem('access_token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<Record<string, unknown>>(`${environment.authApiUrl}/auth/partenaire/me`, { headers })
      .pipe(
        map((raw) => ({
          id:        raw['id'],
          username:  raw['username'],
          firstName: raw['nom'],
          lastName:  raw['prenom'],
          email:     raw['email'],
          phone:     raw['telephone'],
          role:      "Administrateur Partenaire",
          status:    (raw['actif'] as boolean) ? 'Actif' : 'Inactif',
          joinDate:  raw['created_at'],
        } as Partenaire)),
        tap((user) => this.currentUser.set(user)),
      );
  }

  updateProfile(data: { nom: string; prenom: string; email: string; telephone: string }): Observable<void> {
    const token = localStorage.getItem('access_token') ?? '';
    const headers = new HttpHeaders({
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http
      .put<void>(`${environment.dataApiUrl}/partenaire/profil/update`, data, { headers })
      .pipe(
        tap(() => {
          const current = this.currentUser();
          if (current) {
            this.currentUser.set({
              ...current,
              firstName: data.nom,
              lastName:  data.prenom,
              email:     data.email,
              phone:     data.telephone,
            });
          }
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUser.set(null);
  }
}
