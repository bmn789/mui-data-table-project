import React from 'react';
import { Box, Container, CircularProgress, Alert } from '@mui/material';
import { Users as UsersIcon } from 'lucide-react';
import { PageHeader, PageBreadcrumbs } from './PageHeader';
import type { User } from '../types/user';
import type { FilterFieldConfig, FilterRule } from '../types/filter';
import { FilterBuilder } from '../components/FilterBuilder';
import { GenericDataTable, type ColumnDef } from '../components/GenericDataTable';
import { filterData } from '../utils/filterEngine';
import rawUsers from '../data/users.json';
import { Chip as MuiChip } from '@mui/material';

const userFilterConfigs: FilterFieldConfig[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Search name...' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
    ],
  },
  { id: 'createdAt', label: 'Created At', type: 'date' },
];

const userColumns: ColumnDef<Record<string, unknown>>[] = [
  {
    key: 'id',
    label: 'ID',
    minWidth: 70,
    render: (row) => `#${row.id}`,
  },
  { key: 'name', label: 'Name', minWidth: 160 },
  { key: 'email', label: 'Email', minWidth: 210 },
  { key: 'role', label: 'Role', minWidth: 100 },
  { key: 'country', label: 'Country', minWidth: 130 },
  {
    key: 'status',
    label: 'Status',
    minWidth: 100,
    render: (row) => (
      <MuiChip
        size="small"
        label={String(row.status)}
        sx={{
          bgcolor: row.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          color: row.status === 'Active' ? '#059669' : '#dc2626',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
    ),
  },
  { key: 'createdAt', label: 'Created At', minWidth: 130 },
];

export const UsersPage: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [rules, setRules] = React.useState<FilterRule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsers(rawUsers as User[]);
      } catch (err: any) {
        setError(err.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredUsers = React.useMemo(
    () => filterData(users as unknown as Record<string, unknown>[], rules, userFilterConfigs),
    [users, rules]
  );

  return (
    <Box>
      <PageHeader
        icon={<UsersIcon size={24} color="#ffffff" />}
        title="Users"
        iconColor="#10b981"
      />
      <Container maxWidth={false} sx={{ pt: 2, pb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
        <PageBreadcrumbs />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={48} thickness={4} />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

        {!loading && !error && (
          <>
            <FilterBuilder configs={userFilterConfigs} rules={rules} onChange={setRules} />
            <GenericDataTable
              title="Users"
              data={filteredUsers}
              columns={userColumns}
              filterConfigs={userFilterConfigs}
              activeFilterCount={rules.length}
            />
          </>
        )}
      </Container>
    </Box>
  );
};
