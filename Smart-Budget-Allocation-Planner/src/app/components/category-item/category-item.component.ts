import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { SubItemFormComponent } from '../sub-item-form/sub-item-form.component';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SubItemFormComponent],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.css'
})
export class CategoryItemComponent {
  @Input() categoryGroup!: FormGroup;
  @Input() categoryIndex: number = 0;
  @Input() categoryCount: number = 0;
  @Input() categoryAmount: number = 0;
  @Input() subTotal: number = 0;
  @Input() isOverAllocated: boolean = false;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false;

  @Output() removeCategoryRequested = new EventEmitter<number>();
  @Output() addSubItemRequested = new EventEmitter<number>();
  @Output() removeSubItemRequested = new EventEmitter<{ categoryIndex: number; itemIndex: number }>();
  @Output() moveUpRequested = new EventEmitter<number>();
  @Output() moveDownRequested = new EventEmitter<number>();

  get items(): FormArray {
    return this.categoryGroup.get('items') as FormArray;
  }

  onRemoveCategory(): void {
    this.removeCategoryRequested.emit(this.categoryIndex);
  }

  onMoveUp(): void {
    this.moveUpRequested.emit(this.categoryIndex);
  }

  onMoveDown(): void {
    this.moveDownRequested.emit(this.categoryIndex);
  }

  onAddSubItem(catIndex: number): void {
    this.addSubItemRequested.emit(catIndex);
  }

  onRemoveSubItem(event: { categoryIndex: number; itemIndex: number }): void {
    this.removeSubItemRequested.emit(event);
  }
}

