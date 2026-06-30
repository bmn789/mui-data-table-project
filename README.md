# Reusable Dynamic Filter Component System & Data Table

A fully type-safe, configuration-driven React 18, TypeScript, and Material UI v9 dynamic filter component system. The system can filter nested fields and array-based records using a robust client-side filtering engine, updating statistical charts and sortable data grids in real-time.

## 🚀 Key Features

*   **Configuration-Driven Architecture**: Define filter schemas dynamically using configuration objects. The system automatically renders corresponding operators and inputs (e.g. text inputs, numeric range sliders, calendar ranges, multiselect lists, checkboxes, and boolean selectors).
*   **Logical AND & OR Operations**: Combines rules using OR conditions when filtering on the same field, and AND conditions when filtering across different fields.
*   **MUI v9 & Google Typography**: Clean, responsive layout with Outfit & Inter typefaces, modern border styling, and micro-hover transitions.
*   **Real-Time Debounced Searching**: Inputs are debounced by 300ms to ensure filtering remains performant and doesn't cause typing lags.
*   **Export Functions**: Download filtered segments instantly to either `.csv` or `.json` formats.
*   **Directory Metrics**: Insight cards summarizing total results, matching percentages, average salaries, and project counts of matches.
*   **Interactive Sorting & Pagination**: Sort nested location keys or direct properties dynamically (both ascending and descending) with paging limits.

---

## 📁 File Structure

```text
├── src/
│   ├── components/
│   │   ├── DashboardStats.tsx  # KPI Summary Widget Cards
│   │   ├── FilterBuilder.tsx   # Dynamic filter builder form and custom inputs
│   │   └── DataTable.tsx       # Sortable and paginated table with CSV/JSON exports
│   ├── data/
│   │   └── employees.json      # Mock dataset of 55 employee records
│   ├── types/
│   │   ├── employee.ts         # TypeScript structures for employee data
│   │   └── filter.ts           # Types, operators, and schemas for filter builder
│   ├── utils/
│   │   └── filterEngine.ts     # Client-side AND/OR filter execution engine
│   ├── App.tsx                 # App layout coordinating state
│   ├── index.css               # Styling and Google font imports
│   └── main.tsx                # Entry-point wrapper
```

---

## 🛠️ Getting Started

### Prerequisites

*   Node.js 18+
*   npm or yarn

### Installation & Run

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Launch the development server:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔧 Schema Definition Example

To integrate the filter builder with a new table, pass the schema configuration array. No internal component modifications are required.

```typescript
import { FilterFieldConfig } from './types/filter';

const filterFieldConfigs: FilterFieldConfig[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Search name...' },
  { id: 'salary', label: 'Salary', type: 'amount', placeholder: 'Enter salary...' },
  { id: 'joinDate', label: 'Join Date', type: 'date' },
  { id: 'isActive', label: 'Active Status', type: 'boolean' },
  {
    id: 'skills',
    label: 'Skills',
    type: 'array',
    options: [
      { label: 'React', value: 'React' },
      { label: 'TypeScript', value: 'TypeScript' }
    ]
  },
  { id: 'address.city', label: 'City', type: 'text' }
];
```

---

## 🔍 Supported Operators

| Data Type | Available Operators | Input UI Rendered |
| :--- | :--- | :--- |
| **Text** | Contains, Equals, Starts With, Ends With, Does Not Contain | Debounced `TextField` (text) |
| **Number** / **Amount** | Equals, Not Equal, Greater Than, Less Than, Greater Than or Equal, Less Than or Equal, Between | Debounced `TextField` (number) / Min-Max row |
| **Date** | Between, Before, After, Relative | Two Date inputs (From / To) / Predefined ranges select |
| **Select** | Is, Is Not | Option dropdown |
| **Multi-Select** / **Array** | In, Not In, Contains Any, Contains All, Does Not Contain | Multiple checkbox select dropdown with chips |
| **Boolean** | Is | True (Active) / False (Inactive) select dropdown |

---

## 🧠 Design Rationale

1.  **Frontend Mocking API (Timeout Resolver)**: Simulated asynchronously using `Promise` and `setTimeout` (800ms) to mirror loading times of a backend server while remaining fully serverless, self-contained, and easily deployable.
2.  **Verbatim Module Syntax**: Standard type-only imports (`import type { ... }`) are enforced for optimal compilations under strict TypeScript configurations.
3.  **MUI v9 SlotProps**: Refactored from deprecated legacy attributes like `InputLabelProps` to the modern nested `slotProps` API.
4.  **MUI v9 Grid Layout**: Migrated from legacy `<Grid item xs={...}>` to the simplified `<Grid size={{ xs: ... }}>` grid API.
