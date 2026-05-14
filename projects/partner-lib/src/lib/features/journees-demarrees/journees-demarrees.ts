import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableCardComponent } from '../../shared/table-card/table-card';
import { ExportService } from '../../services/export.service';
import { ConducteurService } from '../../services/conducteur.service';
import { Driver } from '../../models/conducteur.model';

interface JourneeDemarree extends Driver {
  nbJournees: number;
}

@Component({
  selector: 'lib-journees-demarrees',
  standalone: true,
  imports: [CommonModule, FormsModule, TableCardComponent],
  templateUrl: './journees-demarrees.html',
  styleUrls: ['./journees-demarrees.scss'],
})
export class JourneesDemarreesComponent implements OnInit {

  constructor(
    private router: Router,
    private conducteurSvc: ConducteurService,
    private exportSvc: ExportService,
  ) {}

  isLoading = true;
  errorMsg  = '';

  readonly skelRows = [1, 2, 3, 4, 5];

  private allItems: JourneeDemarree[] = [];
  filteredItems: JourneeDemarree[] = [];

  today = new Date().toISOString().split('T')[0];
  dateDebut  = this.today;
  dateFin    = this.today;
  recurrence = 3;
  heuresMin  = 5;

  // Drawer
  selectedDriver: JourneeDemarree | null = null;
  zoomedPhoto: string | null = null;

  // Pagination
  pageSize    = 5;
  currentPage = 1;
  pageSizes   = [5, 10, 20];

  ngOnInit(): void {
    this.loadData();
  }

  goBack(): void {
    this.router.navigate(['/conducteur']);
  }

  private loadData(): void {
    this.isLoading = true;
    this.conducteurSvc.getAll().subscribe({
      next: (data) => {
        this.allItems = data
          .filter(d => d.journee === 'OUI')
          .map(d => ({ ...d, nbJournees: 1 }));
        this.filteredItems = [...this.allItems];
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg  = 'Impossible de charger les données.';
        this.isLoading = false;
      },
    });
  }

  rechercher(): void {
    this.currentPage = 1;
    this.filteredItems = [...this.allItems];
  }

  exportToExcel(): void {
    const rows = this.filteredItems.map(d => ({
      'Nom Complet':  d.nomComplet,
      'Téléphone':    d.telephone,
      'Genre':        d.genre,
      'Nb. Journées': d.nbJournees,
    }));
    this.exportSvc.exportToExcel(rows, 'Journées_Démarrées', 'Journées démarrées');
  }

  get totalCount(): number { return this.filteredItems.length; }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
  }

  get pageNumbers(): (number | null)[] {
    const total = this.totalPages;
    const cur   = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | null)[] = [];
    const addPage = (p: number) => { if (!pages.includes(p)) pages.push(p); };
    addPage(1);
    if (cur > 3) pages.push(null);
    for (let p = Math.max(2, cur - 2); p <= Math.min(total - 1, cur + 2); p++) addPage(p);
    if (cur < total - 2) pages.push(null);
    addPage(total);
    return pages;
  }

  get paginatedItems(): JourneeDemarree[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  onPageSizeChange(): void { this.currentPage = 1; }

  openDetail(driver: JourneeDemarree): void  { this.selectedDriver = driver; }
  closeDetail(): void                         { this.selectedDriver = null; }
  openZoom(src: string): void                 { this.zoomedPhoto = src; }
  closeZoom(): void                           { this.zoomedPhoto = null; }
}
