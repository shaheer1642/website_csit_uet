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

export default theme;
