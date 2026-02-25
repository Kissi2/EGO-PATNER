import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarStateService } from '../../services/sidebar-state.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lib-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class TopbarComponent {
  currentDate = new Date();

  readonly userName = computed(() => {
    const u = this.authService.currentUser();
    if (!u) return '';
    return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username || '';
  });

  readonly userRole = computed(() => this.authService.currentUser()?.role ?? '');

  constructor(
    private router: Router,
    public sidebarState: SidebarStateService,
    private authService: AuthService,
  ) {}

  goToProfile(): void {
    this.router.navigate(['/profil']);
  }
}
