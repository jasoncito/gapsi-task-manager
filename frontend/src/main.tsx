import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import App from './App.tsx';

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  palette: {
    background: { default: '#f7f7f5' },
    text: { primary: '#37352f', secondary: '#9b9a97' },
    primary: { main: '#37352f' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: '#f7f7f5' } },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#c7c6c3',
          '&.Mui-checked': { color: '#9b9a97' },
          padding: '2px',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
