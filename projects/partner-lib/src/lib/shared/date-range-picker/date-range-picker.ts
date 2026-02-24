import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DateRange {
  debut: string;
  fin: string;
}

@Component({
  selector: 'lib-date-range-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-range-picker.html',
  styleUrls: ['./date-range-picker.scss'],
})
export class DateRangePickerComponent {
  @Input() dateDebut = '';
  @Input() dateFin   = '';
  @Output() rangeChange = new EventEmitter<DateRange>();

  open      = false;
  viewYear  = new Date().getFullYear();
  viewMonth = new Date().getMonth();
  hoverDate: Date | null = null;

  readonly HEADERS = ['lu', 'ma', 'me', 'je', 've', 'sa', 'di'];

  constructor(private el: ElementRef) {}

  get buttonLabel(): string {
    if (!this.dateDebut && !this.dateFin) return 'Toutes les dates';
    const fmt = (s: string) => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
    if (this.dateDebut && this.dateFin) return `${fmt(this.dateDebut)} → ${fmt(this.dateFin)}`;
    if (this.dateDebut) return `Dès le ${fmt(this.dateDebut)}`;
    return `Jusqu\'au ${fmt(this.dateFin)}`;
  }

  get panelTitle(): string {
    const s = new Date(this.viewYear, this.viewMonth, 1)
      .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  get calendarDays(): (Date | null)[] {
    const first = new Date(this.viewYear, this.viewMonth, 1);
    let offset = first.getDay() - 1;
    if (offset < 0) offset = 6;
    const total = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    const days: (Date | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= total; d++) {
      days.push(new Date(this.viewYear, this.viewMonth, d));
    }
    return days;
  }

  toggleOpen(): void { this.open = !this.open; }
  prevMonth():  void { if (this.viewMonth === 0)  { this.viewMonth = 11; this.viewYear--; } else this.viewMonth--; }
  nextMonth():  void { if (this.viewMonth === 11) { this.viewMonth = 0;  this.viewYear++; } else this.viewMonth++; }

  selectDay(day: Date): void {
    const iso = this.toISO(day);
    if (!this.dateDebut || (this.dateDebut && this.dateFin)) {
      this.dateDebut = iso;
      this.dateFin   = '';
      this.rangeChange.emit({ debut: iso, fin: '' });
    } else {
      const start = this.parseISO(this.dateDebut);
      if (day < start) {
        const swap    = this.dateDebut;
        this.dateDebut = iso;
        this.dateFin   = swap;
      } else {
        this.dateFin = iso;
      }
      this.rangeChange.emit({ debut: this.dateDebut, fin: this.dateFin });
      this.open = false;
    }
  }

  onHover(day: Date | null): void { this.hoverDate = day; }

  isStart(day: Date):   boolean { return !!this.dateDebut && this.toISO(day) === this.dateDebut; }
  isEnd(day: Date):     boolean { return !!this.dateFin   && this.toISO(day) === this.dateFin; }
  isToday(day: Date):   boolean { return this.toISO(day) === this.toISO(new Date()); }

  isInRange(day: Date): boolean {
    if (!this.dateDebut) return false;
    const start = this.parseISO(this.dateDebut);
    const endSrc = this.dateFin ? this.parseISO(this.dateFin) : this.hoverDate;
    if (!endSrc) return false;
    const [s, e] = start <= endSrc ? [start, endSrc] : [endSrc, start];
    return day > s && day < e;
  }

  clear(event?: MouseEvent): void {
    event?.stopPropagation();
    this.dateDebut = '';
    this.dateFin   = '';
    this.rangeChange.emit({ debut: '', fin: '' });
    this.open = false;
  }

  private toISO(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private parseISO(iso: string): Date {
    const [y, m, d] = iso.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(e: MouseEvent): void {
    if (this.open && !this.el.nativeElement.contains(e.target)) {
      this.open = false;
    }
  }
}
