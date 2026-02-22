import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarStateService } from '../../shared/sidebar-state.service';

@Component({
  selector: 'lib-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class TopbarComponent {
  currentDate = new Date();

  admin = {
    name: 'Ruth-Eunice',
    role: 'Partenaire',
  };

  constructor(private router: Router, public sidebarState: SidebarStateService) {}

  goToProfile(): void {
    this.router.navigate(['/profil']);
  }
}
