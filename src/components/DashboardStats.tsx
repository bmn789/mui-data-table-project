import React from 'react';
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { Users, Filter, DollarSign, Briefcase } from 'lucide-react';
import type { Employee } from '../types/employee';

interface DashboardStatsProps {
  totalCount: number;
  filteredCount: number;
  filteredEmployees: Employee[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCount,
  filteredCount,
  filteredEmployees,
}) => {
  // Calculate average salary
  const avgSalary = filteredEmployees.length > 0
    ? Math.round(filteredEmployees.reduce((acc, emp) => acc + emp.salary, 0) / filteredEmployees.length)
    : 0;

  // Calculate active projects
  const activeProjects = filteredEmployees.reduce((acc, emp) => acc + emp.projects, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const statCards = [
    {
      title: 'Total Directory',
      value: totalCount,
      subtitle: 'Total registered employees',
      icon: <Users size={24} color="#6366f1" />,
      bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.02) 100%)',
      borderColor: 'rgba(99, 102, 241, 0.2)',
    },
    {
      title: 'Matched Results',
      value: `${filteredCount} / ${totalCount}`,
      subtitle: `${((filteredCount / (totalCount || 1)) * 100).toFixed(0)}% of directory`,
      icon: <Filter size={24} color="#10b981" />,
      bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    {
      title: 'Average Salary',
      value: formatCurrency(avgSalary),
      subtitle: 'Filtered subset average',
      icon: <DollarSign size={24} color="#f59e0b" />,
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.2)',
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      subtitle: 'Total ongoing assignments',
      icon: <Briefcase size={24} color="#3b82f6" />,
      bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.2)',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {statCards.map((card, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Card
              sx={{
                background: card.bg,
                border: '1px solid',
                borderColor: card.borderColor,
                borderRadius: 3,
                boxShadow: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 20px -10px rgba(0,0,0,0.05)',
                  borderColor: card.borderColor.replace('0.2', '0.4'),
                },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.5px' }}>
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5, tracking: '-1px' }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
