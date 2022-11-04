import { red  } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
      "100": '#000000'
    },
    secondary: {
      main: '#19857b',
      "100": '#b0207d'
    },
    error: {
      main: red.A400,
    },
  },
});

theme.typography.h4 = {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.4rem',
    },
};


export default theme;
