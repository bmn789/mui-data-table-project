import React from 'react';
import { Container, Box, CircularProgress, Alert } from '@mui/material';
import { Filter } from 'lucide-react';
import { PageHeader } from './PageHeader';
import type { Employee } from '../types/employee';
import type { FilterFieldConfig, FilterRule } from '../types/filter';
import { DashboardStats } from '../components/DashboardStats';
import { FilterBuilder } from '../components/FilterBuilder';
import { DataTable } from '../components/DataTable';
import { filterData } from '../utils/filterEngine';
import rawEmployees from '../data/employees.json';

const employeeFilterConfigs: FilterFieldConfig[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Search name...' },
  { id: 'email', label: 'Email', type: 'text', placeholder: 'Search email...' },
  {
    id: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Product', value: 'Product' },
      { label: 'Sales', value: 'Sales' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'HR', value: 'HR' },
      { label: 'Finance', value: 'Finance' },
      { label: 'Design', value: 'Design' },
      { label: 'Operations', value: 'Operations' },
      { label: 'Legal', value: 'Legal' },
    ],
  },
  { id: 'role', label: 'Role', type: 'text', placeholder: 'Search role (e.g., Software Engineer)...' },
  { id: 'salary', label: 'Salary', type: 'amount', placeholder: 'Salary range...' },
  { id: 'joinDate', label: 'Join Date', type: 'date' },
  { id: 'isActive', label: 'Status', type: 'boolean' },
  { id: 'address.city', label: 'City', type: 'text' },
  { id: 'address.state', label: 'State', type: 'text' },
  { id: 'address.country', label: 'Country', type: 'text' },
  {
    id: 'skills',
    label: 'Skills',
    type: 'array',
    options: [
      { label: 'React', value: 'React' },
      { label: 'TypeScript', value: 'TypeScript' },
      { label: 'Node.js', value: 'Node.js' },
      { label: 'Python', value: 'Python' },
      { label: 'Go', value: 'Go' },
      { label: 'Java', value: 'Java' },
      { label: 'AWS', value: 'AWS' },
      { label: 'Docker', value: 'Docker' },
      { label: 'Kubernetes', value: 'Kubernetes' },
      { label: 'SQL', value: 'SQL' },
      { label: 'GraphQL', value: 'GraphQL' },
      { label: 'UI/UX Design', value: 'UI/UX Design' },
      { label: 'Figma', value: 'Figma' },
      { label: 'Agile', value: 'Agile' },
      { label: 'Product Strategy', value: 'Product Strategy' },
    ],
  },
  { id: 'performanceRating', label: 'Performance Rating', type: 'number' },
];

export const Home: React.FC = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [rules, setRules] = React.useState<FilterRule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setEmployees(rawEmployees as Employee[]);
      } catch (err: any) {
        setError(err.message || 'Failed to load employee list.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = React.useMemo(
    () => filterData(employees, rules, employeeFilterConfigs),
    [employees, rules]
  );

  return (
    <Box>
      <PageHeader
        icon={<Filter size={24} color="#ffffff" />}
        title="Employee Directory"
      />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={48} thickness={4} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>
        )}

        {!loading && !error && (
          <>
            <DashboardStats
              totalCount={employees.length}
              filteredCount={filteredEmployees.length}
              filteredEmployees={filteredEmployees}
            />
            <FilterBuilder
              configs={employeeFilterConfigs}
              rules={rules}
              onChange={setRules}
            />
            <DataTable data={filteredEmployees} totalRecordsCount={employees.length} />
          </>
        )}
      </Container>
    </Box>
  );
};
