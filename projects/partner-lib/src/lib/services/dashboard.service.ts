import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { EvolutionGainData, DashboardStats } from '../models/dashboard.model';
import { environment } from '../../environments/environment';

interface ApiGainPoint {
  mois: string;
  gain: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getEvolutionGain(): Observable<EvolutionGainData> {
    const token = localStorage.getItem('access_token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<ApiGainPoint[]>(`${environment.dataApiUrl}/partenaire/dashboard/evolution-gain`, { headers })
      .pipe(
        map((res) => ({
          labels: res.map((p) => p.mois),
          values: res.map((p) => p.gain),
        })),
      );
  }

  getStats(): Observable<DashboardStats> {
    const token = localStorage.getItem('access_token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<Record<string, unknown>>(`${environment.dataApiUrl}/partenaire/dashboard/stats`, { headers })
      .pipe(
        map((res) => ({
          conducteurs: Number(res['conducteurs']      ?? 0),
          abonnements: Number(res['abonnements_payes'] ?? 0),
          gains:       Number(res['cumul_gain']       ?? 0),
        })),
      );
  }
}
