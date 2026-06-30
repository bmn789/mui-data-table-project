import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Paper,
  Grid,
  Chip,
  Checkbox,
  ListItemText,
  TextField,
} from '@mui/material';
import { Trash2, Plus, Filter, RotateCcw, HelpCircle, PlusCircle } from 'lucide-react';
import type {
  FilterFieldConfig,
  FilterRule,
  Operator,
} from '../types/filter';
import {
  OPERATOR_LABELS,
  TYPE_OPERATORS,
} from '../types/filter';

interface FilterBuilderProps {
  configs: FilterFieldConfig[];
  rules: FilterRule[];
  onChange: (rules: FilterRule[]) => void;
}

// ─── Debounced text input ────────────────────────────────────────────────────

const DebouncedTextField: React.FC<{
  value: any;
  onChange: (val: any) => void;
  label: string;
  type?: string;
  placeholder?: string;
}> = ({ value, onChange, label, type = 'text', placeholder }) => {
  const [local, setLocal] = React.useState(value ?? '');

  React.useEffect(() => setLocal(value ?? ''), [value]);

  React.useEffect(() => {
    const h = setTimeout(() => {
      if (local !== (value ?? '')) onChange(local);
    }, 300);
    return () => clearTimeout(h);
  }, [local, value, onChange]);

  return (
    <TextField
      size="small"
      type={type}
      label={label}
      placeholder={placeholder}
      value={local}
      onChange={e => {
        const v = e.target.value;
        setLocal(type === 'number' ? (v === '' ? '' : Number(v)) : v);
      }}
      fullWidth
    />
  );
};

// ─── Value input renderer ────────────────────────────────────────────────────

const ValueInput: React.FC<{
  rule: FilterRule;
  config: FilterFieldConfig;
  onUpdate: (partial: Partial<FilterRule>) => void;
}> = ({ rule, config, onUpdate }) => {
  const { type } = config;
  const { operator, value } = rule;

  if (type === 'boolean') {
    return (
      <FormControl size="small" fullWidth>
        <InputLabel>Value</InputLabel>
        <Select
          value={value === true ? 'true' : value === false ? 'false' : ''}
          label="Value"
          onChange={e => onUpdate({ value: e.target.value === 'true' })}
        >
          <MenuItem value="true">Active / True</MenuItem>
          <MenuItem value="false">Inactive / False</MenuItem>
        </Select>
      </FormControl>
    );
  }

  if (operator === 'dateRelative') {
    return (
      <FormControl size="small" fullWidth>
        <InputLabel>Range</InputLabel>
        <Select
          value={value || 'last30Days'}
          label="Range"
          onChange={e => onUpdate({ value: e.target.value })}
        >
          <MenuItem value="last30Days">Last 30 Days</MenuItem>
          <MenuItem value="last90Days">Last 90 Days</MenuItem>
          <MenuItem value="lastYear">Last Year</MenuItem>
        </Select>
      </FormControl>
    );
  }

  if (operator === 'dateBetween') {
    return (
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        <TextField size="small" type="date" label="From"
          slotProps={{ inputLabel: { shrink: true } }}
          value={value?.min || ''} fullWidth
          onChange={e => onUpdate({ value: { ...value, min: e.target.value } })} />
        <TextField size="small" type="date" label="To"
          slotProps={{ inputLabel: { shrink: true } }}
          value={value?.max || ''} fullWidth
          onChange={e => onUpdate({ value: { ...value, max: e.target.value } })} />
      </Box>
    );
  }

  if (operator === 'dateBefore' || operator === 'dateAfter') {
    return (
      <TextField size="small" type="date" label="Date"
        slotProps={{ inputLabel: { shrink: true } }}
        value={value || ''} fullWidth
        onChange={e => onUpdate({ value: e.target.value })} />
    );
  }

  if (operator === 'between') {
    return (
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        <DebouncedTextField type="number"
          label={type === 'amount' ? 'Min ($)' : 'Min'}
          value={value?.min ?? ''} onChange={v => onUpdate({ value: { ...value, min: v } })} />
        <DebouncedTextField type="number"
          label={type === 'amount' ? 'Max ($)' : 'Max'}
          value={value?.max ?? ''} onChange={v => onUpdate({ value: { ...value, max: v } })} />
      </Box>
    );
  }

  if (type === 'select') {
    return (
      <FormControl size="small" fullWidth>
        <InputLabel>Option</InputLabel>
        <Select value={value || ''} label="Option"
          onChange={e => onUpdate({ value: e.target.value })}>
          {config.options?.map(o => (
            <MenuItem key={String(o.value)} value={String(o.value)}>{o.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (type === 'multi-select' || type === 'array') {
    const sel: string[] = Array.isArray(value) ? value : [];
    return (
      <FormControl size="small" fullWidth>
        <InputLabel>Options</InputLabel>
        <Select multiple value={sel} label="Options"
          onChange={e => {
            const v = e.target.value;
            onUpdate({ value: typeof v === 'string' ? v.split(',') : v });
          }}
          renderValue={s => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(s as string[]).map(v => {
                const opt = config.options?.find(o => String(o.value) === v);
                return <Chip key={v} size="small" label={opt?.label || v} />;
              })}
            </Box>
          )}
        >
          {config.options?.map(o => (
            <MenuItem key={String(o.value)} value={String(o.value)}>
              <Checkbox checked={sel.includes(String(o.value))} size="small" />
              <ListItemText primary={o.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <DebouncedTextField
      type={type === 'number' || type === 'amount' ? 'number' : 'text'}
      label="Value" placeholder={config.placeholder || 'Enter value...'}
      value={value} onChange={v => onUpdate({ value: v })} />
  );
};

// ─── Main FilterBuilder ──────────────────────────────────────────────────────

export const FilterBuilder: React.FC<FilterBuilderProps> = ({ configs, rules, onChange }) => {

  const genId = () => Math.random().toString(36).substring(2, 9);

  const defaultValue = (op: Operator) => {
    if (op === 'between' || op === 'dateBetween') return { min: '', max: '' };
    if (op === 'dateRelative') return 'last30Days';
    if (['in', 'notIn', 'containsAny', 'containsAll', 'arrayNotContains'].includes(op)) return [];
    return '';
  };

  // Derive a stable ordered list of unique fields currently in the rules
  const fieldOrder = React.useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    rules.forEach(r => { if (!seen.has(r.field)) { seen.add(r.field); order.push(r.field); } });
    return order;
  }, [rules]);

  // Group rules by field
  const rulesByField = React.useMemo(() => {
    const map: Record<string, FilterRule[]> = {};
    rules.forEach(r => {
      if (!map[r.field]) map[r.field] = [];
      map[r.field].push(r);
    });
    return map;
  }, [rules]);

  // Add a brand-new column group (first filter for that field)
  const handleAddColumnGroup = () => {
    // Pick the first config not already in use, or fall back to configs[0]
    const unusedConfig = configs.find(c => !rulesByField[c.id]) ?? configs[0];
    if (!unusedConfig) return;
    const op = TYPE_OPERATORS[unusedConfig.type][0];
    const newRule: FilterRule = { id: genId(), field: unusedConfig.id, operator: op, value: defaultValue(op) };
    onChange([...rules, newRule]);
  };

  // Add an OR condition to an existing field group
  const handleAddOrCondition = (fieldId: string) => {
    const config = configs.find(c => c.id === fieldId)!;
    const existingRule = (rulesByField[fieldId] ?? [])[0];
    // Keep the same operator as the first rule in that group
    const op: Operator = existingRule?.operator ?? TYPE_OPERATORS[config.type][0];
    const newRule: FilterRule = { id: genId(), field: fieldId, operator: op, value: defaultValue(op) };
    // Insert the new OR rule right after the last rule for this field
    const insertAfterIdx = rules.reduce((last, r, i) => r.field === fieldId ? i : last, -1);
    const next = [...rules];
    next.splice(insertAfterIdx + 1, 0, newRule);
    onChange(next);
  };

  // Remove a single rule
  const handleRemoveRule = (id: string) => onChange(rules.filter(r => r.id !== id));

  // Remove all rules for a field group
  const handleRemoveGroup = (fieldId: string) => onChange(rules.filter(r => r.field !== fieldId));

  // Update a rule's field — resets operator + value
  const handleFieldChange = (id: string, newFieldId: string) => {
    const config = configs.find(c => c.id === newFieldId)!;
    const op = TYPE_OPERATORS[config.type][0];
    onChange(rules.map(r => r.id === id ? { ...r, field: newFieldId, operator: op, value: defaultValue(op) } : r));
  };

  // Update a rule's operator — resets value
  const handleOperatorChange = (id: string, op: Operator) => {
    onChange(rules.map(r => r.id === id ? { ...r, operator: op, value: defaultValue(op) } : r));
  };

  // Update a rule's value / any partial fields
  const handleRuleUpdate = (id: string, partial: Partial<FilterRule>) => {
    onChange(rules.map(r => r.id === id ? { ...r, ...partial } : r));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Filter size={18} color="#6366f1" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Filter Directory
          </Typography>
          {rules.length > 0 && (
            <Chip
              size="small"
              label={`${rules.length} condition${rules.length > 1 ? 's' : ''}`}
              sx={{ bgcolor: 'rgba(99,102,241,0.08)', color: 'primary.main', fontWeight: 600 }}
            />
          )}
        </Box>

        {rules.length > 0 && (
          <Button
            size="small" color="error" variant="outlined"
            startIcon={<RotateCcw size={14} />}
            onClick={() => onChange([])}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* ── Empty state ── */}
      {rules.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <HelpCircle size={16} />
            No active filters. Add a column filter to start narrowing the directory.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {fieldOrder.map((fieldId, groupIdx) => {
            const groupRules = rulesByField[fieldId] ?? [];
            const config = configs.find(c => c.id === fieldId);
            if (!config) return null;
            const availableOps = TYPE_OPERATORS[config.type];

            return (
              <React.Fragment key={fieldId}>
                {/* ── AND separator between different-column groups ── */}
                {groupIdx > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                    <Chip
                      label="AND"
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        letterSpacing: '0.05em',
                        bgcolor: 'rgba(99,102,241,0.1)',
                        color: 'primary.main',
                        px: 0.5,
                      }}
                    />
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                  </Box>
                )}

                {/* ── Column group card ── */}
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  {/* Group header */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: 'rgba(99,102,241,0.04)',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {config.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        — {groupRules.length} condition{groupRules.length > 1 ? 's (OR)' : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<PlusCircle size={13} />}
                        onClick={() => handleAddOrCondition(fieldId)}
                        sx={{ textTransform: 'none', borderRadius: 1.5, fontSize: '0.78rem', py: 0.3, px: 1.2 }}
                      >
                        Add OR
                      </Button>
                      <IconButton
                        size="small" color="error"
                        onClick={() => handleRemoveGroup(fieldId)}
                        sx={{ borderRadius: 1.5 }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Rules rows */}
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {groupRules.map((rule, ruleIdx) => (
                      <React.Fragment key={rule.id}>
                        {/* OR separator inside same-column group */}
                        {ruleIdx > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(234,179,8,0.3)' }} />
                            <Chip
                              label="OR"
                              size="small"
                              sx={{
                                fontWeight: 800,
                                fontSize: '0.68rem',
                                letterSpacing: '0.06em',
                                bgcolor: 'rgba(234,179,8,0.1)',
                                color: '#b45309',
                                px: 0.5,
                              }}
                            />
                            <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(234,179,8,0.3)' }} />
                          </Box>
                        )}

                        <Grid container spacing={1.5} sx={{ alignItems: 'center' }}>
                          {/* Field selector (read-only label when group has >1 rule, editable otherwise) */}
                          <Grid size={{ xs: 12, md: 3.5 }}>
                            <FormControl size="small" fullWidth>
                              <InputLabel>Field</InputLabel>
                              <Select
                                value={rule.field}
                                label="Field"
                                // Only allow changing field if it's a single rule in this group
                                disabled={groupRules.length > 1}
                                onChange={e => handleFieldChange(rule.id, e.target.value)}
                              >
                                {configs.map(c => (
                                  <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          {/* Operator selector */}
                          <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl size="small" fullWidth>
                              <InputLabel>Operator</InputLabel>
                              <Select
                                value={rule.operator}
                                label="Operator"
                                onChange={e => handleOperatorChange(rule.id, e.target.value as Operator)}
                              >
                                {availableOps.map(op => (
                                  <MenuItem key={op} value={op}>{OPERATOR_LABELS[op]}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          {/* Value input */}
                          <Grid size={{ xs: 12, md: groupRules.length > 1 ? 4.5 : 4.5 }}>
                            <ValueInput
                              rule={rule}
                              config={config}
                              onUpdate={partial => handleRuleUpdate(rule.id, partial)}
                            />
                          </Grid>

                          {/* Remove single rule (only when group has >1 rule) */}
                          <Grid size={{ xs: 12, md: 1 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                            {groupRules.length > 1 && (
                              <IconButton
                                size="small" color="error"
                                onClick={() => handleRemoveRule(rule.id)}
                                sx={{ bgcolor: 'rgba(239,68,68,0.05)', '&:hover': { bgcolor: 'rgba(239,68,68,0.15)' }, borderRadius: 2 }}
                              >
                                <Trash2 size={15} />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
      )}

      {/* ── Add column filter button ── */}
      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<Plus size={14} />}
          onClick={handleAddColumnGroup}
          sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}
        >
          Add Column Filter
        </Button>
        {rules.length > 0 && (
          <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
            Different columns are joined with <strong>AND</strong> · Same column uses <strong>OR</strong>
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
