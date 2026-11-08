import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { CategoryItemComponent } from '../category-item/category-item.component';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CategoryItemComponent],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css'
})
export class BudgetFormComponent {
  @Input() budgetForm!: FormGroup;
  @Input() categories!: FormArray;
  @Input() totalBudget: number = 0;
  @Input() getCategoryAmountFn!: (index: number) => number;
  @Input() getSubTotalFn!: (catIndex: number) => number;
  @Input() getIsOverAllocatedFn!: (catIndex: number) => boolean;

  @Output() addCategoryRequested = new EventEmitter<void>();
  @Output() removeCategoryRequested = new EventEmitter<number>();
  @Output() addSubItemRequested = new EventEmitter<number>();
  @Output() removeSubItemRequested = new EventEmitter<{ categoryIndex: number; itemIndex: number }>();
  @Output() moveCategoryUpRequested = new EventEmitter<number>();
  @Output() moveCategoryDownRequested = new EventEmitter<number>();

  trackByCategory(index: number, category: any): string {
    return category.get('id')?.value || index.toString();
  }

  asFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  onAddCategory(): void {
    this.addCategoryRequested.emit();
  }

  onRemoveCategory(index: number): void {
    this.removeCategoryRequested.emit(index);
  }

  onMoveUp(index: number): void {
    this.moveCategoryUpRequested.emit(index);
  }

  onMoveDown(index: number): void {
    this.moveCategoryDownRequested.emit(index);
  }

  onAddSubItem(catIndex: number): void {
    this.addSubItemRequested.emit(catIndex);
  }

  onRemoveSubItem(event: { categoryIndex: number; itemIndex: number }): void {
    this.removeSubItemRequested.emit(event);
  }

  getCategoryAmount(index: number): number {
    return this.getCategoryAmountFn ? this.getCategoryAmountFn(index) : 0;
  }

  getSubTotal(catIndex: number): number {
    return this.getSubTotalFn ? this.getSubTotalFn(catIndex) : 0;
  }

  isOverAllocated(catIndex: number): boolean {
    return this.getIsOverAllocatedFn ? this.getIsOverAllocatedFn(catIndex) : false;
  }
}

