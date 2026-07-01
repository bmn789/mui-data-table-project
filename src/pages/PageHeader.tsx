import React from 'react';
import { Box, Typography, IconButton, Tooltip, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { useThemeMode } from '../contexts/ThemeContext';
import { NavLink, useLocation } from 'react-router';

interface PageHeaderProps {
  /** Icon element rendered inside the coloured badge */
  icon: React.ReactNode;
  /** Page title */
  title: string;
  /** Background colour of the icon badge */
  iconColor?: string;
}

export const PageBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === '/') {
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, '& .MuiBreadcrumbs-separator': { fontSize: '0.8rem' } }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem' }}>
          Home
        </Typography>
      </Breadcrumbs>
    );
  }

  let pageLabel = '';
  if (pathname === '/users') pageLabel = 'Users';
  else if (pathname === '/transactions') pageLabel = 'Transactions';
  else if (pathname === '/analytics') pageLabel = 'Analytics';
  else if (pathname === '/settings') pageLabel = 'Settings';
  else pageLabel = pathname.replace('/', '');

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, '& .MuiBreadcrumbs-separator': { fontSize: '0.8rem', color: 'text.secondary' } }}>
      <MuiLink
        component={NavLink}
        to="/"
        underline="hover"
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
          fontSize: '0.75rem',
          fontWeight: 500,
          '&:hover': { color: 'primary.main' }
        }}
      >
        Home
      </MuiLink>
      <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem' }}>
        {pageLabel}
      </Typography>
    </Breadcrumbs>
  );
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  iconColor = '#6366f1',
}) => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        py: 2.5,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: iconColor,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 8px ${iconColor}44`,
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          component="h1"
          sx={{ fontWeight: 800, color: 'text.primary' }}
        >
          {title}
        </Typography>
      </Box>

      <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} arrow>
        <IconButton
          onClick={toggleMode}
          size="small"
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            color: 'text.secondary',
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
          }}
        >
          {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

