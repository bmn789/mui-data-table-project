import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Box,
  Chip,
  Typography,
  Button,
  Rating,
  Tooltip,
} from '@mui/material';
import { FileDown, Download, AlertCircle, Eye } from 'lucide-react';
import type { Employee } from '../types/employee';
import { getNestedValue } from '../utils/filterEngine';
import { ColumnVisibilityModal, type ColumnConfig } from './ColumnVisibilityModal';

interface DataTableProps {
  data: Employee[];
  totalRecordsCount: number;
}

type SortKey = keyof Employee | 'address.city' | 'address.country';

// List of columns configurable for visibility
const TABLE_COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role' },
  { key: 'salary', label: 'Salary' },
  { key: 'joinDate', label: 'Join Date' },
  { key: 'isActive', label: 'Status' },
  { key: 'address', label: 'Location' },
  { key: 'skills', label: 'Skills' },
  { key: 'performanceRating', label: 'Rating' },
];

export const DataTable: React.FC<DataTableProps> = ({ data, totalRecordsCount }) => {
  const [sortKey, setSortKey] = React.useState<SortKey>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({
    name: true,
    department: true,
    role: true,
    salary: true,
    joinDate: true,
    isActive: true,
    address: true,
    skills: true,
    performanceRating: true,
  });
  const [modalOpen, setModalOpen] = React.useState(false);

  // Reset page to 0 if data changes (e.g. filters change)
  React.useEffect(() => {
    setPage(0);
  }, [data]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Memoized sorting algorithm
  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      let valA = getNestedValue(a, sortKey);
      let valB = getNestedValue(b, sortKey);

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  // Memoized pagination slice
  const paginatedData = React.useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // CSV export (only exports active visible columns! Premium feature)
  const exportToCSV = () => {
    if (data.length === 0) return;

    // Filter headers and rows to only include visible columns
    const headers: string[] = [];
    const colKeys: string[] = [];

    TABLE_COLUMNS.forEach(col => {
      if (visibleColumns[col.key]) {
        headers.push(col.label);
        colKeys.push(col.key);
      }
    });

    const rows = data.map(emp => {
      return colKeys.map(key => {
        if (key === 'address') {
          return `"${emp.address.city}, ${emp.address.state}, ${emp.address.country}"`;
        }
        if (key === 'skills') {
          return `"${emp.skills.join(', ')}"`;
        }
        if (key === 'isActive') {
          return emp.isActive ? 'Active' : 'Inactive';
        }
        const val = getNestedValue(emp, key);
        return typeof val === 'string' ? `"${val}"` : val;
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `employee_directory_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON export (only exports visible column key-values! Premium feature)
  const exportToJSON = () => {
    if (data.length === 0) return;

    const exportedData = data.map(emp => {
      const entry: Record<string, any> = { id: emp.id };
      TABLE_COLUMNS.forEach(col => {
        if (visibleColumns[col.key]) {
          entry[col.key] = (emp as any)[col.key];
        }
      });
      return entry;
    });

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportedData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute(
      'download',
      `employee_directory_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'info';
    if (rating >= 2.5) return 'warning';
    return 'error';
  };

  const visibleColumnsCount = Object.values(visibleColumns).filter(Boolean).length;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Table Action Bar */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Employees Database
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Showing {data.length} of {totalRecordsCount} entries
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<Eye size={14} />}
            onClick={() => setModalOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Columns
          </Button>

          {data.length > 0 && (
            <>
              <Tooltip
                title={`Exporting ${visibleColumnsCount} of ${TABLE_COLUMNS.length} columns`}
                arrow
                placement="top"
              >
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<FileDown size={14} />}
                  onClick={exportToCSV}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Export CSV
                </Button>
              </Tooltip>
              <Tooltip
                title={`Exporting ${visibleColumnsCount} of ${TABLE_COLUMNS.length} columns`}
                arrow
                placement="top"
              >
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<Download size={14} />}
                  onClick={exportToJSON}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Export JSON
                </Button>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

      {/* Main Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              {visibleColumns.name && (
                <TableCell sx={{ fontWeight: 650, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={sortKey === 'name'}
                    direction={sortKey === 'name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.department && (
                <TableCell sx={{ fontWeight: 650, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={sortKey === 'department'}
                    direction={sortKey === 'department' ? sortOrder : 'asc'}
                    onClick={() => handleSort('department')}
                  >
                    Department
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.role && (
                <TableCell sx={{ fontWeight: 650, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
                  Role
                </TableCell>
              )}
              {visibleColumns.salary && (
                <TableCell sx={{ fontWeight: 650, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={sortKey === 'salary'}
                    direction={sortKey === 'salary' ? sortOrder : 'asc'}
                    onClick={() => handleSort('salary')}
                  >
                    Salary
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.joinDate && (
                <TableCell sx={{ fontWeight: 650, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={sortKey === 'joinDate'}
                    direction={sortKey === 'joinDate' ? sortOrder : 'asc'}
                    onClick={() => handleSort('joinDate')}
                  >
                    Join Date
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.isActive && (
                <TableCell sx={{ fontWeight: 650, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
                  Status
                </TableCell>
              )}
              {visibleColumns.address && (
                <TableCell sx={{ fontWeight: 650, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
                  Location
                </TableCell>
              )}
              {visibleColumns.skills && (
                <TableCell sx={{ fontWeight: 650, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
                  Skills
                </TableCell>
              )}
              {visibleColumns.performanceRating && (
                <TableCell sx={{ fontWeight: 650, bgcolor: 'background.paper', whiteSpace: 'nowrap' }} align="right">
                  <TableSortLabel
                    active={sortKey === 'performanceRating'}
                    direction={sortKey === 'performanceRating' ? sortOrder : 'asc'}
                    onClick={() => handleSort('performanceRating')}
                  >
                    Rating
                  </TableSortLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumnsCount || 1} align="center" sx={{ py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <AlertCircle size={32} color="#9ca3af" />
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      No matching records found
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Try relaxing your filter parameters or clearing all filters
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map(emp => (
                <TableRow
                  key={emp.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {visibleColumns.name && (
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {emp.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {emp.email}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.department && (
                    <TableCell>
                      <Chip
                        label={emp.department}
                        size="small"
                        sx={{
                          fontWeight: 550,
                          bgcolor: 'rgba(99, 102, 241, 0.08)',
                          color: 'primary.main',
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.role && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {emp.role}
                      </Typography>
                    </TableCell>
                  )}
                  {visibleColumns.salary && (
                    <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(emp.salary)}</TableCell>
                  )}
                  {visibleColumns.joinDate && <TableCell>{formatDate(emp.joinDate)}</TableCell>}
                  {visibleColumns.isActive && (
                    <TableCell>
                      <Chip
                        label={emp.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={emp.isActive ? 'success' : 'default'}
                        variant={emp.isActive ? 'filled' : 'outlined'}
                        sx={{
                          fontWeight: 600,
                          height: 24,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.address && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {emp.address.city}, {emp.address.state}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {emp.address.country}
                      </Typography>
                    </TableCell>
                  )}
                  {visibleColumns.skills && (
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 220 }}>
                        {emp.skills.map(skill => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: 20,
                              bgcolor: 'action.hover',
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.performanceRating && (
                    <TableCell align="right">
                      <Tooltip title={`Score: ${emp.performanceRating}`} placement="top" arrow>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Rating
                            value={emp.performanceRating}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ mb: 0.5 }}
                          />
                          <Chip
                            label={emp.performanceRating.toFixed(1)}
                            size="small"
                            color={getRatingColor(emp.performanceRating)}
                            sx={{
                              fontWeight: 700,
                              height: 18,
                              fontSize: '0.65rem',
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Footer */}
      {data.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      )}

      {/* Column Visibility Configuration Modal */}
      <ColumnVisibilityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        columns={TABLE_COLUMNS}
        visibleColumns={visibleColumns}
        onChange={setVisibleColumns}
      />
    </Paper>
  );
};
