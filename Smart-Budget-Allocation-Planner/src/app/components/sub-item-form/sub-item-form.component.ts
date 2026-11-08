import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sub-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sub-item-form.component.html',
  styleUrl: './sub-item-form.component.css'
})
export class SubItemFormComponent {
  @Input() items!: FormArray;
  @Input() categoryIndex: number = 0;
  @Input() subTotal: number = 0;
  @Input() isOverAllocated: boolean = false;

  @Output() addRequested = new EventEmitter<number>();
  @Output() removeRequested = new EventEmitter<{ categoryIndex: number; itemIndex: number }>();

  trackBySubItem(index: number, item: any): string {
    return item.get('id')?.value || index.toString();
  }

  onAdd(): void {
    this.addRequested.emit(this.categoryIndex);
  }

  onRemove(itemIndex: number): void {
    this.removeRequested.emit({ categoryIndex: this.categoryIndex, itemIndex });
  }

  asFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }
}

