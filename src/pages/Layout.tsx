import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Tooltip } from '@mui/material';
import { NavLink, Outlet } from 'react-router';
import { Home, BarChart3, Settings, ChevronLeft, ChevronRight, Users, CreditCard, Sun, Moon } from 'lucide-react';
import { useThemeMode } from '../contexts/ThemeContext';

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const { mode, toggleMode } = useThemeMode();

  type MenuItem = { text: string; path: string; icon: React.ReactNode } | { divider: true };

  const menuItems: MenuItem[] = [
    { text: 'Home', path: '/', icon: <Home size={20} /> },
    { text: 'Users', path: '/users', icon: <Users size={20} /> },
    { text: 'Transactions', path: '/transactions', icon: <CreditCard size={20} /> },
    { divider: true },
    { text: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { text: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Fixed Left Sidebar with smooth width transition */}
      <Box
        sx={{
          width: sidebarWidth,
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1200,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
        }}
      >
        {/* Sidebar Header / Branding */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            flexDirection: collapsed ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: collapsed ? 2 : 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(167, 139, 250, 0.25)',
                flexShrink: 0,
              }}
            >
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 800 }}>
                D
              </Typography>
            </Box>
            {!collapsed && (
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', tracking: '-0.5px' }}>
                Data Portal
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            size="small"
            sx={{
              color: 'text.secondary',
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </IconButton>
        </Box>

        <Divider />

        {/* Sidebar Links */}
        <Box sx={{ flexGrow: 1, py: 2, px: 1.5 }}>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0 }}>
            {menuItems.map((item, idx) => {
              if ('divider' in item) {
                return (
                  <Box key={`divider-${idx}`} sx={{ px: collapsed ? 1 : 0, py: 0.5 }}>
                    <Divider sx={{ opacity: 0.6 }} />
                  </Box>
                );
              }
              return (
                <Tooltip
                  key={item.text}
                  title={collapsed ? item.text : ''}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    sx={{
                      borderRadius: 2,
                      py: 1.25,
                      px: collapsed ? 0 : 2,
                      justifyContent: collapsed ? 'center' : 'initial',
                      color: 'text.secondary',
                      transition: 'all 0.2s ease',
                      '&.active': {
                        bgcolor: 'rgba(167, 139, 250, 0.12)',
                        color: 'primary.main',
                        fontWeight: 600,
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                      },
                      '&:hover:not(.active)': {
                        bgcolor: 'action.hover',
                        color: 'text.primary',
                        '& .MuiListItemIcon-root': {
                          color: 'text.primary',
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 'auto' : 40,
                        justifyContent: 'center',
                        color: 'inherit',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '0.9rem', fontWeight: 'inherit' }}>
                            {item.text}
                          </Typography>
                        }
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              );
            })}
          </List>
        </Box>

        {/* Sidebar Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: collapsed ? 'column' : 'row',
              gap: collapsed ? 2 : 1.5,
              justifyContent: collapsed ? 'center' : 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0,
                }}
              >
                JD
              </Box>
              {!collapsed && (
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Jane Doe
                  </Typography>
                  <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block' }}>
                    jane.doe@company.com
                  </Typography>
                </Box>
              )}
            </Box>
            <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement={collapsed ? 'right' : 'top'} arrow>
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
        </Box>
      </Box>

      {/* Main Content Area with transition matching sidebar collapse */}
      <Box
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`,
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
