import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent {
  admin = {
    name: 'Ruth-Eunice',
    role: 'Administrateur Partenaire',
    email: 'ruth.eunice@e-sphere.com',
    phone: '+225 07 12 34 56 78',
    location: "Abidjan, Côte d'Ivoire",
    joinDate: 'Janvier 2024',
    status: 'Actif',
  };

  isEditing = false;
  draft = { ...this.admin };
  saveSuccess = false;

  startEdit(): void {
    this.draft = { ...this.admin };
    this.isEditing = true;
    this.saveSuccess = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    this.admin = { ...this.draft };
    this.isEditing = false;
    this.saveSuccess = true;
    setTimeout(() => (this.saveSuccess = false), 3000);
  }
}
