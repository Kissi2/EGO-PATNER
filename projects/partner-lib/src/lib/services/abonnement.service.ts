import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Paiement } from '../models/abonnement.model';
import { Gain } from '../models/gain.model';
import { environment } from '../../environments/environment';

interface ApiConducteur {
  id: number;
  nom: string;
  prenom: string;
}

interface ApiAbonnement {
  id: number;
  montant: number;
  type_abonnement: string;
}

interface ApiPaiement {
  id: number;
  created_at: number | string;
  reference: string;
  extras: Record<string, unknown>;
  conducteur_id: number;
  conducteur: ApiConducteur;
  abonnement: ApiAbonnement;
}

interface ApiItem {
  id: number;
  created_at: number | string;
  gain_federation: number;
  paiement_id: number;
  paiement: ApiPaiement;
}

interface ApiResponse {
  liste: ApiItem[];
  total_journalier: string;
  total_hebdomadaire: string;
  total_mensuel: string;
  cumul: string;
}

export interface AbonnementData {
  paiements:         Paiement[];
  gains:             Gain[];
  totalJournalier:   number;
  totalHebdomadaire: number;
  totalMensuel:      number;
  cumul:             number;
}

const TYPE_MAP: Record<string, string> = {
  journalier:   'Journalier',
  hebdomadaire: 'Hebdomadaire',
  mensuel:      'Mensuel',
};

@Injectable({ providedIn: 'root' })
export class AbonnementService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<AbonnementData> {
    const token = localStorage.getItem('access_token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<ApiResponse>(`${environment.dataApiUrl}/partenaire/abonnement/obtenir-tous`, { headers })
      .pipe(
        map((res) => ({
          paiements:         res.liste.map((item) => this.toPaiement(item)),
          gains:             res.liste.map((item) => this.toGain(item)),
          totalJournalier:   Number(res.total_journalier)   || 0,
          totalHebdomadaire: Number(res.total_hebdomadaire) || 0,
          totalMensuel:      Number(res.total_mensuel)      || 0,
          cumul:             Number(res.cumul)              || 0,
        })),
      );
  }

  private toPaiement(item: ApiItem): Paiement {
    const typeRaw = item.paiement?.abonnement?.type_abonnement ?? '';
    return {
      id:             item.id,
      datePaiement:   this.formatDate(item.created_at),
      conducteur:     `${item.paiement?.conducteur?.prenom ?? ''} ${item.paiement?.conducteur?.nom ?? ''}`.trim(),
      typeAbonnement: TYPE_MAP[typeRaw.toLowerCase()] ?? typeRaw,
      montant:        item.paiement?.abonnement?.montant ?? 0,
      gain:           item.gain_federation,
    };
  }

  private toGain(item: ApiItem): Gain {
    return {
      id:            item.id,
      date:          this.formatDate(item.created_at),
      source:        item.paiement?.reference ?? '',
      montant:       item.gain_federation,
      moyenPaiement: '—',
      statut:        'Payé',
    };
  }

  private formatDate(ts: number | string): string {
    if (!ts || ts === 'now') return '';
    return new Date(Number(ts)).toLocaleString('fr-FR');
  }
}
