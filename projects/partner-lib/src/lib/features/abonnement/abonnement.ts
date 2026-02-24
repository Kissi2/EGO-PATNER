import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../shared/stat-card/stat-card';
import { TableCardComponent } from '../../shared/table-card/table-card';
import { ExportService } from '../../shared/export.service';
import { DateRangePickerComponent, DateRange } from '../../shared/date-range-picker/date-range-picker';

export interface Paiement {
  id: number;
  datePaiement: string;
  conducteur: string;
  typeAbonnement: 'Journalier' | 'Hebdomadaire' | 'Mensuel';
  montant: number;
  gain: number;
}

@Component({
  selector: 'lib-abonnement',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, TableCardComponent, DateRangePickerComponent],
  templateUrl: './abonnement.html',
  styleUrls: ['./abonnement.scss'],
})
export class AbonnementComponent {

  constructor(private exportSvc: ExportService) {}

  exportToExcel(): void {
    const rows = this.filtered.map(p => ({
      'Date de paiement':  p.datePaiement,
      'Conducteur':        p.conducteur,
      'Type abonnement':   p.typeAbonnement,
      'Montant (FCFA)':    p.montant,
      'Gain (FCFA)':       p.gain,
    }));
    this.exportSvc.exportToExcel(rows, 'Abonnements', 'Abonnements');
  }

  private allPaiements: Paiement[] = [
    { id: 1,  datePaiement: '20/02/2026 14:32', conducteur: 'Lucien Simpohi',           typeAbonnement: 'Mensuel',      montant: 15000, gain: 1500 },
    { id: 2,  datePaiement: '20/02/2026 09:15', conducteur: 'KOUAMÉ INNOCENT Moto',     typeAbonnement: 'Hebdomadaire', montant: 5000,  gain: 500  },
    { id: 3,  datePaiement: '19/02/2026 16:45', conducteur: 'Gapea Israel Gbougnon',    typeAbonnement: 'Journalier',   montant: 1000,  gain: 100  },
    { id: 4,  datePaiement: '19/02/2026 11:20', conducteur: "N'doumi Hermann Djama",    typeAbonnement: 'Mensuel',      montant: 15000, gain: 1500 },
    { id: 5,  datePaiement: '18/02/2026 08:50', conducteur: "N'guessan Nicolas Assoua", typeAbonnement: 'Hebdomadaire', montant: 5000,  gain: 500  },
    { id: 6,  datePaiement: '18/02/2026 13:05', conducteur: 'Diallo Ibrahim',            typeAbonnement: 'Journalier',   montant: 1000,  gain: 100  },
    { id: 7,  datePaiement: '17/02/2026 10:30', conducteur: 'Touré Adama',              typeAbonnement: 'Mensuel',      montant: 15000, gain: 1500 },
    { id: 8,  datePaiement: '17/02/2026 15:55', conducteur: 'Coulibaly Drissa',         typeAbonnement: 'Hebdomadaire', montant: 5000,  gain: 500  },
    { id: 9,  datePaiement: '16/02/2026 07:40', conducteur: 'Traoré Moussa',            typeAbonnement: 'Journalier',   montant: 1000,  gain: 100  },
    { id: 10, datePaiement: '16/02/2026 12:10', conducteur: 'Koné Mamadou',             typeAbonnement: 'Mensuel',      montant: 15000, gain: 1500 },
  ];

  // ── Filtres ───────────────────────────────────────────────────────────────
  search      = '';
  filtre      = 'Tous';
  filtres     = ['Tous', 'Journalier', 'Hebdomadaire', 'Mensuel'];
  dateDebut   = '';   // format YYYY-MM-DD
  dateFin     = '';   // format YYYY-MM-DD

  // ── Pagination ────────────────────────────────────────────────────────────
  pageSize    = 5;
  currentPage = 1;
  pageSizes   = [5, 10, 20];

  /** Parse 'DD/MM/YYYY HH:mm' → Date */
  private toDate(str: string): Date {
    const [d, m, y] = str.split(' ')[0].split('/');
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  get filtered(): Paiement[] {
    return this.allPaiements.filter(p => {
      const q = this.search.toLowerCase();
      const matchSearch = !q
        || p.conducteur.toLowerCase().includes(q)
        || p.datePaiement.includes(q)
        || p.typeAbonnement.toLowerCase().includes(q)
        || p.montant.toString().includes(q);

      const matchFiltre = this.filtre === 'Tous' || p.typeAbonnement === this.filtre;

      const pDate = this.toDate(p.datePaiement);
      let matchDate = true;
      if (this.dateDebut) {
        const [y, m, d] = this.dateDebut.split('-');
        matchDate = pDate >= new Date(Number(y), Number(m) - 1, Number(d));
      }
      if (matchDate && this.dateFin) {
        const [y, m, d] = this.dateFin.split('-');
        matchDate = pDate <= new Date(Number(y), Number(m) - 1, Number(d));
      }

      return matchSearch && matchFiltre && matchDate;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedPaiements(): Paiement[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  onRangeChange(r: DateRange): void {
    this.dateDebut = r.debut;
    this.dateFin   = r.fin;
    this.currentPage = 1;
  }

  onSearchChange(): void   { this.currentPage = 1; }
  onFiltreChange(): void   { this.currentPage = 1; }
  onPageSizeChange(): void { this.currentPage = 1; }
  clearDates(): void {
    this.dateDebut   = '';
    this.dateFin     = '';
    this.currentPage = 1;
  }

  get totalJournalier(): number  { return this.allPaiements.filter(p => p.typeAbonnement === 'Journalier').length; }
  get totalHebdomadaire(): number { return this.allPaiements.filter(p => p.typeAbonnement === 'Hebdomadaire').length; }
  get totalMensuel(): number     { return this.allPaiements.filter(p => p.typeAbonnement === 'Mensuel').length; }
  get cumulGain(): number        { return this.allPaiements.reduce((sum, p) => sum + p.gain, 0); }
}
