import { Component, OnDestroy, AfterViewInit, OnInit, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/stat-card/stat-card';
import { DashboardService } from '../../services/dashboard.service';
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
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gainChart') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  chartLoading = true;
  chartError   = false;

  statsLoading = true;
  statsError   = false;

  readonly skelBars = [48, 72, 55, 90, 63, 44, 80, 58, 76, 40, 88, 65];

  /** Données reçues avant que le canvas soit disponible */
  private pendingLabels: string[] = [];
  private pendingValues: number[] = [];
  private viewReady = false;

  stats: { label: string; value: string | null; unite?: string; icon: string; iconBg: string; iconColor: string }[] = [
    { label: 'Nombre de Conducteurs', value: null, icon: 'drive_eta',              iconBg: '#fff3ef', iconColor: '#F05A28' },
    { label: 'Abonnements Payés',     value: null, icon: 'card_membership',         iconBg: '#e8f5e9', iconColor: '#43A047' },
    { label: 'Cumul Gains',           value: null, icon: 'account_balance_wallet',  iconBg: '#e3f2fd', iconColor: '#1E88E5', unite: 'FCFA' },
  ];

  constructor(
    private zone: NgZone,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.statsLoading  = false;
        this.stats[0].value = data.conducteurs.toLocaleString('fr-FR');
        this.stats[1].value = data.abonnements.toLocaleString('fr-FR');
        this.stats[2].value = data.gains.toLocaleString('fr-FR');
      },
      error: () => {
        this.statsLoading = false;
        this.statsError   = true;
        this.stats.forEach(s => (s.value = '—'));
      },
    });

    this.dashboardService.getEvolutionGain().subscribe({
      next: ({ labels, values }) => {
        this.chartLoading = false;
        if (this.viewReady) {
          // Force Angular à rendre le <canvas> avant d'y accéder
          this.cdr.detectChanges();
          this.zone.runOutsideAngular(() => this.buildChart(labels, values));
        } else {
          // Canvas pas encore disponible : on mémorise
          this.pendingLabels = labels;
          this.pendingValues = values;
        }
      },
      error: () => {
        this.chartLoading = false;
        this.chartError   = true;
      },
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    // Si les données sont déjà arrivées, on construit le chart maintenant
    if (!this.chartLoading && !this.chartError && this.pendingLabels.length) {
      this.cdr.detectChanges();
      this.zone.runOutsideAngular(() =>
        this.buildChart(this.pendingLabels, this.pendingValues),
      );
    }
  }

  private buildChart(labels: string[], values: number[]): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const radiusFn = (context: any): number => {
      const v: number = context.parsed?.y ?? 0;
      if (v < 200000) return 6;
      if (v < 280000) return 8;
      if (v < 380000) return 10;
      if (v < 450000) return 12;
      return 14;
    };

    const styleFn = (context: any): 'circle' | 'rect' =>
      context.dataIndex % 2 === 0 ? 'circle' : 'rect';

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Gains (FCFA)',
          data: values,
          fill: false,
          borderColor: '#F05A28',
          borderWidth: 2.5,
          tension: 0.4,
          pointBackgroundColor: '#F05A28',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: radiusFn,
          pointHoverRadius: radiusFn,
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
            max: 900000,
            ticks: {
              stepSize: 100000,
              color: '#aaa',
              font: { size: 11, family: 'Inter, sans-serif' },
              callback: (v) => (Number(v) / 1000).toFixed(0) + 'k',
            },
            border: { display: false },
            grid: { color: '#efefef' },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
