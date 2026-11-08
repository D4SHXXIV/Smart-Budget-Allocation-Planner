import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-alert.component.html',
  styleUrl: './validation-alert.component.css'
})
export class ValidationAlertComponent {
  @Input() status: 'success' | 'warning' | 'error' | 'info' = 'info';
  @Input() message: string = '';
}

