import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableCardComponent } from '../../shared/table-card/table-card';
import { ExportService } from '../../shared/export.service';

export interface Vehicle {
  marque: string;
  modele: string;
  plaque: string;
}

export interface Driver {
  id: number;
  nomComplet: string;
  telephone: string;
  photo: string;
  statut: 'Actif' | 'Inactif';
  genre: 'Masculin' | 'Féminin';
  abonne: 'OUI' | 'NON';
  creeLe: string;
  permis: string;
  vehicules: Vehicle[];
}

@Component({
  selector: 'lib-conducteur',
  standalone: true,
  imports: [CommonModule, FormsModule, TableCardComponent],
  templateUrl: './conducteur.html',
  styleUrls: ['./conducteur.scss'],
})
export class ConducteurComponent {

  constructor(private exportSvc: ExportService) {}

  exportToExcel(): void {
    const rows = this.filtered.map(d => ({
      'Nom Complet':  d.nomComplet,
      'Téléphone':    d.telephone,
      'N° Permis':    d.permis,
      'Statut':       d.statut,
      'Genre':        d.genre,
      'Abonné':       d.abonne,
      'Créé le':      d.creeLe,
    }));
    this.exportSvc.exportToExcel(rows, 'Conducteurs', 'Conducteurs');
  }

  // ── Data ──────────────────────────────────────────────────────────────────
  private allDrivers: Driver[] = [
    {
      id: 1, nomComplet: 'Lucien Simpohi', telephone: '0102534068', photo: 'user.jpg',
      statut: 'Actif', genre: 'Masculin', abonne: 'NON', creeLe: 'Vendredi 20 Février 2026 12:53:14', permis: 'CI-2023-00142',
      vehicules: [
        { marque: 'Toyota', modele: 'Corolla', plaque: '4521 AB 01' },
      ],
    },
    {
      id: 2, nomComplet: 'KOUAMÉ INNOCENT Moto', telephone: '0759411735', photo: 'user.jpg',
      statut: 'Actif', genre: 'Masculin', abonne: 'OUI', creeLe: 'Lundi 16 Février 2026 09:10:00', permis: 'CI-2022-00389',
      vehicules: [
        { marque: 'Renault', modele: 'Logan', plaque: '0892 CD 05' },
        { marque: 'Toyota', modele: 'Yaris', plaque: '2341 EF 03' },
      ],
    },
    {
      id: 3, nomComplet: 'Gapea Israel Gbougnon', telephone: '0778402495', photo: 'user.jpg',
      statut: 'Actif', genre: 'Masculin', abonne: 'OUI', creeLe: 'Mardi 17 Février 2026 11:45:22', permis: 'CI-2021-00756',
      vehicules: [
        { marque: 'Honda', modele: 'Accord', plaque: '7823 GH 06' },
      ],
    },
    {
      id: 4, nomComplet: "N'doumi Hermann Djama", telephone: '0749703800', photo: 'user.jpg',
      statut: 'Actif', genre: 'Masculin', abonne: 'NON', creeLe: 'Mercredi 18 Février 2026 14:30:05', permis: 'CI-2024-00091',
      vehicules: [
        { marque: 'Hyundai', modele: 'Accent', plaque: '5512 IJ 02' },
      ],
    },
    {
      id: 5, nomComplet: "N'guessan Nicolas Assoua", telephone: '0757505156', photo: 'user.jpg',
      statut: 'Actif', genre: 'Masculin', abonne: 'OUI', creeLe: 'Jeudi 19 Février 2026 08:20:47', permis: 'CI-2020-01023',
      vehicules: [
        { marque: 'Toyota', modele: 'Camry', plaque: '3301 KL 04' },
        { marque: 'Peugeot', modele: '301', plaque: '8890 MN 07' },
      ],
    },
    {
      id: 6, nomComplet: 'Koné Mamadou', telephone: '0701020304', photo: 'user.jpg',
      statut: 'Inactif', genre: 'Masculin', abonne: 'NON', creeLe: 'Samedi 14 Février 2026 16:05:33', permis: 'CI-2019-00674',
      vehicules: [],
    },
    {
      id: 7, nomComplet: 'Diallo Ibrahim', telephone: '0506070809', photo: 'user.jpg',
      statut: 'Actif', genre: 'Masculin', abonne: 'NON', creeLe: 'Dimanche 15 Février 2026 10:00:00', permis: 'CI-2023-00510',
      vehicules: [
        { marque: 'Suzuki', modele: 'Swift', plaque: '1123 OP 01' },
      ],
    },
    {
      id: 8, nomComplet: 'Bamba Seydou', telephone: '0101020304', photo: 'user.jpg',
      statut: 'Inactif', genre: 'Masculin', abonne: 'NON', creeLe: 'Vendredi 13 Février 2026 13:22:18', permis: 'CI-2018-00288',
      vehicules: [],
    },
    {
      id: 9, nomComplet: 'Touré Adama', telephone: '0708091011', photo: 'user.jpg',
      statut: 'Actif', genre: 'Masculin', abonne: 'OUI', creeLe: 'Jeudi 12 Février 2026 07:55:41', permis: 'CI-2022-00847',
      vehicules: [
        { marque: 'Toyota', modele: 'HiAce', plaque: '6634 QR 03' },
        { marque: 'Mitsubishi', modele: 'L300', plaque: '9901 ST 02' },
      ],
    },
    {
      id: 10, nomComplet: 'Coulibaly Drissa', telephone: '0511121314', photo: 'user.jpg',
      statut: 'Actif', genre: 'Masculin', abonne: 'NON', creeLe: 'Mercredi 11 Février 2026 15:40:09', permis: 'CI-2021-00333',
      vehicules: [
        { marque: 'Kia', modele: 'Rio', plaque: '4456 UV 06' },
      ],
    },
    {
      id: 11, nomComplet: 'Traoré Moussa', telephone: '0712131415', photo: 'user.jpg',
      statut: 'Actif', genre: 'Masculin', abonne: 'OUI', creeLe: 'Mardi 10 Février 2026 11:11:11', permis: 'CI-2020-00965',
      vehicules: [
        { marque: 'Toyota', modele: 'Fortuner', plaque: '7712 WX 04' },
      ],
    },
    {
      id: 12, nomComplet: 'Ouattara Sekou', telephone: '0601020304', photo: 'user.jpg',
      statut: 'Inactif', genre: 'Masculin', abonne: 'NON', creeLe: 'Lundi 09 Février 2026 09:09:09', permis: 'CI-2017-00122',
      vehicules: [],
    },
  ];

  // ── Filters ───────────────────────────────────────────────────────────────
  search      = '';
  filtre      = 'Tous';
  filtres     = ['Tous', 'Actif', 'Inactif'];

  // ── Pagination ────────────────────────────────────────────────────────────
  pageSize    = 5;
  currentPage = 1;
  pageSizes   = [5, 10, 20];

  // ── Drawer ────────────────────────────────────────────────────────────────
  selectedDriver: Driver | null = null;

  openDetail(driver: Driver): void  { this.selectedDriver = driver; }
  closeDetail(): void               { this.selectedDriver = null;   }

  get filtered(): Driver[] {
    return this.allDrivers.filter(d => {
      const q = this.search.toLowerCase();
      const matchSearch = !q
        || d.nomComplet.toLowerCase().includes(q)
        || d.telephone.includes(q)
        || d.permis.toLowerCase().includes(q);
      const matchStatut = this.filtre === 'Tous' || d.statut === this.filtre;
      return matchSearch && matchStatut;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedDrivers(): Driver[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  onSearchChange(): void   { this.currentPage = 1; }
  onFiltreChange(): void   { this.currentPage = 1; }
  onPageSizeChange(): void { this.currentPage = 1; }
}
