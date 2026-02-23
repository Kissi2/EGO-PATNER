import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../shared/stat-card/stat-card';
import { TableCardComponent } from '../../shared/table-card/table-card';
import { ExportService } from '../../shared/export.service';

export interface Gain {
  id: number;
  date: string;
  source: string;
  montant: number;
  moyenPaiement: 'Wave' | 'Chèque' | 'Compte bancaire';
  statut: 'Payé';
}

@Component({
  selector: 'lib-gain',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, TableCardComponent],
  templateUrl: './gain.html',
  styleUrls: ['./gain.scss'],
})
export class GainComponent {

  constructor(private exportSvc: ExportService) {}

  exportToExcel(): void {
    const rows = this.filtered.map(g => ({
      'Date':              g.date,
      'Référence':         g.source,
      'Montant (FCFA)':    g.montant,
      'Moyen de paiement': g.moyenPaiement,
      'Statut':            g.statut,
    }));
    this.exportSvc.exportToExcel(rows, 'Débit_Gains', 'Débit Gains');
  }

  private allGains: Gain[] = [
    { id: 1,  date: '20/02/2026 14:32', source: 'TXN-2026-00147', montant: 1500, moyenPaiement: 'Wave',            statut: 'Payé' },
    { id: 2,  date: '20/02/2026 09:15', source: 'TXN-2026-00146', montant: 500,  moyenPaiement: 'Chèque',          statut: 'Payé' },
    { id: 3,  date: '19/02/2026 16:45', source: 'TXN-2026-00143', montant: 100,  moyenPaiement: 'Compte bancaire', statut: 'Payé' },
    { id: 4,  date: '19/02/2026 11:20', source: 'TXN-2026-00141', montant: 1500, moyenPaiement: 'Wave',            statut: 'Payé' },
    { id: 5,  date: '18/02/2026 08:50', source: 'TXN-2026-00138', montant: 500,  moyenPaiement: 'Compte bancaire', statut: 'Payé' },
    { id: 6,  date: '18/02/2026 13:05', source: 'TXN-2026-00135', montant: 100,  moyenPaiement: 'Wave',            statut: 'Payé' },
    { id: 7,  date: '17/02/2026 10:30', source: 'TXN-2026-00129', montant: 1500, moyenPaiement: 'Chèque',          statut: 'Payé' },
    { id: 8,  date: '17/02/2026 15:55', source: 'TXN-2026-00126', montant: 500,  moyenPaiement: 'Wave',            statut: 'Payé' },
    { id: 9,  date: '16/02/2026 07:40', source: 'TXN-2026-00122', montant: 100,  moyenPaiement: 'Compte bancaire', statut: 'Payé' },
    { id: 10, date: '16/02/2026 12:10', source: 'TXN-2026-00118', montant: 1500, moyenPaiement: 'Wave',            statut: 'Payé' },
    { id: 11, date: '15/02/2026 09:25', source: 'TXN-2026-00114', montant: 500,  moyenPaiement: 'Chèque',          statut: 'Payé' },
    { id: 12, date: '15/02/2026 17:00', source: 'TXN-2026-00110', montant: 100,  moyenPaiement: 'Compte bancaire', statut: 'Payé' },
  ];

  // ── Filtres ───────────────────────────────────────────────────────────────
  search      = '';
  dateFiltre  = '';
  moyenFiltre = 'Tous';
  moyens      = ['Tous', 'Wave', 'Chèque', 'Compte bancaire'];

  // ── Pagination ────────────────────────────────────────────────────────────
  pageSize    = 5;
  currentPage = 1;
  pageSizes   = [5, 10, 20];

  get filtered(): Gain[] {
    return this.allGains.filter(g => {
      const q = this.search.toLowerCase();
      const matchSearch = !q
        || g.source.toLowerCase().includes(q)
        || g.montant.toString().includes(q)
        || g.date.includes(q)
        || g.moyenPaiement.toLowerCase().includes(q);
      const matchMoyen  = this.moyenFiltre === 'Tous' || g.moyenPaiement === this.moyenFiltre;
      let matchDate = true;
      if (this.dateFiltre) {
        const [y, m, d] = this.dateFiltre.split('-');
        matchDate = g.date === `${d}/${m}/${y}`;
      }
      return matchSearch && matchMoyen && matchDate;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedGains(): Gain[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get gainsTotaux(): number {
    return this.allGains.reduce((sum, g) => sum + g.montant, 0);
  }

  get gainsDuMois(): number {
    const moisActuel = '02/2026';
    return this.allGains
      .filter(g => g.date.slice(3) === moisActuel)
      .reduce((sum, g) => sum + g.montant, 0);
  }

  get nombreTransactions(): number {
    return this.allGains.length;
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  onSearchChange(): void   { this.currentPage = 1; }
  onDateChange(): void     { this.currentPage = 1; }
  onMoyenChange(): void    { this.currentPage = 1; }
  onPageSizeChange(): void { this.currentPage = 1; }
}
