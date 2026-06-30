import type { FilterRule, FilterFieldConfig } from '../types/filter';

/**
 * Resolves a nested value from an object using a dot-separated path.
 * e.g., getNestedValue({ address: { city: 'SF' } }, 'address.city') -> 'SF'
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Evaluates whether a single field value satisfies a filter rule.
 */
export function evaluateRule(val: any, rule: FilterRule, _config?: FilterFieldConfig): boolean {
  const op = rule.operator;
  const ruleVal = rule.value;

  // Handle null/undefined values gracefully
  if (val === null || val === undefined) {
    if (
      op === 'notContains' ||
      op === 'numNotEquals' ||
      op === 'isNot' ||
      op === 'arrayNotContains'
    ) {
      return true;
    }
    return false;
  }

  switch (op) {
    // Text Operators
    case 'equals':
      return String(val).trim().toLowerCase() === String(ruleVal).trim().toLowerCase();
    case 'contains':
      return String(val).toLowerCase().includes(String(ruleVal).toLowerCase());
    case 'startsWith':
      return String(val).toLowerCase().startsWith(String(ruleVal).toLowerCase());
    case 'endsWith':
      return String(val).toLowerCase().endsWith(String(ruleVal).toLowerCase());
    case 'notContains':
      return !String(val).toLowerCase().includes(String(ruleVal).toLowerCase());

    // Number & Amount Operators
    case 'numEquals':
      return Number(val) === Number(ruleVal);
    case 'numNotEquals':
      return Number(val) !== Number(ruleVal);
    case 'greaterThan':
      return Number(val) > Number(ruleVal);
    case 'lessThan':
      return Number(val) < Number(ruleVal);
    case 'greaterThanOrEqual':
      return Number(val) >= Number(ruleVal);
    case 'lessThanOrEqual':
      return Number(val) <= Number(ruleVal);
    case 'between': {
      const min = ruleVal?.min !== undefined && ruleVal?.min !== '' ? Number(ruleVal.min) : -Infinity;
      const max = ruleVal?.max !== undefined && ruleVal?.max !== '' ? Number(ruleVal.max) : Infinity;
      const numVal = Number(val);
      return numVal >= min && numVal <= max;
    }

    // Date Operators
    case 'dateBefore': {
      if (!ruleVal) return true;
      return new Date(val).getTime() < new Date(ruleVal).getTime();
    }
    case 'dateAfter': {
      if (!ruleVal) return true;
      return new Date(val).getTime() > new Date(ruleVal).getTime();
    }
    case 'dateBetween': {
      const minVal = ruleVal?.min ? new Date(ruleVal.min).getTime() : -Infinity;
      let maxVal = Infinity;
      if (ruleVal?.max) {
        const d = new Date(ruleVal.max);
        d.setHours(23, 59, 59, 999); // include end of day
        maxVal = d.getTime();
      }
      const valTime = new Date(val).getTime();
      return valTime >= minVal && valTime <= maxVal;
    }
    case 'dateRelative': {
      if (!ruleVal) return true;
      const valTime = new Date(val).getTime();
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      if (ruleVal === 'last30Days') {
        return valTime >= now - 30 * oneDay && valTime <= now;
      }
      if (ruleVal === 'last90Days') {
        return valTime >= now - 90 * oneDay && valTime <= now;
      }
      if (ruleVal === 'lastYear') {
        return valTime >= now - 365 * oneDay && valTime <= now;
      }
      return true;
    }

    // Select & Boolean Operators
    case 'is':
      return String(val) === String(ruleVal);
    case 'isNot':
      return String(val) !== String(ruleVal);

    // Multi-Select (In / Not In)
    case 'in':
      return Array.isArray(ruleVal) && ruleVal.map(String).includes(String(val));
    case 'notIn':
      return Array.isArray(ruleVal) && !ruleVal.map(String).includes(String(val));

    // Array Operators (containsAny, containsAll, arrayNotContains)
    case 'containsAny': {
      const itemArray = Array.isArray(val) ? val : [val];
      return Array.isArray(ruleVal) && ruleVal.some(r => itemArray.map(String).includes(String(r)));
    }
    case 'containsAll': {
      const itemArray = Array.isArray(val) ? val : [val];
      return Array.isArray(ruleVal) && ruleVal.every(r => itemArray.map(String).includes(String(r)));
    }
    case 'arrayNotContains': {
      const itemArray = Array.isArray(val) ? val : [val];
      return Array.isArray(ruleVal) && !ruleVal.some(r => itemArray.map(String).includes(String(r)));
    }

    default:
      return true;
  }
}

/**
 * Filters a dataset of items based on active filter rules.
 * Applies:
 * - OR logic within rules for the SAME field.
 * - AND logic between rules of DIFFERENT fields.
 */
export function filterData<T>(
  data: T[],
  rules: FilterRule[] | null,
  configs: FilterFieldConfig[]
): T[] {
  if (!rules || rules.length === 0) return data;

  // Filter out incomplete/empty rules
  const activeRules = rules.filter(rule => {
    if (rule.value === undefined || rule.value === null) return false;
    if (typeof rule.value === 'string' && rule.value.trim() === '') return false;
    if (Array.isArray(rule.value) && rule.value.length === 0) return false;
    if (rule.operator === 'between' || rule.operator === 'dateBetween') {
      const min = rule.value?.min;
      const max = rule.value?.max;
      return (min !== undefined && min !== '') || (max !== undefined && max !== '');
    }
    return true;
  });

  if (activeRules.length === 0) return data;

  // Group rules by their filter field
  const rulesByField: Record<string, FilterRule[]> = {};
  activeRules.forEach(rule => {
    if (!rulesByField[rule.field]) {
      rulesByField[rule.field] = [];
    }
    rulesByField[rule.field].push(rule);
  });

  return data.filter(item => {
    // For each unique field, the item must satisfy at least one rule (OR within same field)
    // AND the item must satisfy this requirement for all fields (AND between fields)
    return Object.entries(rulesByField).every(([field, fieldRules]) => {
      const config = configs.find(c => c.id === field);
      const val = getNestedValue(item, field);
      return fieldRules.some(rule => evaluateRule(val, rule, config));
    });
  });
}
