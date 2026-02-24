import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  email        = '';
  password     = '';
  showPassword = false;
  loginError   = false;

  private readonly VALID_USERNAME = 'eunice';
  private readonly VALID_PASSWORD = '123456';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Lu depuis l'état de navigation si renvoyé depuis /redirect
    this.loginError = (history.state as { loginError?: boolean })?.loginError === true;
  }

  onSubmit(): void {
    const success = this.email === this.VALID_USERNAME && this.password === this.VALID_PASSWORD;
    this.router.navigate(['/redirect'], { state: { success } });
  }
}
