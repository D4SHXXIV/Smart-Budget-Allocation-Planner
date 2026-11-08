# Product Requirements Document (PRD)

# Smart Budget Allocation Planner (SBAP)

**Document status:** Draft v1.0  
**Prepared for:** Framework Based Programming – Ujian Tengah Semester 2026/2027  
**Target implementation environment:** Angular project developed with Antigravity IDE  
**Primary languages:** English and Bahasa Indonesia

---

## 0. Instructions for the AI Coding Agent

Use this document as the primary product and implementation specification for the Smart Budget Allocation Planner.

Before writing or changing code:

1. Inspect the existing workspace, `package.json`, Angular version, current folder structure, and existing source files. Do not overwrite working files blindly.
2. If the workspace is empty, create a new Angular application using the stable Angular CLI version available in the environment. If a project already exists, keep its installed Angular version unless a real compatibility issue requires a change.
3. Use **standalone Angular components** where supported by the existing project setup.
4. Use **Reactive Forms** with `FormGroup` and `FormArray`. A category must contain its own nested `FormArray` of sub-items.
5. Use the classic structural directives `*ngFor` and `*ngIf` with `ng-template`, `then`, and `else`, because these are explicitly required by the UTS rubric. Do not replace them entirely with `@for` or `@if`.
6. Implement custom `trackBy` functions in the TypeScript component that owns each repeated list.
7. Keep complex boolean evaluation and business calculations in TypeScript Controller/component methods or getters. Do not put long expressions or business logic in HTML templates.
8. Keep the main application state and business operations in `BudgetComponent`. Child components should receive data with `@Input()` and send user intent upward with `@Output()` and `EventEmitter`.
9. Do not add a backend, API, database, authentication, or permanent storage. All application data is in memory and may reset after browser refresh.
10. Keep method, property, component, and event names consistent with the contracts in this PRD and with the project's Use Case and Sequence Diagrams.
11. Implement in small, verifiable steps. After each major step, run the available build/type-check/test commands, fix errors, and report what changed.
12. Do not claim a feature is complete until it has been implemented and verified. If a requirement cannot be completed, explain the blocker and leave a clear TODO.
13. Add concise comments for important validators and nested form operations. Prefer readable beginner-friendly code over unnecessary abstractions.
14. Do not introduce additional libraries unless they materially help the requirements. Angular and standard CSS are sufficient for the first version.

### Required implementation order

- Phase A: inspect/create Angular project and make it run.
- Phase B: implement the in-memory Reactive Forms model and core validators.
- Phase C: implement category and sub-item dynamic forms.
- Phase D: implement summary, status, Empty State, and Populated State.
- Phase E: implement component communication, nested loops, context variables, and `trackBy`.
- Phase F: style the responsive UI and verify all acceptance criteria.
- Phase G: provide a concise README with setup, run, and test instructions.

---

## 1. Product Overview

### 1.1 Product name

**Smart Budget Allocation Planner (SBAP)**

### 1.2 Product description

Smart Budget Allocation Planner is an interactive web application that helps one user plan a total budget, divide it into expense categories, assign a percentage to each category, and enter detailed expense sub-items under each category.

The application automatically calculates each category's nominal allocation, each category's sub-item subtotal, the overall budget summary, and validation status. It supports dynamically adding and removing categories and nested sub-items. Cross-item validation detects duplicate names, checks that category percentages total exactly 100%, enforces the category-count constraints, and prevents a category's sub-item subtotal from exceeding that category's allocation.

The application is built with Angular. The implementation focus is on the **View (HTML Template)** and **Controller (Angular Component TypeScript)**. Data is held in memory only; no backend or database is required.

### 1.3 Problem statement

Manual budget allocation can lead to calculation mistakes, duplicate category names, percentages that do not total 100%, and detailed expenses that exceed a category's allocation. Recalculating all values after each edit is also inconvenient. SBAP provides dynamic input rows, automatic calculations, and immediate validation feedback.

### 1.4 Primary user / actor

**Pengelola Anggaran (Budget Manager):** the sole user who enters the total budget, manages categories and sub-items, and views the summary.

There is no Admin role and no login/authentication in this UTS project.

### 1.5 Goals

- Allow the user to manage category rows dynamically.
- Allow each category to contain dynamically managed sub-items.
- Recalculate allocation and subtotal values whenever relevant input changes.
- Detect invalid relationships across multiple rows.
- Present clear validation feedback and budget summaries.
- Demonstrate Angular Reactive Forms, nested `FormArray`, `*ngFor`, `*ngIf`, `ng-template`, context variables, and custom `trackBy` as required by the UTS.

### 1.6 Non-goals / out of scope

- Backend API or server-side business logic.
- Database or permanent persistence.
- Login, registration, roles, and authorization.
- Cloud synchronization or multi-user collaboration.
- Export to PDF/Excel, unless requested later as an optional enhancement.
- Real bank-account or payment integrations.

---

## 2. Scope and UTS Requirement Traceability

The original UTS emphasizes an interactive non-static-CRUD application, View–Controller interaction, dynamic `FormArray`, nested items, cross-item validation, advanced `*ngFor`, `trackBy`, `*ngIf` template branching, and a live demonstration. This PRD maps those requirements to SBAP as follows.

| UTS item | Required capability                                                                   | SBAP implementation                                                             |
| -------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| No. 1    | Interactive case study and Use Case Diagram                                           | One Budget Manager actor; UC-01 through UC-08                                   |
| No. 2    | At least 3 detailed main use cases                                                    | UC-01 Manage Allocation, UC-02 Manage Sub-items, UC-03 View Summary             |
| No. 3    | View–Controller Sequence Diagram                                                      | SD-01 Allocation, SD-02 Sub-items, SD-03 Summary; no backend/database lifelines |
| No. 4    | Component architecture and data mapping                                               | Component Tree, View–Controller mapping, `@Input`, `@Output`, `EventEmitter`    |
| No. 5.1  | Dynamic FormArray, append, remove by index, nested items, cross-validation            | `categories` FormArray; `items` nested FormArray; custom validators             |
| No. 5.2  | `index`, `first`, `last`, custom `trackBy`, nested loops                              | Category and sub-item loops with context variables and stable IDs               |
| No. 5.3  | Empty/Populated State using `ng-template` then/else; complex boolean logic in getters | Summary template branching and TypeScript getters                               |
| No. 6    | Live demo, edge cases, code defense                                                   | Acceptance tests and manual demo checklist in this PRD                          |

**Important distinction:** the UTS specifies the capabilities to demonstrate. The exact application name, category limits, validation details, component names, and sample data below are project design decisions selected for SBAP.

---

## 3. Use Case Scope

### 3.1 Main use cases

| ID    | Use case                   | Description                                                                                        |
| ----- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| UC-01 | Mengelola Alokasi Anggaran | Enter total budget, add/edit/remove categories, and assign category percentages.                   |
| UC-02 | Mengelola Rincian Sub-item | Add/edit/remove expense sub-items within a selected category.                                      |
| UC-03 | Melihat Ringkasan Anggaran | View overall totals, per-category allocations, subtotals, remaining values, and validation status. |

### 3.2 Supporting use cases

| ID    | Use case                                  | Relationship                                                            |
| ----- | ----------------------------------------- | ----------------------------------------------------------------------- |
| UC-04 | Memvalidasi Kategori dan Persentase       | `<<include>>` from UC-01                                                |
| UC-05 | Menghitung Nominal Alokasi Otomatis       | `<<include>>` from UC-01                                                |
| UC-06 | Menghitung Total Sub-item                 | `<<include>>` from UC-02                                                |
| UC-07 | Menampilkan Peringatan Kelebihan Anggaran | `<<extend>>` from UC-02 when a category subtotal exceeds its allocation |
| UC-08 | Menghitung Ringkasan Anggaran             | `<<include>>` from UC-03                                                |

### 3.3 Main user flows

**UC-01 – Manage allocation**

1. User enters the total budget.
2. User adds or edits a category name and percentage.
3. Controller validates category names, percentage values, total percentage, and category count.
4. Controller calculates each category allocation.
5. User may remove a category by its exact index when the category-count rule allows it.
6. View refreshes to show current values and validation messages.

**UC-02 – Manage sub-items**

1. User selects a category.
2. User adds or edits a sub-item name and amount.
3. Controller validates the sub-item and duplicate names within that category.
4. Controller calculates the category subtotal.
5. Controller compares the subtotal with the category allocation.
6. If the subtotal is greater, the UI displays an over-allocation warning.
7. User can remove a sub-item by its exact index.

**UC-03 – View summary**

1. User opens or views the summary panel.
2. Controller evaluates summary values and validity.
3. View checks whether meaningful category data exists.
4. If there is no meaningful category data, show Empty State; otherwise show Populated State.
5. Changes to budget, categories, or sub-items automatically update the summary.

---

## 4. Business Rules and Validation

The following are the agreed SBAP rules. These are application decisions, not numeric limits explicitly prescribed by the UTS.

### 4.1 Total budget

- Total budget is required.
- Total budget must be a valid number greater than zero.
- Display currency in Indonesian Rupiah (IDR), using Indonesian locale formatting.

### 4.2 Categories

- Minimum category count: **2**.
- Maximum category count: **10**.
- Category name is required.
- Category names must be unique after trimming whitespace and ignoring letter case.
- Percentage is required and must be greater than 0 and no greater than 100.
- The sum of category percentages must equal exactly 100% (allow only a tiny floating-point tolerance, e.g. `0.000001`).
- When the percentage sum is below or above 100%, display the current total and a clear status. Do not prevent the user from editing intermediate values.
- The Add Category control is disabled at 10 categories.
- The Remove Category control is disabled at 2 categories. The Controller must also guard against invalid removal requests.

### 4.3 Category allocation calculation

For category `i`:

`categoryAllocation = totalBudget * categoryPercentage / 100`

Since the display currency is Rupiah, display allocation values rounded to whole Rupiah. Use a consistent calculation method in all summaries and validations.

### 4.4 Sub-items

- Each category owns a separate nested `FormArray` named `items`.
- A category may have zero or more sub-items; an empty sub-item list is allowed.
- Sub-item name is required.
- Sub-item names must be unique **within the same category**, after trimming whitespace and ignoring letter case. The same name may appear in a different category.
- Sub-item amount is required and must be greater than zero.
- Sub-items can be appended and removed by their exact index.

### 4.5 Cross-item validation

- Duplicate category names are invalid across the `categories` FormArray.
- The total category percentage must be exactly 100% for the overall budget to be valid.
- Duplicate sub-item names are invalid within each category's `items` FormArray.
- For every category, `sum(items.amount) <= categoryAllocation`.
- An over-allocation warning is displayed only for the category or categories that exceed their allocation.
- Cross-item validation must be recalculated when total budget, category percentage/name, or sub-item amount/name changes, and after add/remove/reorder operations.
- Invalid intermediate data should remain editable; show feedback rather than crashing or silently discarding the user's input.

### 4.6 Summary calculations

Use the following definitions consistently:

- `totalPercentage`: sum of all category percentages.
- `totalAllocated`: sum of all calculated category allocations.
- `totalSubItemAmount`: sum of all sub-item amounts across all categories.
- `unallocatedBudget`: `totalBudget - totalAllocated`.
- `remainingDetailBudget`: `totalAllocated - totalSubItemAmount`.
- `hasOverAllocatedCategory`: true if at least one category's sub-item subtotal exceeds its own allocation.
- `isBudgetValid`: true only when the main form is valid, category count is in range, total percentage is 100%, and there is no category over-allocation.

`remainingDetailBudget` is an overall aggregate only. It must not replace per-category over-allocation validation. A positive aggregate remainder does not mean every category is valid.

### 4.7 Empty State definition

The initial form may contain two blank category rows to support the minimum-two-category rule. However, the summary Empty State must still appear when **no category has a non-empty trimmed name**. Define `hasCategories` based on meaningful category data, not only `categories.length`.

When at least one category has a non-empty name, the summary may show the Populated State, while still displaying incomplete/invalid status until all validation rules pass.

---

## 5. Data Model and Reactive Forms Structure

### 5.1 In-memory form model

Use one main `FormGroup`:

```text
budgetForm: FormGroup
├── totalBudget: FormControl<number>
└── categories: FormArray<FormGroup>
    ├── Category FormGroup
    │   ├── id: FormControl<string>
    │   ├── name: FormControl<string>
    │   ├── percentage: FormControl<number>
    │   └── items: FormArray<FormGroup>
    │       ├── Sub-item FormGroup
    │       │   ├── id: FormControl<string>
    │       │   ├── name: FormControl<string>
    │       │   └── amount: FormControl<number>
    │       └── ...
    └── ...
```

### 5.2 Stable identifiers

- Each category must have a stable local `id` created when the category FormGroup is created.
- Each sub-item must have a stable local `id` created when its FormGroup is created.
- IDs are used by custom `trackBy` functions and must not change when a row is edited or reordered.
- IDs are in-memory identifiers only; they are not database IDs.

### 5.3 Initial form state

- Initialize the application with two blank category FormGroups, each having an empty nested `items` FormArray.
- Initialize total budget to an example value of `10000000` (Rp10.000.000), which the user can edit.
- Blank category names and zero percentages should be visibly marked as incomplete/invalid after interaction, but should not prevent the user from editing.
- The summary should show Empty State until at least one category name is entered.

---

## 6. Functional Requirements

### FR-01 – Total budget input

The system shall provide a numeric input for the total budget. It shall validate required and positive values and update all dependent calculations when changed.

### FR-02 – Dynamic category FormArray

The system shall support:

- Appending a new category FormGroup to `categories`.
- Removing a category using `categories.removeAt(index)` for the selected index.
- Enforcing 2–10 categories.
- Disabling Add at 10 and Remove at 2.
- Guarding invalid indices in Controller methods.

Required Controller methods:

- `createCategory()`
- `addCategory()`
- `removeCategory(index: number)`

### FR-03 – Category cross-validation

The system shall:

- Require category names.
- Detect duplicate category names case-insensitively after trimming.
- Require percentages greater than 0 and at most 100.
- Validate that total percentage equals 100%.
- Re-evaluate validation after relevant input changes and row operations.

Required Controller method / validator names:

- `validateCategories()`
- `uniqueCategoryNameValidator()`
- `totalPercentageValidator()`

### FR-04 – Automatic category allocation

The system shall calculate each category's nominal allocation from the total budget and category percentage whenever either value changes.

Required method:

- `calculateCategoryAmount(index: number)`

### FR-05 – Nested sub-item FormArray

The system shall provide a nested `items` FormArray under every category and support appending and removing sub-items by exact index.

Required methods:

- `getSubItems(categoryIndex: number)`
- `createSubItem()`
- `addSubItem(categoryIndex: number)`
- `removeSubItem(categoryIndex: number, itemIndex: number)`

### FR-06 – Sub-item validation and subtotal

The system shall require a non-empty sub-item name and an amount greater than zero. Duplicate sub-item names shall be checked within the same category. The system shall calculate each category subtotal.

Required methods:

- `validateSubItems(categoryIndex: number)`
- `validateAllSubItems()`
- `calculateSubTotal(categoryIndex: number)`

### FR-07 – Category over-allocation warning

The system shall compare each category subtotal with its category allocation and display a warning when the subtotal is greater.

Required method:

- `isOverAllocated(categoryIndex: number)`

The Controller must also expose an aggregate getter:

- `hasOverAllocatedCategory`

### FR-08 – Summary

The system shall show:

- Total budget.
- Total percentage.
- Total allocation.
- Total sub-item amount.
- Unallocated budget.
- Remaining detail budget.
- Overall validation status.

Required method/property names:

- `showSummary()`
- `showSummaryPanel`
- `hasCategories`
- `totalPercentage`
- `totalAllocated`
- `totalSubItemAmount`
- `unallocatedBudget`
- `remainingDetailBudget`
- `isBudgetValid`
- `budgetStatus`

### FR-09 – Empty State and Populated State

The summary template shall use `*ngIf` with `ng-template` references for both states. Use the `then` and `else` branching pattern. Complex boolean conditions must be exposed through getters in TypeScript, not long expressions in HTML.

### FR-10 – Component communication

The main `BudgetComponent` shall own the form state. Child components shall receive data through `@Input()` and send intent/events through `@Output()` and `EventEmitter`.

### FR-11 – Indonesian Rupiah formatting

Display monetary values with Indonesian Rupiah formatting (`id-ID`, `IDR`). Raw form values should remain numeric, not preformatted strings.

---

## 7. Component Architecture

Use the following component tree. The root component hosts the main budget component. `BudgetComponent` is the single source of truth for business data and operations.

```text
AppComponent
└── BudgetComponent
    ├── BudgetHeaderComponent
    ├── BudgetFormComponent
    │   └── CategoryItemComponent
    │       └── SubItemFormComponent
    └── BudgetSummaryComponent
        ├── SummaryCardComponent
        └── ValidationAlertComponent
```

### 7.1 Component responsibilities

| Component                  | Responsibility                                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `AppComponent`             | Root component; hosts `BudgetComponent`.                                                                              |
| `BudgetComponent`          | Owns `budgetForm`, validators, calculations, add/remove/reorder methods, and summary getters.                         |
| `BudgetHeaderComponent`    | Displays product title and short description.                                                                         |
| `BudgetFormComponent`      | Displays total budget input and iterates over categories. Forwards category and sub-item events to `BudgetComponent`. |
| `CategoryItemComponent`    | Displays one category's name, percentage, allocation, and its sub-item component.                                     |
| `SubItemFormComponent`     | Displays and edits one category's nested sub-item FormArray.                                                          |
| `BudgetSummaryComponent`   | Displays Empty/Populated State and the summary values.                                                                |
| `SummaryCardComponent`     | Displays a reusable summary metric (`title`, `value`).                                                                |
| `ValidationAlertComponent` | Displays status messages and warnings.                                                                                |

### 7.2 State ownership

- `BudgetComponent` owns `budgetForm` and all business calculations.
- Child components must not maintain duplicate copies of category or sub-item business data.
- Child components may maintain only local presentation state if genuinely needed.
- Do not introduce a UI State Service for this first version; parent-child communication is sufficient for the agreed component tree.

---

## 8. Component Data and Event Contracts

Keep these names consistent. If the existing project requires a justified naming adjustment, update this PRD and all relevant diagrams/documentation together.

### 8.1 Parent-to-child inputs

| Parent                   | Child                      | Inputs                                                                                                                                                                   |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `BudgetComponent`        | `BudgetFormComponent`      | `budgetForm`, `categories`                                                                                                                                               |
| `BudgetFormComponent`    | `CategoryItemComponent`    | `categoryGroup`, `categoryIndex`, `categoryCount`, `categoryAmount`                                                                                                      |
| `CategoryItemComponent`  | `SubItemFormComponent`     | `items`, `categoryIndex`, `subTotal`, `isOverAllocated`                                                                                                                  |
| `BudgetComponent`        | `BudgetSummaryComponent`   | `totalBudget`, `totalPercentage`, `totalAllocated`, `totalSubItemAmount`, `unallocatedBudget`, `remainingDetailBudget`, `hasCategories`, `isBudgetValid`, `budgetStatus` |
| `BudgetSummaryComponent` | `SummaryCardComponent`     | `title`, `value`                                                                                                                                                         |
| `BudgetSummaryComponent` | `ValidationAlertComponent` | `status`, `message`                                                                                                                                                      |

### 8.2 Child-to-parent events

| Child                  | Event                     | Payload                                        | Parent handling                                                                                                        |
| ---------------------- | ------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `BudgetFormComponent`  | `addCategoryRequested`    | `void`                                         | `addCategory()` in `BudgetComponent`                                                                                   |
| `BudgetFormComponent`  | `removeCategoryRequested` | `number` (`categoryIndex`)                     | `removeCategory(index)` in `BudgetComponent`                                                                           |
| `SubItemFormComponent` | `addRequested`            | `number` (`categoryIndex`)                     | Forward through `CategoryItemComponent` and `BudgetFormComponent`, then call `addSubItem(categoryIndex)`               |
| `SubItemFormComponent` | `removeRequested`         | `{ categoryIndex: number; itemIndex: number }` | Forward through `CategoryItemComponent` and `BudgetFormComponent`, then call `removeSubItem(categoryIndex, itemIndex)` |

Events must be emitted by explicit user interactions. Do not mutate the parent FormArray directly inside a child component.

---

## 9. UTS 5.2 – Advanced `*ngFor`, Context Variables, Nested Loops, and trackBy

This section is mandatory for the UTS and must be implemented, not merely documented.

### 9.1 Category loop

- Use `*ngFor` to iterate over `categories.controls`.
- Capture `index`, `first`, and `last` context variables.
- Use `index` for row numbering and exact index actions.
- Use `first` to disable a Move Up button for the first row.
- Use `last` to disable a Move Down button for the last row.
- The remove button is separately disabled when category count is at the minimum of 2.

### 9.2 Nested sub-item loop

- Inside each category component, use `*ngFor` to iterate over that category's `items.controls`.
- Capture `index`, `first`, and `last` for sub-item numbering and boundary action states.
- This must be a real nested loop: categories outside, sub-items inside each category.

### 9.3 Custom trackBy

Use stable `id` values created in the Controller:

- `trackByCategory(index, category)` returns the category's stable `id`.
- `trackBySubItem(index, item)` returns the sub-item's stable `id`.

Place each `trackBy` method in the TypeScript component that owns its respective `*ngFor` loop. Do not use the array index as the only identity if rows can be removed or reordered.

### 9.4 Reordering controls

To demonstrate `first` and `last` boundary locking clearly, provide Move Up and Move Down controls for category and/or sub-item rows:

- Disable Move Up when `first === true`.
- Disable Move Down when `last === true`.
- Reordering must move the existing FormGroup object, preserving its stable ID and values.
- Reordering is optional product behavior added to demonstrate the UTS context-variable requirement; it must not break index-based removal.

---

## 10. UTS 5.3 – UI State Management and Template Branching

- Use `*ngIf` and `ng-template` for Empty State and Populated State.
- Use the explicit `then` and `else` pattern in the summary template.
- The Empty State appears when no category has a non-empty trimmed name.
- The Populated State appears when at least one meaningful category name exists, even if the form is not yet valid; show the validation status in that state.
- Complex boolean evaluation must be implemented as TypeScript getters, including `hasCategories`, `isBudgetValid`, and `hasOverAllocatedCategory`.
- Do not write long validation expressions directly in HTML.

---

## 11. Method and Property Naming Contract

These names are the shared contract between the Use Case descriptions, Sequence Diagrams, component mapping, and Angular source code.

### 11.1 Core methods

| Name                                      | Purpose                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `ngOnInit()`                              | Initialize the form and subscriptions.                                 |
| `createBudgetForm()`                      | Create the main form.                                                  |
| `createCategory()`                        | Create one category FormGroup, including its nested `items` FormArray. |
| `addCategory()`                           | Append a category.                                                     |
| `removeCategory(index)`                   | Remove a category by index, subject to limits.                         |
| `getSubItems(categoryIndex)`              | Return a category's nested `items` FormArray.                          |
| `createSubItem()`                         | Create one sub-item FormGroup.                                         |
| `addSubItem(categoryIndex)`               | Append a sub-item to the selected category.                            |
| `removeSubItem(categoryIndex, itemIndex)` | Remove a sub-item by index.                                            |
| `validateCategories()`                    | Re-evaluate category-level validators.                                 |
| `validateSubItems(categoryIndex)`         | Re-evaluate one category's sub-item validators.                        |
| `validateAllSubItems()`                   | Re-evaluate sub-item validators for every category.                    |
| `calculateCategoryAmount(index)`          | Calculate a category's allocation.                                     |
| `calculateSubTotal(categoryIndex)`        | Calculate a category's sub-item subtotal.                              |
| `isOverAllocated(categoryIndex)`          | Check whether one category exceeds its allocation.                     |
| `showSummary()`                           | Open/show the summary panel.                                           |
| `trackByCategory(index, category)`        | Stable identity for category loop.                                     |
| `trackBySubItem(index, item)`             | Stable identity for sub-item loop.                                     |

### 11.2 Core properties/getters

| Name                       | Type / role                                          |
| -------------------------- | ---------------------------------------------------- |
| `budgetForm`               | Main `FormGroup`                                     |
| `categories`               | Getter returning the category `FormArray`            |
| `totalBudget`              | Getter or numeric value derived from the form        |
| `showSummaryPanel`         | Boolean presentation state                           |
| `hasCategories`            | Getter based on meaningful, non-empty category names |
| `totalPercentage`          | Getter                                               |
| `totalAllocated`           | Getter                                               |
| `totalSubItemAmount`       | Getter                                               |
| `unallocatedBudget`        | Getter                                               |
| `remainingDetailBudget`    | Getter                                               |
| `hasOverAllocatedCategory` | Getter                                               |
| `isBudgetValid`            | Getter                                               |
| `budgetStatus`             | Getter returning a user-facing status message        |

### 11.3 Validation functions

Use clearly named custom validators, such as:

- `minArrayLength(min)`
- `maxArrayLength(max)`
- `uniqueCategoryNameValidator()`
- `totalPercentageValidator()`
- `uniqueSubItemNameValidator()`
- A category allocation/sub-item subtotal validator.

A validator must return Angular `ValidationErrors` or `null`, and must not mutate form values as a side effect.

---

## 12. UI / UX Requirements

- The UI should be clean, readable, and responsive on desktop and mobile.
- Use clear section headings: Total Anggaran, Kategori Anggaran, Rincian Sub-item, and Ringkasan Anggaran.
- Each category should be visually separated from other categories.
- Each sub-item should be visually grouped under its parent category.
- Use clearly distinguishable Add, Remove, Move Up, and Move Down actions.
- Disable controls when a boundary rule applies and also enforce the same rule in Controller methods.
- Show validation messages near the relevant input or section.
- Show a specific over-allocation warning next to the affected category.
- Use Indonesian labels and Indonesian Rupiah formatting.
- Provide visible Empty State and Populated State.
- Do not rely on color alone to communicate validity; include readable text or icons/labels.
- Keep keyboard focus and labels usable; every input should have an accessible label.

---

## 13. Acceptance Criteria / Definition of Done

The application is not considered complete until the following can be demonstrated in the browser.

### 13.1 UTS 5.1 acceptance criteria

- [ ] Two initial blank category rows are available, or an equivalent user flow allows the user to add the required minimum of two categories.
- [ ] User can append a category using `FormArray.push()`.
- [ ] User can remove a selected category using `FormArray.removeAt(index)` when allowed.
- [ ] Category count cannot exceed 10 and cannot be reduced below 2 through the normal UI.
- [ ] Every category contains its own nested `items` FormArray.
- [ ] User can append a sub-item to a selected category.
- [ ] User can remove a selected sub-item using its exact index.
- [ ] Duplicate category names are detected case-insensitively after trimming.
- [ ] Duplicate sub-item names within the same category are detected.
- [ ] Total category percentage below 100% is reported as incomplete/invalid.
- [ ] Total category percentage above 100% is reported as invalid.
- [ ] Total category percentage equal to 100% passes the percentage cross-validation.
- [ ] A category subtotal greater than that category's allocation displays a warning.
- [ ] All calculations update after relevant inputs and row operations.

### 13.2 UTS 5.2 acceptance criteria

- [ ] Category rows use `*ngFor`.
- [ ] Category loop uses `index`, `first`, and `last`.
- [ ] Sub-item rows use a nested `*ngFor` inside category rendering.
- [ ] Sub-item loop uses `index`, `first`, and `last`.
- [ ] Custom `trackByCategory()` uses stable category IDs.
- [ ] Custom `trackBySubItem()` uses stable sub-item IDs.
- [ ] Move Up is disabled for the first row and Move Down for the last row where reorder controls are implemented.
- [ ] Removing or reordering a row does not cause values to appear under the wrong category or sub-item.

### 13.3 UTS 5.3 acceptance criteria

- [ ] Summary uses `*ngIf` with `ng-template` and `then`/`else` branching.
- [ ] Empty State is shown when there are no meaningful category names.
- [ ] Populated State is shown when at least one category name is entered.
- [ ] Complex boolean checks are implemented as TypeScript getters.
- [ ] Summary and status update when the form data changes.

### 13.4 Quality acceptance criteria

- [ ] Angular project builds without TypeScript/template errors.
- [ ] No uncaught errors appear in the browser console during core flows.
- [ ] UI works at common desktop and mobile widths.
- [ ] No API/database/network persistence is introduced.
- [ ] README explains how to install dependencies and run the application.
- [ ] The code names match the diagrams and this PRD.

---

## 14. Manual Test and Live Demo Scenarios

Use these scenarios for the UTS demonstration and technical code defense.

| Test ID | Scenario                             | Steps                                                                  | Expected result                                                              |
| ------- | ------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| T-01    | Initial state                        | Open the application                                                   | Two blank category rows appear; summary shows Empty State.                   |
| T-02    | Add category                         | Click Add Category repeatedly                                          | New row appears; button is disabled at 10 categories.                        |
| T-03    | Minimum category                     | Attempt to remove when 2 categories remain                             | Remove control is disabled; Controller blocks removal too.                   |
| T-04    | Remove middle category               | Create at least 3 categories and remove index 1                        | Only the selected category and its nested items are removed.                 |
| T-05    | Duplicate category                   | Enter `Pendidikan` and `pendidikan`                                    | Duplicate validation appears.                                                |
| T-06    | Percentage below 100                 | Enter 40%, 30%, 20%                                                    | Total 90% is shown as invalid/incomplete.                                    |
| T-07    | Percentage above 100                 | Enter 50%, 35%, 25%                                                    | Total 110% is shown as invalid.                                              |
| T-08    | Percentage equals 100                | Enter 40%, 35%, 25%                                                    | Percentage cross-validation passes.                                          |
| T-09    | Nested sub-items                     | Add multiple items to one category                                     | Items appear under the correct category only.                                |
| T-10    | Duplicate sub-item                   | Add the same item name twice in one category                           | Duplicate warning appears.                                                   |
| T-11    | Same sub-item name across categories | Use the same item label in two different categories                    | Both categories may accept it because uniqueness is scoped per category.     |
| T-12    | Over-allocation                      | Add sub-items totaling more than category allocation                   | Warning appears on the affected category.                                    |
| T-13    | Remove sub-item                      | Remove a middle sub-item                                               | Only that sub-item is removed; subtotal recalculates.                        |
| T-14    | Reorder rows                         | Move a middle category or sub-item up/down                             | FormGroup identity and values remain correct; boundary buttons are disabled. |
| T-15    | Summary update                       | Change total budget or percentage                                      | Summary numbers update without page refresh.                                 |
| T-16    | Empty/Populated State                | Clear or leave category names blank, then enter a name                 | Summary switches between the two template branches.                          |
| T-17    | Invalid indices                      | Trigger removal with an invalid index through a safe test or unit test | Controller ignores/rejects the operation without crashing.                   |

---

## 15. Expected Project Structure

Adapt filenames to the existing Angular CLI output, but preserve these component responsibilities.

```text
src/app/
├── app.component.ts
├── app.component.html
├── app.component.css
└── components/
    ├── budget/
    │   ├── budget.component.ts
    │   ├── budget.component.html
    │   └── budget.component.css
    ├── budget-header/
    ├── budget-form/
    ├── category-item/
    ├── sub-item-form/
    ├── budget-summary/
    ├── summary-card/
    └── validation-alert/
```

The main `BudgetComponent` owns the form and business rules. Components that own repeated templates should contain their corresponding `trackBy` methods.

---

## 16. Expected Deliverables

The AI coding agent should produce:

1. A working Angular source project.
2. All nine components listed in the component tree, with responsibilities matching this PRD.
3. Dynamic category `FormArray` and nested sub-item `FormArray`.
4. Cross-item and category-allocation validators.
5. Advanced `*ngFor` implementation with `index`, `first`, `last`, nested loops, and custom `trackBy` methods.
6. Empty State and Populated State using `ng-template`, `then`, and `else`.
7. A responsive, Indonesian-language user interface with IDR formatting.
8. A README containing setup, run, and test instructions.
9. A short implementation summary listing files created/modified and test/build results.

---

## 17. Final Guidance for Antigravity IDE

Implement this PRD as a student UTS project. Prioritize rubric compliance, understandable code, and consistency with the existing design documents over adding extra features.

Do not skip the following UTS evidence:

- The category FormArray must visibly support append and remove-at-index.
- The nested sub-item FormArray must be demonstrable.
- Cross-item validation must operate across rows, not only individual fields.
- `*ngFor` must use the requested context variables and nested loops.
- Custom `trackBy` functions must be present in TypeScript.
- Empty State and Populated State must use `ng-template` branching.
- Complex boolean logic must be placed in Controller getters.
- The implemented method/property names must remain aligned with SD-01, SD-02, SD-03, and the component mapping.

First inspect the project and report the implementation plan. Then implement the application in the phases described in Section 0, verifying each phase before moving to the next.
