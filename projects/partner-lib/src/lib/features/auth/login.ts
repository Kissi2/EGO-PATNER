import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit {
  email        = '';
  password     = '';
  showPassword = false;
  loginError   = false;
  isLoading    = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginError = (history.state as { loginError?: boolean })?.loginError === true;
  }

  onSubmit(): void {
    if (this.isLoading) return;
    this.loginError = false;
    this.isLoading  = true;

    this.authService
      .login(this.email, this.password)
      .pipe(switchMap(() => this.authService.getMe()))
      .subscribe({
        next: () => {
          this.router.navigate(['/redirect'], { state: { success: true } });
        },
        error: () => {
          this.isLoading  = false;
          this.loginError = true;
        },
      });
  }
}
