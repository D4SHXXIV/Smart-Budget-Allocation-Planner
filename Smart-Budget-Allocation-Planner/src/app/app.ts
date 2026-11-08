import { Component } from '@angular/core';
import { BudgetComponent } from './components/budget/budget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BudgetComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'Smart Budget Allocation Planner';
}
