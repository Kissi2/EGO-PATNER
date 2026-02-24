import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-redirect',
  standalone: true,
  imports: [],
  templateUrl: './redirect.html',
  styleUrls: ['./redirect.scss'],
})
export class RedirectComponent implements OnInit {
  private success = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.success = (history.state as { success?: boolean })?.success === true;

    setTimeout(() => {
      if (this.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login'], { state: { loginError: true } });
      }
    }, 3800);
  }
}
