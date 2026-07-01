import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Tooltip, Drawer } from '@mui/material';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Home, BarChart3, Settings, ChevronLeft, ChevronRight, Users, CreditCard, Sun, Moon, Menu } from 'lucide-react';
import { useThemeMode } from '../contexts/ThemeContext';

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const { mode, toggleMode } = useThemeMode();
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Employee Directory';
      case '/users':
        return 'Users';
      case '/transactions':
        return 'Transactions';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'Data Portal';
    }
  };

  type MenuItem = { text: string; path: string; icon: React.ReactNode } | { divider: true };

  const menuItems: MenuItem[] = [
    { text: 'Home', path: '/', icon: <Home size={20} /> },
    { text: 'Users', path: '/users', icon: <Users size={20} /> },
    { text: 'Transactions', path: '/transactions', icon: <CreditCard size={20} /> },
    { divider: true },
    { text: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { text: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarWidth = collapsed ? 72 : 260;

  const renderSidebarContent = (isDesktop: boolean) => {
    const isCollapsed = isDesktop && collapsed;
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Sidebar Header / Branding */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            flexDirection: isCollapsed ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isCollapsed ? 2 : 1.5,
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
            {!isCollapsed && (
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', tracking: '-0.5px' }}>
                Data Portal
              </Typography>
            )}
          </Box>
          {isDesktop && (
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
          )}
        </Box>

        <Divider />

        {/* Sidebar Links */}
        <Box sx={{ flexGrow: 1, py: 2, px: 1.5, overflowY: 'auto' }}>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0 }}>
            {menuItems.map((item, idx) => {
              if ('divider' in item) {
                return (
                  <Box key={`divider-${idx}`} sx={{ px: isCollapsed ? 1 : 0, py: 0.5 }}>
                    <Divider sx={{ opacity: 0.6 }} />
                  </Box>
                );
              }
              return (
                <Tooltip
                  key={item.text}
                  title={isCollapsed ? item.text : ''}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    onClick={() => {
                      if (!isDesktop) {
                        setMobileOpen(false);
                      }
                    }}
                    sx={{
                      borderRadius: 2,
                      py: 1.25,
                      px: isCollapsed ? 0 : 2,
                      justifyContent: isCollapsed ? 'center' : 'initial',
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
                        minWidth: isCollapsed ? 'auto' : 40,
                        justifyContent: 'center',
                        color: 'inherit',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
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
              flexDirection: isCollapsed ? 'column' : 'row',
              gap: isCollapsed ? 2 : 1.5,
              justifyContent: isCollapsed ? 'center' : 'space-between',
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
              {!isCollapsed && (
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
            <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement={isCollapsed ? 'right' : 'top'} arrow>
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
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile AppBar - only visible on mobile/tablet (< md) */}
      <Box
        component="header"
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 2,
          zIndex: 1100,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ color: 'text.primary' }}
          >
            <Menu size={24} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.1rem' }}>
            {getPageTitle(location.pathname)}
          </Typography>
        </Box>

        {/* Theme toggle on mobile appbar */}
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

      {/* Temporary Drawer for mobile/tablet (< md) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {renderSidebarContent(false)}
      </Drawer>

      {/* Persistent Drawer/Sidebar for desktop (>= md) */}
      <Box
        component="nav"
        sx={{
          width: { md: sidebarWidth },
          flexShrink: { md: 0 },
          display: { xs: 'none', md: 'block' },
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
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
          {renderSidebarContent(true)}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: { xs: '64px', md: 0 }, // Offset for the fixed mobile header
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

