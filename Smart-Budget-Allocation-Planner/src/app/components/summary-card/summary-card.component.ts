import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.css'
})
export class SummaryCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle?: string;
  @Input() variant: 'default' | 'lavender' | 'blue' | 'mint' | 'peach' | 'success' | 'warning' | 'danger' = 'default';
  @Input() trend?: string;
  @Input() isPositive?: boolean = true;
}
