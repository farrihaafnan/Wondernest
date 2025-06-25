// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
primary: {
    main: '#ff9a84', // Cotton pink
  },
  secondary: {
    main: '#ff758c', // Lavender
  },
  background: {
    default: '#FFF8E1', // Light cream
    paper: '#FFFFFF',
  },
  text: {
    primary: '#350F63',
    secondary: '#471D8A',
  },
  },
  typography: {
    fontFamily: 'Quicksand, sans-serif',
    h1: {
      fontFamily: 'Fredoka, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Fredoka, sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'Fredoka, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Baloo 2, sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: 'Quicksand, sans-serif',
    },
    body2: {
      fontFamily: 'Quicksand, sans-serif',
    },
  },
});

export default theme;