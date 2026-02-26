import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLinkActive } from '@angular/router';
import { SidebarStateService } from '../../services/sidebar-state.service';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  constructor(private router: Router, public sidebarState: SidebarStateService) {}

  showLogoutModal = false;

  admin = {
    name: 'Administrateur ',
    role: 'Partenaire',
  };

  navItems = [
    { label: 'Tableau de Bord',      icon: 'dashboard',              route: '/dashboard' },
    { label: 'Conducteurs',           icon: 'drive_eta',              route: '/conducteur' },
    { label: 'Abonnements et gains',  icon: 'card_membership',        route: '/abonnement' },
    // { label: 'Débit gains',           icon: 'account_balance_wallet', route: '/gain' },
  ];

  goToProfile(): void {
    this.sidebarState.close();
    this.router.navigate(['/profil']);
  }

  closeOnMobile(): void {
    this.sidebarState.close();
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    this.sidebarState.close();
    this.router.navigate(['/login']);
  }
}
