import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * BudgetHeaderComponent
 * Header bar modern berstandar dashboard UI Snow / ByeWind
 */
@Component({
  selector: 'app-budget-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-header.component.html',
  styleUrl: './budget-header.component.css',
})
export class BudgetHeaderComponent {
  @Input() alertCount: number = 0;
  @Input() isBudgetValid: boolean = false;
  @Input() currentSection: string = 'Overview';
}
