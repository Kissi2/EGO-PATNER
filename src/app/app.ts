import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../projects/partner-lib/src/lib/features/sidebar/sidebar';
import { TopbarComponent } from '../../projects/partner-lib/src/lib/features/topbar/topbar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isLoginPage = e.urlAfterRedirects.startsWith('/login')
                        || e.urlAfterRedirects.startsWith('/redirect');
      });
  }
}
