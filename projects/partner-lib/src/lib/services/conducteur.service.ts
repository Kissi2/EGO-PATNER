import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Driver, Vehicle } from '../models/conducteur.model';
import { environment } from '../../environments/environment';

export interface StatsJournees {
  totalJournees: number;
  conducteursActifs: number;
  dureeMoyenne: number;
  journeesAujourdhui: number;
}

interface ApiStatsJournees {
  total_journees?: number;
  conducteurs_actifs?: number;
  duree_moyenne?: number;
  journees_aujourd_hui?: number;
  [key: string]: unknown;
}

interface ApiTaxi {
  id: number;
  immatriculation: string;
  marque: string;
  type: string;
  statut: string;
}

interface ApiConducteur {
  id: number;
  created_at: number | string;
  nom: string;
  prenom: string;
  telephone: string;
  genre: string;
  statut: 'en_attente' | 'actif' | 'inactif';
  est_abonne: boolean;
  journee_id?: number;
  photo?: { url: string };
  permis?: { id: number; numero: string };
  taxis?: ApiTaxi[];
}

const STATUT_MAP: Record<string, Driver['statut']> = {
  actif:      'Actif',
  inactif:    'Inactif',
  en_attente: 'En attente',
};

@Injectable({ providedIn: 'root' })
export class ConducteurService {
  constructor(private http: HttpClient) {}

  getStatsJournees(dateDebut?: string, dateFin?: string): Observable<StatsJournees> {
    const token = localStorage.getItem('access_token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let params = new HttpParams();
    if (dateDebut) params = params.set('date_debut', dateDebut);
    if (dateFin)   params = params.set('date_fin', dateFin);
    return this.http
      .get<ApiStatsJournees>(`${environment.dataApiUrl}/admin/conducteur/stats-journees`, { headers, params })
      .pipe(
        map((r) => ({
          totalJournees:      Number(r['total_journees']       ?? r['total']               ?? 0),
          conducteursActifs:  Number(r['conducteurs_actifs']   ?? r['conducteurs']         ?? 0),
          dureeMoyenne:       Number(r['duree_moyenne']        ?? r['duree_moyenne_heures'] ?? 0),
          journeesAujourdhui: Number(r['journees_aujourd_hui'] ?? r['aujourd_hui']          ?? 0),
        })),
      );
  }

  getAll(): Observable<Driver[]> {
    const token = localStorage.getItem('access_token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<ApiConducteur[]>(`${environment.dataApiUrl}/partenaire/conducteurs/obtenir-tous`, { headers })
      .pipe(map((list) => list.map((c) => this.toDriver(c))));
  }

  private toDriver(c: ApiConducteur): Driver {
    const vehicules: Vehicle[] = (c.taxis ?? []).map((t) => ({
      marque: t.marque,
      modele: t.type,
      plaque: t.immatriculation,
    }));

    const creeLe = c.created_at
      ? new Date(Number(c.created_at)).toLocaleString('fr-FR')
      : '';

    return {
      id:        c.id,
      nomComplet: `${c.prenom} ${c.nom}`,
      telephone: c.telephone,
      photo:     c.photo?.url ?? '',
      statut:    STATUT_MAP[c.statut] ?? 'Inactif',
      genre:     c.genre,
      abonne:    c.est_abonne ? 'OUI' : 'NON',
      journee:   (c.journee_id ?? 0) !== 0 ? 'OUI' : 'NON',
      creeLe,
      permis:    c.permis?.numero ?? '',
      vehicules,
    };
  }
}
