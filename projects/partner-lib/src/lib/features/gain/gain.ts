import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../shared/stat-card/stat-card';
import { TableCardComponent } from '../../shared/table-card/table-card';
import { ExportService } from '../../services/export.service';
import { AbonnementService } from '../../services/abonnement.service';
import { DateRangePickerComponent, DateRange } from '../../shared/date-range-picker/date-range-picker';
import { Gain } from '../../models/gain.model';

@Component({
  selector: 'lib-gain',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, TableCardComponent, DateRangePickerComponent],
  templateUrl: './gain.html',
  styleUrls: ['./gain.scss'],
})
export class GainComponent implements OnInit {

  constructor(
    private exportSvc: ExportService,
    private abonnementSvc: AbonnementService,
  ) {}

  isLoading = true;
  errorMsg  = '';

  private allGains: Gain[] = [];

  gainsTotaux        = 0;
  nombreTransactions = 0;

  ngOnInit(): void {
    this.abonnementSvc.getAll().subscribe({
      next: (data) => {
        this.allGains           = data.gains;
        this.gainsTotaux        = data.cumul;
        this.nombreTransactions = data.gains.length;
        this.isLoading          = false;
      },
      error: () => {
        this.errorMsg  = 'Impossible de charger les gains.';
        this.isLoading = false;
      },
    });
  }

  exportToExcel(): void {
    const rows = this.filtered.map(g => ({
      'Date':           g.date,
      'Référence':      g.source,
      'Montant (FCFA)': g.montant,
      'Statut':         g.statut,
    }));
    this.exportSvc.exportToExcel(rows, 'Débit_Gains', 'Débit Gains');
  }

  // ── Filtres ───────────────────────────────────────────────────────────────
  search    = '';
  dateDebut = '';
  dateFin   = '';

  // ── Pagination ────────────────────────────────────────────────────────────
  pageSize    = 5;
  currentPage = 1;
  pageSizes   = [5, 10, 20];

  private toDate(str: string): Date {
    const parts = str.split(' ')[0].split('/');
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }

  get filtered(): Gain[] {
    return this.allGains.filter(g => {
      const q = this.search.toLowerCase();
      const matchSearch = !q
        || g.source.toLowerCase().includes(q)
        || g.montant.toString().includes(q)
        || g.date.includes(q);

      const gDate = this.toDate(g.date);
      let matchDate = true;
      if (this.dateDebut) {
        const [y, m, d] = this.dateDebut.split('-');
        matchDate = gDate >= new Date(Number(y), Number(m) - 1, Number(d));
      }
      if (matchDate && this.dateFin) {
        const [y, m, d] = this.dateFin.split('-');
        matchDate = gDate <= new Date(Number(y), Number(m) - 1, Number(d));
      }

      return matchSearch && matchDate;
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

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  onRangeChange(r: DateRange): void {
    this.dateDebut   = r.debut;
    this.dateFin     = r.fin;
    this.currentPage = 1;
  }

  onSearchChange(): void   { this.currentPage = 1; }
  onPageSizeChange(): void { this.currentPage = 1; }
}
