import { Component, OnDestroy, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/stat-card/stat-card';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gainChart') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  stats: { label: string; value: string; unite?: string; icon: string; iconBg: string; iconColor: string }[] = [
    { label: 'Nombre de Conducteurs', value: '21',         icon: 'drive_eta',           iconBg: '#fff3ef', iconColor: '#F05A28' },
    { label: 'Abonnements Payés',     value: '16',         icon: 'card_membership',     iconBg: '#e8f5e9', iconColor: '#43A047' },
    { label: 'Cumul Gains',           value: '1 280 000',  icon: 'account_balance_wallet', iconBg: '#e3f2fd', iconColor: '#1E88E5', unite: 'FCFA' },
  ];

  private readonly months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  private readonly values = [180000, 220000, 195000, 310000, 280000, 350000, 290000, 400000, 380000, 420000, 460000, 500000];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    // Run outside Angular to avoid change detection overhead
    this.zone.runOutsideAngular(() => {
      setTimeout(() => this.buildChart(), 0);
    });
  }

  private buildChart(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    // ── Variable radius based on value (like the reference) ──────────────────
    const radiusFn = (context: any): number => {
      const v: number = context.parsed?.y ?? 0;
      if (v < 200000) return 6;
      if (v < 280000) return 8;
      if (v < 380000) return 10;
      if (v < 450000) return 12;
      return 14;
    };

    // ── Alternating circle / rect point style ─────────────────────────────────
    const styleFn = (context: any): 'circle' | 'rect' =>
      context.dataIndex % 2 === 0 ? 'circle' : 'rect';

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.months,
        datasets: [{
          label: 'Gains (FCFA)',
          data: this.values,
          fill: false,
          borderColor: '#F05A28',
          borderWidth: 2.5,
          tension: 0,                   // straight lines like the reference
          pointBackgroundColor: '#F05A28',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: radiusFn,
          pointHoverRadius: radiusFn,   // keep same size on hover
          pointStyle: styleFn as any,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            titleColor: '#fff',
            bodyColor: '#ddd',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (ctx) =>
                ' ' + (ctx.parsed.y as number).toLocaleString('fr-FR') + ' FCFA',
            },
          },
        },
        scales: {
          x: {
            grid: { color: '#efefef' },
            border: { display: false },
            ticks: {
              color: '#aaa',
              font: { size: 12, family: 'Inter, sans-serif' },
            },
          },
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: '#efefef' },
            ticks: {
              color: '#aaa',
              font: { size: 11, family: 'Inter, sans-serif' },
              callback: (v) => (Number(v) / 1000).toFixed(0) + 'k',
              maxTicksLimit: 7,
            },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
