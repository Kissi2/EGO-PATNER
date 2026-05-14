import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface JourneeDetail {
  debut: string;
  fin: string;
  duree: number;
  statut: 'TERMINER' | 'EN_COURS';
}

export interface ConducteurSemaine {
  id: number;
  nomComplet: string;
  telephone: string;
  nbJournees: number;
  totalHeures: number;
  journees: JourneeDetail[];
  isExpanded: boolean;
}

export interface Semaine {
  id: number;
  dateDebut: string;
  dateFin: string;
  creeLe: string;
  conducteurs: ConducteurSemaine[];
  isExpanded: boolean;
}

@Component({
  selector: 'lib-historique-journees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique-journees.html',
  styleUrls: ['./historique-journees.scss'],
})
export class HistoriqueJourneesComponent {

  constructor(private router: Router) {}

  search = '';

  semaines: Semaine[] = [
    {
      id: 1,
      dateDebut: '04 mai 2026',
      dateFin: '10 mai 2026',
      creeLe: '10 mai 2026',
      isExpanded: false,
      conducteurs: [
        {
          id: 1, nomComplet: 'Moussa SANGARE', telephone: '0707541649',
          nbJournees: 4, totalHeures: 42, isExpanded: false,
          journees: [
            { debut: '05/05/2026 00:02', fin: '05/05/2026 11:00', duree: 10, statut: 'TERMINER' },
            { debut: '06/05/2026 06:15', fin: '06/05/2026 17:00', duree: 10, statut: 'TERMINER' },
            { debut: '08/05/2026 07:30', fin: '08/05/2026 18:30', duree: 11, statut: 'TERMINER' },
            { debut: '09/05/2026 08:00', fin: '09/05/2026 19:00', duree: 11, statut: 'TERMINER' },
          ],
        },
        {
          id: 2, nomComplet: 'FOFANA AMARA', telephone: '0707519605',
          nbJournees: 3, totalHeures: 31, isExpanded: false,
          journees: [
            { debut: '04/05/2026 05:00', fin: '04/05/2026 15:00', duree: 10, statut: 'TERMINER' },
            { debut: '06/05/2026 06:00', fin: '06/05/2026 16:30', duree: 10, statut: 'TERMINER' },
            { debut: '09/05/2026 07:00', fin: '09/05/2026 18:00', duree: 11, statut: 'TERMINER' },
          ],
        },
        {
          id: 3, nomComplet: 'Zie OUATTARA', telephone: '0555191828',
          nbJournees: 3, totalHeures: 32, isExpanded: false,
          journees: [
            { debut: '05/05/2026 00:02', fin: '05/05/2026 11:00', duree: 10, statut: 'TERMINER' },
            { debut: '07/05/2026 01:06', fin: '07/05/2026 12:00', duree: 10, statut: 'TERMINER' },
            { debut: '10/05/2026 02:15', fin: '10/05/2026 13:00', duree: 10, statut: 'TERMINER' },
          ],
        },
        {
          id: 4, nomComplet: 'GNANOU HOUMAROU', telephone: '0707304603',
          nbJournees: 3, totalHeures: 32, isExpanded: false,
          journees: [
            { debut: '05/05/2026 03:00', fin: '05/05/2026 14:00', duree: 11, statut: 'TERMINER' },
            { debut: '07/05/2026 04:00', fin: '07/05/2026 15:00', duree: 11, statut: 'TERMINER' },
            { debut: '09/05/2026 06:00', fin: '09/05/2026 16:00', duree: 10, statut: 'TERMINER' },
          ],
        },
        {
          id: 5, nomComplet: 'IBRAHIMA KEITA', telephone: '0709078738',
          nbJournees: 3, totalHeures: 30, isExpanded: false,
          journees: [
            { debut: '04/05/2026 07:00', fin: '04/05/2026 17:00', duree: 10, statut: 'TERMINER' },
            { debut: '06/05/2026 08:00', fin: '06/05/2026 18:00', duree: 10, statut: 'TERMINER' },
            { debut: '08/05/2026 09:00', fin: '08/05/2026 19:00', duree: 10, statut: 'TERMINER' },
          ],
        },
        {
          id: 6, nomComplet: 'Seydou SANGARE', telephone: '0504898736',
          nbJournees: 3, totalHeures: 30, isExpanded: false,
          journees: [
            { debut: '05/05/2026 06:00', fin: '05/05/2026 16:00', duree: 10, statut: 'TERMINER' },
            { debut: '07/05/2026 07:00', fin: '07/05/2026 17:00', duree: 10, statut: 'TERMINER' },
            { debut: '10/05/2026 08:00', fin: '10/05/2026 18:00', duree: 10, statut: 'TERMINER' },
          ],
        },
      ],
    },
    {
      id: 2,
      dateDebut: '27 avril 2026',
      dateFin: '03 mai 2026',
      creeLe: '03 mai 2026',
      isExpanded: false,
      conducteurs: [
        {
          id: 7, nomComplet: 'Koné MAMADOU', telephone: '0701234567',
          nbJournees: 4, totalHeures: 40, isExpanded: false,
          journees: [
            { debut: '28/04/2026 06:00', fin: '28/04/2026 16:00', duree: 10, statut: 'TERMINER' },
            { debut: '29/04/2026 07:00', fin: '29/04/2026 17:00', duree: 10, statut: 'TERMINER' },
            { debut: '01/05/2026 06:00', fin: '01/05/2026 16:00', duree: 10, statut: 'TERMINER' },
            { debut: '02/05/2026 07:00', fin: '02/05/2026 17:00', duree: 10, statut: 'TERMINER' },
          ],
        },
        {
          id: 8, nomComplet: 'Diallo IBRAHIM', telephone: '0789012345',
          nbJournees: 3, totalHeures: 28, isExpanded: false,
          journees: [
            { debut: '27/04/2026 05:00', fin: '27/04/2026 14:00', duree: 9, statut: 'TERMINER' },
            { debut: '30/04/2026 06:00', fin: '30/04/2026 15:00', duree: 9, statut: 'TERMINER' },
            { debut: '02/05/2026 05:30', fin: '02/05/2026 16:00', duree: 10, statut: 'TERMINER' },
          ],
        },
        {
          id: 9, nomComplet: 'Traoré SEKOU', telephone: '0756789012',
          nbJournees: 2, totalHeures: 20, isExpanded: false,
          journees: [
            { debut: '28/04/2026 08:00', fin: '28/04/2026 18:00', duree: 10, statut: 'TERMINER' },
            { debut: '03/05/2026 08:00', fin: '03/05/2026 18:00', duree: 10, statut: 'TERMINER' },
          ],
        },
      ],
    },
    {
      id: 3,
      dateDebut: '20 avril 2026',
      dateFin: '26 avril 2026',
      creeLe: '26 avril 2026',
      isExpanded: false,
      conducteurs: [
        {
          id: 10, nomComplet: 'Bamba OUMAR', telephone: '0712345678',
          nbJournees: 5, totalHeures: 50, isExpanded: false,
          journees: [
            { debut: '20/04/2026 06:00', fin: '20/04/2026 16:00', duree: 10, statut: 'TERMINER' },
            { debut: '21/04/2026 06:00', fin: '21/04/2026 16:00', duree: 10, statut: 'TERMINER' },
            { debut: '22/04/2026 06:00', fin: '22/04/2026 16:00', duree: 10, statut: 'TERMINER' },
            { debut: '24/04/2026 06:00', fin: '24/04/2026 16:00', duree: 10, statut: 'TERMINER' },
            { debut: '25/04/2026 06:00', fin: '25/04/2026 16:00', duree: 10, statut: 'TERMINER' },
          ],
        },
      ],
    },
    {
      id: 4,
      dateDebut: '13 avril 2026',
      dateFin: '19 avril 2026',
      creeLe: '19 avril 2026',
      isExpanded: false,
      conducteurs: [
        {
          id: 11, nomComplet: 'Coulibaly ADAMA', telephone: '0698765432',
          nbJournees: 3, totalHeures: 33, isExpanded: false,
          journees: [
            { debut: '14/04/2026 07:00', fin: '14/04/2026 18:00', duree: 11, statut: 'TERMINER' },
            { debut: '16/04/2026 07:00', fin: '16/04/2026 18:00', duree: 11, statut: 'TERMINER' },
            { debut: '18/04/2026 07:00', fin: '18/04/2026 18:00', duree: 11, statut: 'TERMINER' },
          ],
        },
      ],
    },
    {
      id: 5,
      dateDebut: '06 avril 2026',
      dateFin: '12 avril 2026',
      creeLe: '16 avril 2026',
      isExpanded: false,
      conducteurs: [
        {
          id: 12, nomComplet: 'Yao KOUASSI', telephone: '0745678901',
          nbJournees: 4, totalHeures: 44, isExpanded: false,
          journees: [
            { debut: '07/04/2026 05:00', fin: '07/04/2026 16:00', duree: 11, statut: 'TERMINER' },
            { debut: '08/04/2026 05:00', fin: '08/04/2026 16:00', duree: 11, statut: 'TERMINER' },
            { debut: '10/04/2026 05:00', fin: '10/04/2026 16:00', duree: 11, statut: 'TERMINER' },
            { debut: '11/04/2026 05:00', fin: '11/04/2026 16:00', duree: 11, statut: 'TERMINER' },
          ],
        },
      ],
    },
    {
      id: 6,
      dateDebut: '30 mars 2026',
      dateFin: '05 avril 2026',
      creeLe: '05 avril 2026',
      isExpanded: false,
      conducteurs: [
        {
          id: 13, nomComplet: 'Sylla MOUSSA', telephone: '0667890123',
          nbJournees: 2, totalHeures: 20, isExpanded: false,
          journees: [
            { debut: '01/04/2026 08:00', fin: '01/04/2026 18:00', duree: 10, statut: 'TERMINER' },
            { debut: '03/04/2026 08:00', fin: '03/04/2026 18:00', duree: 10, statut: 'TERMINER' },
          ],
        },
      ],
    },
  ];

  get totalSemaines(): number { return this.semaines.length; }

  get filteredSemaines(): Semaine[] {
    if (!this.search.trim()) return this.semaines;
    const q = this.search.toLowerCase();
    return this.semaines.filter(s =>
      s.conducteurs.some(c => c.nomComplet.toLowerCase().includes(q))
    );
  }

  getFilteredConducteurs(semaine: Semaine): ConducteurSemaine[] {
    if (!this.search.trim()) return semaine.conducteurs;
    const q = this.search.toLowerCase();
    return semaine.conducteurs.filter(c => c.nomComplet.toLowerCase().includes(q));
  }

  toggleSemaine(semaine: Semaine): void {
    semaine.isExpanded = !semaine.isExpanded;
  }

  toggleConducteur(conducteur: ConducteurSemaine): void {
    conducteur.isExpanded = !conducteur.isExpanded;
  }

  getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
