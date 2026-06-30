import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { useThemeMode } from '../contexts/ThemeContext';

interface PageHeaderProps {
  /** Icon element rendered inside the coloured badge */
  icon: React.ReactNode;
  /** Page title */
  title: string;
  /** Background colour of the icon badge */
  iconColor?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  iconColor = '#6366f1',
}) => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
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

