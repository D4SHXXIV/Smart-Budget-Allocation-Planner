import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardComponent } from '../summary-card/summary-card.component';
import { ValidationAlertComponent } from '../validation-alert/validation-alert.component';

@Component({
  selector: 'app-budget-summary',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent, ValidationAlertComponent],
  templateUrl: './budget-summary.component.html',
  styleUrl: './budget-summary.component.css'
})
export class BudgetSummaryComponent {
  @Input() totalBudget: number = 0;
  @Input() totalPercentage: number = 0;
  @Input() totalAllocated: number = 0;
  @Input() totalSubItemAmount: number = 0;
  @Input() unallocatedBudget: number = 0;
  @Input() remainingDetailBudget: number = 0;
  @Input() hasCategories: boolean = false;
  @Input() isBudgetValid: boolean = false;
  @Input() budgetStatus: string = '';
  @Input() hasOverAllocatedCategory: boolean = false;
  @Input() showSummaryPanel: boolean = true;

  get alertStatus(): 'success' | 'warning' | 'error' | 'info' {
    if (!this.hasCategories) return 'info';
    if (this.isBudgetValid) return 'success';
    if (this.hasOverAllocatedCategory || this.totalPercentage > 100) return 'error';
    return 'warning';
  }
}

