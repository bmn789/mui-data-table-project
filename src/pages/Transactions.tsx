import React from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Chip } from '@mui/material';
import { CreditCard } from 'lucide-react';
import { PageHeader } from './PageHeader';
import type { Transaction } from '../types/transaction';
import type { FilterFieldConfig, FilterRule } from '../types/filter';
import { FilterBuilder } from '../components/FilterBuilder';
import { GenericDataTable, type ColumnDef } from '../components/GenericDataTable';
import { filterData } from '../utils/filterEngine';
import rawTransactions from '../data/transactions.json';

const transactionFilterConfigs: FilterFieldConfig[] = [
  { id: 'amount', label: 'Amount', type: 'amount', placeholder: 'Amount range...' },
  {
    id: 'paymentMethod',
    label: 'Payment Method',
    type: 'select',
    options: [
      { label: 'Card', value: 'Card' },
      { label: 'Bank', value: 'Bank' },
      { label: 'UPI', value: 'UPI' },
    ],
  },
  { id: 'isRefunded', label: 'Refunded', type: 'boolean' },
];

const transactionColumns: ColumnDef<Record<string, unknown>>[] = [
  { key: 'id', label: 'ID', minWidth: 70 },
  { key: 'description', label: 'Description', minWidth: 230 },
  {
    key: 'amount',
    label: 'Amount',
    minWidth: 110,
    render: (row) => (
      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
        ${Number(row.amount).toFixed(2)}
      </Typography>
    ),
  },
  {
    key: 'paymentMethod',
    label: 'Payment Method',
    minWidth: 150,
    render: (row) => {
      const method = String(row.paymentMethod);
      const palette: Record<string, { bg: string; color: string }> = {
        Card: { bg: 'rgba(99,102,241,0.1)', color: '#4f46e5' },
        Bank: { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
        UPI: { bg: 'rgba(245,158,11,0.1)', color: '#b45309' },
      };
      const { bg, color } = palette[method] ?? { bg: 'rgba(0,0,0,0.05)', color: 'text.secondary' };
      return (
        <Chip size="small" label={method} sx={{ bgcolor: bg, color, fontWeight: 600, fontSize: '0.75rem' }} />
      );
    },
  },
  {
    key: 'isRefunded',
    label: 'Refunded',
    minWidth: 110,
    render: (row) => (
      <Chip
        size="small"
        label={row.isRefunded ? 'Yes' : 'No'}
        sx={{
          bgcolor: row.isRefunded ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          color: row.isRefunded ? '#dc2626' : '#059669',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
    ),
  },
  { key: 'status', label: 'Status', minWidth: 110 },
  { key: 'createdAt', label: 'Date', minWidth: 120 },
];

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [rules, setRules] = React.useState<FilterRule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setTransactions(rawTransactions as Transaction[]);
      } catch (err: any) {
        setError(err.message || 'Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredTransactions = React.useMemo(
    () => filterData(transactions as unknown as Record<string, unknown>[], rules, transactionFilterConfigs),
    [transactions, rules]
  );

  return (
    <Box>
      <PageHeader
        icon={<CreditCard size={24} color="#ffffff" />}
        title="Transactions"
        iconColor="#f59e0b"
      />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={48} thickness={4} />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

        {!loading && !error && (
          <>
            <FilterBuilder configs={transactionFilterConfigs} rules={rules} onChange={setRules} />
            <GenericDataTable
              title="Transactions"
              data={filteredTransactions}
              columns={transactionColumns}
              filterConfigs={transactionFilterConfigs}
              activeFilterCount={rules.length}
            />
          </>
        )}
      </Container>
    </Box>
  );
};
