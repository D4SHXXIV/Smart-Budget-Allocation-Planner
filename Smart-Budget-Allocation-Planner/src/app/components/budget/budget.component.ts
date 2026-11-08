import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { BudgetHeaderComponent } from '../budget-header/budget-header.component';
import { BudgetFormComponent } from '../budget-form/budget-form.component';
import { BudgetSummaryComponent } from '../budget-summary/budget-summary.component';
import { SummaryCardComponent } from '../summary-card/summary-card.component';

/**
 * BudgetComponent
 * Controller utama aplikasi Smart Budget Allocation Planner (SBAP).
 * Menyimpan seluruh state FormArray di memori (in-memory) dan mengelola seluruh logika bisnis.
 * Seluruh nama method & property selaras 100% dengan PRD & Sequence Diagram SD-01, SD-02, SD-03.
 */
@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BudgetHeaderComponent,
    BudgetFormComponent,
    BudgetSummaryComponent,
    SummaryCardComponent
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
})
export class BudgetComponent implements OnInit {
  budgetForm!: FormGroup;
  showSummaryPanel: boolean = true;
  activeNavTab: string = 'overview';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createBudgetForm();

    // Subscribe ke valueChanges untuk kalkulasi dan validasi real-time
    this.budgetForm.valueChanges.subscribe(() => {
      this.validateCategories();
      this.validateAllSubItems();
    });

    // Validasi awal
    this.validateCategories();
    this.validateAllSubItems();
  }

  // ==========================================
  // Inisialisasi Form Model (In-Memory)
  // ==========================================
  createBudgetForm(): void {
    this.budgetForm = this.fb.group({
      totalBudget: [10000000, [Validators.required, Validators.min(1)]],
      categories: this.fb.array([], [
        this.minArrayLengthValidator(2),
        this.maxArrayLengthValidator(10),
      ])
    });

    // Inisialisasi dengan 2 kategori awal (sesuai aturan batas min. 2 kategori)
    this.categories.push(this.createCategory('Pendidikan', 40));
    this.categories.push(this.createCategory('Operasional', 35));

    // Tambah contoh sub-item awal untuk demonstrasi
    const cat0Items = this.getSubItems(0);
    cat0Items.push(this.createSubItem('Buku & Modul', 1000000));
    cat0Items.push(this.createSubItem('Uang Kuliah', 2500000));
  }

  // ==========================================
  // Factory Methods untuk FormGroup
  // ==========================================
  createCategory(name: string = '', percentage: number | null = null): FormGroup {
    return this.fb.group({
      id: [this.generateUniqueId('cat')],
      name: [name, [Validators.required]],
      percentage: [percentage, [Validators.required, Validators.min(1), Validators.max(100)]],
      items: this.fb.array([])
    });
  }

  createSubItem(name: string = '', amount: number | null = null): FormGroup {
    return this.fb.group({
      id: [this.generateUniqueId('item')],
      name: [name, [Validators.required]],
      amount: [amount, [Validators.required, Validators.min(1)]]
    });
  }

  private generateUniqueId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  // ==========================================
  // Operasi Kategori (UC-01)
  // ==========================================
  get categories(): FormArray {
    return this.budgetForm.get('categories') as FormArray;
  }

  addCategory(): void {
    if (this.categories.length < 10) {
      this.categories.push(this.createCategory());
      this.validateCategories();
    }
  }

  removeCategory(index: number): void {
    if (index >= 0 && index < this.categories.length && this.categories.length > 2) {
      this.categories.removeAt(index);
      this.validateCategories();
      this.validateAllSubItems();
    }
  }

  moveCategoryUp(index: number): void {
    if (index > 0 && index < this.categories.length) {
      const currentControl = this.categories.at(index);
      this.categories.removeAt(index);
      this.categories.insert(index - 1, currentControl);
      this.validateCategories();
    }
  }

  moveCategoryDown(index: number): void {
    if (index >= 0 && index < this.categories.length - 1) {
      const currentControl = this.categories.at(index);
      this.categories.removeAt(index);
      this.categories.insert(index + 1, currentControl);
      this.validateCategories();
    }
  }

  // ==========================================
  // Operasi Sub-item (UC-02)
  // ==========================================
  getSubItems(categoryIndex: number): FormArray {
    const category = this.categories.at(categoryIndex) as FormGroup;
    return category?.get('items') as FormArray;
  }

  addSubItem(categoryIndex: number): void {
    const items = this.getSubItems(categoryIndex);
    if (items) {
      items.push(this.createSubItem());
      this.validateSubItems(categoryIndex);
    }
  }

  removeSubItem(categoryIndex: number, itemIndex: number): void {
    const items = this.getSubItems(categoryIndex);
    if (items && itemIndex >= 0 && itemIndex < items.length) {
      items.removeAt(itemIndex);
      this.validateSubItems(categoryIndex);
    }
  }

  // ==========================================
  // Validasi Lintas Baris (Cross-Item Validation)
  // ==========================================
  validateCategories(): void {
    const names = new Set<string>();
    let hasDuplicate = false;

    // Periksa duplikasi nama kategori (case-insensitive & trimmed)
    for (let i = 0; i < this.categories.length; i++) {
      const cat = this.categories.at(i) as FormGroup;
      const rawName = cat.get('name')?.value || '';
      const cleanName = rawName.trim().toLowerCase();

      if (cleanName.length > 0) {
        if (names.has(cleanName)) {
          hasDuplicate = true;
          cat.get('name')?.setErrors({ duplicate: true });
        } else {
          names.add(cleanName);
          if (cat.get('name')?.hasError('duplicate')) {
            const currentErrors = { ...cat.get('name')?.errors };
            delete currentErrors['duplicate'];
            cat.get('name')?.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
          }
        }
      }
    }

    if (hasDuplicate) {
      this.categories.setErrors({ ...this.categories.errors, duplicateCategory: true });
    } else if (this.categories.hasError('duplicateCategory')) {
      const errs = { ...this.categories.errors };
      delete errs['duplicateCategory'];
      this.categories.setErrors(Object.keys(errs).length > 0 ? errs : null);
    }

    // Validasi akumulasi persentase = 100%
    const totalPct = this.totalPercentage;
    if (Math.abs(totalPct - 100) > 0.000001) {
      this.categories.setErrors({
        ...this.categories.errors,
        invalidPercentageTotal: { actual: totalPct, expected: 100 }
      });
    } else if (this.categories.hasError('invalidPercentageTotal')) {
      const errs = { ...this.categories.errors };
      delete errs['invalidPercentageTotal'];
      this.categories.setErrors(Object.keys(errs).length > 0 ? errs : null);
    }
  }

  validateSubItems(categoryIndex: number): void {
    const items = this.getSubItems(categoryIndex);
    if (!items) return;

    const names = new Set<string>();

    for (let j = 0; j < items.length; j++) {
      const item = items.at(j) as FormGroup;
      const rawName = item.get('name')?.value || '';
      const cleanName = rawName.trim().toLowerCase();

      if (cleanName.length > 0) {
        if (names.has(cleanName)) {
          item.get('name')?.setErrors({ duplicate: true });
        } else {
          names.add(cleanName);
          if (item.get('name')?.hasError('duplicate')) {
            const currentErrors = { ...item.get('name')?.errors };
            delete currentErrors['duplicate'];
            item.get('name')?.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
          }
        }
      }
    }
  }

  validateAllSubItems(): void {
    for (let i = 0; i < this.categories.length; i++) {
      this.validateSubItems(i);
    }
  }

  private minArrayLengthValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const array = control as FormArray;
      return array && array.length < min ? { minCategories: { required: min, actual: array.length } } : null;
    };
  }

  private maxArrayLengthValidator(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const array = control as FormArray;
      return array && array.length > max ? { maxCategories: { required: max, actual: array.length } } : null;
    };
  }

  // ==========================================
  // Kalkulasi Otomatis (UC-05, UC-06, UC-07)
  // ==========================================
  calculateCategoryAmount(index: number): number {
    const category = this.categories.at(index);
    if (!category) return 0;
    const percentage = Number(category.get('percentage')?.value) || 0;
    const total = this.totalBudget;
    return Math.round((percentage / 100) * total);
  }

  calculateSubTotal(categoryIndex: number): number {
    const items = this.getSubItems(categoryIndex);
    if (!items) return 0;
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      const val = Number(items.at(i).get('amount')?.value) || 0;
      sum += val;
    }
    return sum;
  }

  isOverAllocated(categoryIndex: number): boolean {
    const subTotal = this.calculateSubTotal(categoryIndex);
    const categoryAmount = this.calculateCategoryAmount(categoryIndex);
    return subTotal > categoryAmount;
  }

  showSummary(): void {
    this.showSummaryPanel = true;
  }

  // ==========================================
  // Sidebar Interactive Navigation & Tabs
  // ==========================================
  get totalSubItemCount(): number {
    if (!this.categories) return 0;
    let count = 0;
    for (let i = 0; i < this.categories.length; i++) {
      const items = this.getSubItems(i);
      if (items) count += items.length;
    }
    return count;
  }

  get currentBreadcrumbSection(): string {
    switch (this.activeNavTab) {
      case 'alokasi': return 'Alokasi Anggaran';
      case 'rincian': return 'Rincian Sub-item';
      case 'ringkasan': return 'Ringkasan & Monitoring';
      default: return 'Overview';
    }
  }

  navigateTo(tab: string): void {
    this.activeNavTab = tab;
    let targetId = '';
    switch (tab) {
      case 'overview':
        targetId = 'section-overview';
        break;
      case 'alokasi':
        targetId = 'section-categories';
        break;
      case 'rincian':
        targetId = 'section-subitems';
        break;
      case 'ringkasan':
        targetId = 'section-ringkasan';
        break;
    }

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('nav-pulse-highlight');
        setTimeout(() => el.classList.remove('nav-pulse-highlight'), 1200);
      }
    }
  }

  setActiveTab(tab: string): void {
    this.navigateTo(tab);
  }

  // ==========================================
  // Getters untuk Ringkasan & State UI (UTS 5.3)
  // ==========================================
  get totalBudget(): number {
    return Number(this.budgetForm?.get('totalBudget')?.value) || 0;
  }

  get hasCategories(): boolean {
    if (!this.categories || this.categories.length === 0) return false;
    return this.categories.controls.some(cat => {
      const name = cat.get('name')?.value;
      return typeof name === 'string' && name.trim().length > 0;
    });
  }

  get totalPercentage(): number {
    if (!this.categories) return 0;
    let total = 0;
    for (let i = 0; i < this.categories.length; i++) {
      total += Number(this.categories.at(i).get('percentage')?.value) || 0;
    }
    return Math.round(total * 100) / 100;
  }

  get totalAllocated(): number {
    if (!this.categories) return 0;
    let total = 0;
    for (let i = 0; i < this.categories.length; i++) {
      total += this.calculateCategoryAmount(i);
    }
    return total;
  }

  get totalSubItemAmount(): number {
    if (!this.categories) return 0;
    let total = 0;
    for (let i = 0; i < this.categories.length; i++) {
      total += this.calculateSubTotal(i);
    }
    return total;
  }

  get unallocatedBudget(): number {
    return this.totalBudget - this.totalAllocated;
  }

  get remainingDetailBudget(): number {
    return this.totalAllocated - this.totalSubItemAmount;
  }

  get hasOverAllocatedCategory(): boolean {
    if (!this.categories) return false;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.isOverAllocated(i)) return true;
    }
    return false;
  }

  get isBudgetValid(): boolean {
    if (!this.budgetForm || this.budgetForm.invalid) return false;
    if (this.categories.length < 2 || this.categories.length > 10) return false;
    if (Math.abs(this.totalPercentage - 100) > 0.000001) return false;
    if (this.hasOverAllocatedCategory) return false;
    return true;
  }

  get budgetStatus(): string {
    if (this.totalBudget <= 0) {
      return 'Total anggaran harus bernilai lebih dari Rp0.';
    }
    if (this.categories.length < 2) {
      return 'Minimal harus memiliki 2 kategori anggaran.';
    }
    if (this.categories.hasError('duplicateCategory')) {
      return 'Terdapat duplikasi nama kategori. Setiap kategori harus memiliki nama unik.';
    }
    if (this.totalPercentage < 100) {
      return `Alokasi belum lengkap! Total persentase saat ini ${this.totalPercentage}%, kurang ${Math.round((100 - this.totalPercentage) * 100) / 100}%.`;
    }
    if (this.totalPercentage > 100) {
      return `Alokasi melebihi batas! Total persentase saat ini ${this.totalPercentage}%, kelebihan ${Math.round((this.totalPercentage - 100) * 100) / 100}%.`;
    }
    if (this.hasOverAllocatedCategory) {
      return 'Peringatan: Terdapat sub-item yang totalnya melebihi alokasi kategori yang bersangkutan!';
    }
    return 'Alokasi anggaran lengkap dan valid (tepat 100%). Semua aturan terpenuhi!';
  }

  // Helper bindings untuk child component
  getCategoryAmountFn = (index: number): number => this.calculateCategoryAmount(index);
  getSubTotalFn = (catIndex: number): number => this.calculateSubTotal(catIndex);
  getIsOverAllocatedFn = (catIndex: number): boolean => this.isOverAllocated(catIndex);
}
