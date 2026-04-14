import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableCardComponent } from '../../shared/table-card/table-card';
import { StatCardComponent } from '../../shared/stat-card/stat-card';
import { ExportService } from '../../services/export.service';
import { ConducteurService } from '../../services/conducteur.service';
import { Driver } from '../../models/conducteur.model';

@Component({
  selector: 'lib-conducteur',
  standalone: true,
  imports: [CommonModule, FormsModule, TableCardComponent, StatCardComponent],
  templateUrl: './conducteur.html',
  styleUrls: ['./conducteur.scss'],
})
export class ConducteurComponent implements OnInit {

  constructor(
    private exportSvc: ExportService,
    private conducteurSvc: ConducteurService,
  ) {}

  isLoading = true;
  errorMsg  = '';

  readonly skelRows = [1, 2, 3, 4, 5];

  private allDrivers: Driver[] = [];

  ngOnInit(): void {
    this.conducteurSvc.getAll().subscribe({
      next: (data) => {
        this.allDrivers = data;
        this.isLoading  = false;
      },
      error: () => {
        this.errorMsg  = 'Impossible de charger les conducteurs.';
        this.isLoading = false;
      },
    });
  }

  exportToExcel(): void {
    const rows = this.filtered.map(d => ({
      'Nom Complet':  d.nomComplet,
      'Téléphone':    d.telephone,
      'N° Permis':    d.permis,
      'Statut':       d.statut,
      'Journée':      d.journee,
      'Genre':        d.genre,
      'Abonné':       d.abonne,
      'Créé le':      d.creeLe,
    }));
    this.exportSvc.exportToExcel(rows, 'Conducteurs', 'Conducteurs');
  }

  // ── Filters ───────────────────────────────────────────────────────────────
  search         = '';
  filtre         = 'Tous';
  filtres        = ['Tous', 'Actif', 'Inactif'];
  filtreJournee  = 'Tous';
  filtresJournee = ['Tous', 'OUI', 'NON'];

  // ── Pagination ────────────────────────────────────────────────────────────
  pageSize    = 5;
  currentPage = 1;
  pageSizes   = [5, 10, 20];

  // ── Drawer ────────────────────────────────────────────────────────────────
  selectedDriver: Driver | null = null;

  openDetail(driver: Driver): void  { this.selectedDriver = driver; }
  closeDetail(): void               { this.selectedDriver = null;   }

  // ── Zoom photo ────────────────────────────────────────────────────────────
  zoomedPhoto: string | null = null;

  openZoom(src: string): void  { this.zoomedPhoto = src; }
  closeZoom(): void            { this.zoomedPhoto = null; }

  get totalConducteurs(): number {
    return this.allDrivers.length;
  }

  get totalJourneeDemare(): number {
    return this.allDrivers.filter(d => d.journee === 'OUI').length;
  }

  get totalJourneeNonDemare(): number {
    return this.allDrivers.filter(d => d.journee === 'NON').length;
  }

  get filtered(): Driver[] {
    return this.allDrivers.filter(d => {
      const q = this.search.toLowerCase();
      const matchSearch = !q
        || d.nomComplet.toLowerCase().includes(q)
        || d.telephone.includes(q)
        || d.permis.toLowerCase().includes(q);
      const matchStatut   = this.filtre === 'Tous' || d.statut === this.filtre;
      const matchJournee  = this.filtreJournee === 'Tous' || d.journee === this.filtreJournee;
      return matchSearch && matchStatut && matchJournee;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get pageNumbers(): (number | null)[] {
    const total = this.totalPages;
    const cur   = this.currentPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | null)[] = [];
    const addPage = (p: number) => { if (!pages.includes(p)) pages.push(p); };
    addPage(1);
    if (cur > 3) pages.push(null);
    for (let p = Math.max(2, cur - 2); p <= Math.min(total - 1, cur + 2); p++) addPage(p);
    if (cur < total - 2) pages.push(null);
    addPage(total);
    return pages;
  }

  get paginatedDrivers(): Driver[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  onSearchChange(): void        { this.currentPage = 1; }
  onFiltreChange(): void        { this.currentPage = 1; }
  onFiltreJourneeChange(): void { this.currentPage = 1; }
  onPageSizeChange(): void      { this.currentPage = 1; }
}
