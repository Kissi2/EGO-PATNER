import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrls: ['./stat-card.scss'],
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number | null = '';
  @Input() unite?: string;
  @Input() icon = '';
  @Input() iconBg = '#fff3ef';
  @Input() iconColor = '#F05A28';
}
