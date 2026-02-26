import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../shared/stat-card/stat-card';
import { TableCardComponent } from '../../shared/table-card/table-card';
import { ExportService } from '../../services/export.service';
import { AbonnementService } from '../../services/abonnement.service';
import { DateRangePickerComponent, DateRange } from '../../shared/date-range-picker/date-range-picker';
import { Paiement } from '../../models/abonnement.model';

@Component({
  selector: 'lib-abonnement',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, TableCardComponent, DateRangePickerComponent],
  templateUrl: './abonnement.html',
  styleUrls: ['./abonnement.scss'],
})
export class AbonnementComponent implements OnInit {

  constructor(
    private exportSvc: ExportService,
    private abonnementSvc: AbonnementService,
  ) {}

  isLoading = true;
  errorMsg  = '';

  private allPaiements: Paiement[] = [];

  // ── Valeurs brutes API ────────────────────────────────────────────────────
  private _totalJournalier   = 0;
  private _totalHebdomadaire = 0;
  private _totalMensuel      = 0;
  private _cumulGain         = 0;

  // ── Filtre période ────────────────────────────────────────────────────────
  periodeFiltre = 'all';
  periodes = [
    { label: 'Tout',          value: 'all'   },
    { label: "Aujourd'hui",   value: 'today' },
    { label: 'Cette semaine', value: 'week'  },
    { label: 'Ce mois',       value: 'month' },
    { label: 'Cette année',   value: 'year'  },
  ];

  // ── Stats calculées selon la période ─────────────────────────────────────
  get totalJournalier(): number {
    if (this.periodeFiltre === 'all') return this._totalJournalier;
    return this.periodePaiements.filter(p => p.typeAbonnement === 'Journalier').length;
  }

  get totalHebdomadaire(): number {
    if (this.periodeFiltre === 'all') return this._totalHebdomadaire;
    return this.periodePaiements.filter(p => p.typeAbonnement === 'Hebdomadaire').length;
  }

  get totalMensuel(): number {
    if (this.periodeFiltre === 'all') return this._totalMensuel;
    return this.periodePaiements.filter(p => p.typeAbonnement === 'Mensuel').length;
  }

  get cumulGain(): number {
    if (this.periodeFiltre === 'all') return this._cumulGain;
    return this.periodePaiements.reduce((sum, p) => sum + p.gain, 0);
  }

  ngOnInit(): void {
    this.abonnementSvc.getAll().subscribe({
      next: (data) => {
        this.allPaiements        = data.paiements;
        this._totalJournalier   = data.totalJournalier;
        this._totalHebdomadaire = data.totalHebdomadaire;
        this._totalMensuel      = data.totalMensuel;
        this._cumulGain         = data.cumul;
        this.isLoading          = false;
      },
      error: () => {
        this.errorMsg  = 'Impossible de charger les abonnements.';
        this.isLoading = false;
      },
    });
  }

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

  // ── Filtres tableau ───────────────────────────────────────────────────────
  search    = '';
  filtre    = 'Tous';
  filtres   = ['Tous', 'Journalier', 'Hebdomadaire', 'Mensuel'];
  dateDebut = '';
  dateFin   = '';

  // ── Pagination ────────────────────────────────────────────────────────────
  pageSize    = 5;
  currentPage = 1;
  pageSizes   = [5, 10, 20];

  private toDate(str: string): Date {
    const parts = str.split(' ')[0].replace(',', '').split('/');
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }

  /** Paiements filtrés par la période sélectionnée dans le header */
  private get periodePaiements(): Paiement[] {
    if (this.periodeFiltre === 'all') return this.allPaiements;

    const now        = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let from: Date;

    switch (this.periodeFiltre) {
      case 'today':
        from = todayStart;
        break;
      case 'week': {
        const day = now.getDay() === 0 ? 7 : now.getDay();
        from = new Date(todayStart);
        from.setDate(todayStart.getDate() - day + 1);
        break;
      }
      case 'month':
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        from = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return this.allPaiements;
    }

    return this.allPaiements.filter(p => {
      const d = this.toDate(p.datePaiement);
      return d >= from && d <= todayEnd;
    });
  }

  /** Paiements filtrés par période + recherche + type + plage de dates */
  get filtered(): Paiement[] {
    return this.periodePaiements.filter(p => {
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

  onPeriodeChange(): void  { this.currentPage = 1; }
  onRangeChange(r: DateRange): void {
    this.dateDebut   = r.debut;
    this.dateFin     = r.fin;
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
}
