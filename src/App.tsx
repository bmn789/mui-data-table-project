import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import { UsersPage } from './pages/Users';
import { TransactionsPage } from './pages/Transactions';
import { ThemeContext } from './contexts/ThemeContext';

// ─── Theme factory ────────────────────────────────────────────────────────────

const buildTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary:    { main: '#a78bfa', light: '#c4b5fd', dark: '#7c3aed' },
            secondary:  { main: '#22d3ee', light: '#67e8f9', dark: '#0891b2' },
            background: { default: '#0f172a', paper: '#1e293b' },
            text:       { primary: '#f1f5f9', secondary: '#94a3b8' },
            divider:    '#334155',
            error:      { main: '#f87171' },
            success:    { main: '#34d399' },
            warning:    { main: '#fbbf24' },
          }
        : {
            primary:    { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
            secondary:  { main: '#10b981', light: '#34d399', dark: '#059669' },
            background: { default: '#f8fafc', paper: '#ffffff' },
            text:       { primary: '#0f172a', secondary: '#64748b' },
            divider:    '#e2e8f0',
          }),
    },
    typography: {
      fontFamily: [
        'Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont',
        '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif',
      ].join(','),
      h4: { fontWeight: 800, letterSpacing: '-0.5px' },
      h5: { fontWeight: 800, letterSpacing: '-0.3px' },
      h6: { fontWeight: 700 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow:
              mode === 'dark'
                ? '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px 0 rgba(0,0,0,0.3)'
                : '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.03)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: mode === 'dark' ? '#0f172a' : '#f8fafc',
          },
        },
      },
    },
  });

// ─── Placeholder page ─────────────────────────────────────────────────────────

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <Box sx={{ p: 6, display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
        {title} Page
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        This section is a placeholder to show layout capabilities.
      </Typography>
    </Box>
  </Box>
);

// ─── App ──────────────────────────────────────────────────────────────────────

const App = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  React.useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleMode = React.useCallback(
    () => setMode(prev => (prev === 'dark' ? 'light' : 'dark')),
    []
  );

  const theme = React.useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;