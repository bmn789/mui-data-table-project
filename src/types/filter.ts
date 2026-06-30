export type FilterType =
  | 'text'
  | 'number'
  | 'date'
  | 'amount'
  | 'select'
  | 'multi-select'
  | 'boolean'
  | 'array';

export type Operator =
  // Text operators
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'notContains'
  // Number/Amount operators
  | 'numEquals'
  | 'numNotEquals'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  // Date operators
  | 'dateBefore'
  | 'dateAfter'
  | 'dateBetween'
  | 'dateRelative'
  // Select operators
  | 'is'
  | 'isNot'
  // Multi-select / Array operators
  | 'in'
  | 'notIn'
  | 'containsAny'
  | 'containsAll'
  | 'arrayNotContains';

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterFieldConfig {
  id: string; // Column dot-path, e.g., 'name', 'address.city', 'skills'
  label: string;
  type: FilterType;
  options?: SelectOption[]; // Predefined options for select, multi-select, or array
  placeholder?: string;
  defaultValue?: any;
}

export interface FilterRule {
  id: string; // Unique rule identifier (e.g., uuid or random string)
  field: string; // Field ID matching FilterFieldConfig
  operator: Operator;
  value: any; // Rule value, e.g., string, number, range object { min?: number, max?: number }, or array
}

export const OPERATOR_LABELS: Record<Operator, string> = {
  equals: 'Equals',
  contains: 'Contains',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  notContains: 'Does Not Contain',
  numEquals: 'Equals',
  numNotEquals: 'Not Equal',
  greaterThan: 'Greater Than',
  lessThan: 'Less Than',
  greaterThanOrEqual: 'Greater Than or Equal',
  lessThanOrEqual: 'Less Than or Equal',
  between: 'Between (Range)',
  dateBefore: 'Before Date',
  dateAfter: 'After Date',
  dateBetween: 'Between (Date Range)',
  dateRelative: 'Relative Date',
  is: 'Is',
  isNot: 'Is Not',
  in: 'In (Any of)',
  notIn: 'Not In (None of)',
  containsAny: 'Contains Any of',
  containsAll: 'Contains All of',
  arrayNotContains: 'Does Not Contain',
};

// Maps field type to list of supported operators
export const TYPE_OPERATORS: Record<FilterType, Operator[]> = {
  text: ['contains', 'equals', 'startsWith', 'endsWith', 'notContains'],
  number: ['numEquals', 'numNotEquals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between'],
  amount: ['between', 'greaterThan', 'lessThan', 'numEquals'],
  date: ['dateBetween', 'dateBefore', 'dateAfter', 'dateRelative'],
  select: ['is', 'isNot'],
  'multi-select': ['in', 'notIn'],
  boolean: ['is'],
  array: ['containsAny', 'containsAll', 'arrayNotContains'],
};
