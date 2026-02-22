import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email        = '';
  password     = '';
  showPassword = false;
  showSplash   = false;
  loginError   = false;

  private readonly VALID_USERNAME = 'Ruth-Eunice';
  private readonly VALID_PASSWORD = '12345678';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.email === this.VALID_USERNAME && this.password === this.VALID_PASSWORD) {
      this.loginError = false;
      this.showSplash = true;
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2500);
    } else {
      this.loginError = true;
    }
  }
}
