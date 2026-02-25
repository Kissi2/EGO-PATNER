import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Partenaire } from '../../models/auth.model';

@Component({
  selector: 'lib-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent implements OnInit {
  isLoading   = false;
  isEditing   = false;
  isSaving    = false;
  saveSuccess = false;
  saveError   = '';

  draft: Partenaire = {};

  readonly user = computed(() => this.authService.currentUser());

  readonly fullName = computed(() => {
    const u = this.authService.currentUser();
    if (!u) return '';
    return [u.firstName, u.lastName].filter(Boolean).join(' ');
  });

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.currentUser()) {
      this.isLoading = true;
      this.authService.getMe().subscribe({ complete: () => (this.isLoading = false) });
    }
  }

  startEdit(): void {
    this.draft       = { ...this.authService.currentUser() };
    this.isEditing   = true;
    this.saveSuccess = false;
    this.saveError   = '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.saveError = '';
  }

  saveEdit(): void {
    if (this.isSaving) return;
    this.isSaving  = true;
    this.saveError = '';

    this.authService.updateProfile({
      nom:       String(this.draft.firstName ?? ''),
      prenom:    String(this.draft.lastName  ?? ''),
      email:     String(this.draft.email     ?? ''),
      telephone: String(this.draft.phone     ?? ''),
    }).subscribe({
      next: () => {
        this.isSaving    = false;
        this.isEditing   = false;
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: () => {
        this.isSaving  = false;
        this.saveError = 'Erreur lors de la mise à jour. Veuillez réessayer.';
      },
    });
  }
}
