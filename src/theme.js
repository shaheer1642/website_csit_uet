import * as Color from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    button1: { main: Color.blue[500], dark: Color.blue[900], contrastText: 'white'},
    textField1: { main: Color.blue[500], dark: Color.blue[900], contrastText: 'white'}
  }
});

theme.typography.h1 = {
  fontSize: '40px',
  [theme.breakpoints.up('xs')]: {
    fontSize: '40px',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '40px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '40px',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '55px',
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '60px',
  },
  fontFamily: 'Times New Roman',
};

theme.typography.h2 = {
  fontFamily: 'Times New Roman',
};

theme.typography.h3 = {
  fontFamily: 'Times New Roman',
};

theme.typography.h4 = {
  fontSize: '30px',
  [theme.breakpoints.up('xs')]: {
    fontSize: '30px',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '30px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '30px',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '35px',
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '35px',
  },
  fontFamily: 'Times New Roman',
};

theme.typography.h5 = {
  styleOverrides: {
    fontFamily: 'Times New Roman',
  }
};

theme.typography.h6 = {
  fontSize: '20px',
  [theme.breakpoints.up('xs')]: {
    fontSize: '20px',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '20px',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '20px',
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '20px',
  },
  fontFamily: 'Times New Roman',
};

theme.typography.body1 = {
    fontSize: '20px',
    [theme.breakpoints.up('xs')]: {
      fontSize: '20px',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '20px',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '20px ',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '20px',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '22px',
    },
    fontFamily: 'Times New Roman'
};

theme.components.MuiTextField = {
  styleOverrides: {
    root: {
      fontFamily: 'Times New Roman',
    },
  },
}

theme.components.MuiFormLabel = {
  styleOverrides: {
    root: {
      fontFamily: 'Times New Roman',
      fontSize: '10px'
    },
  },
}

theme.components.MuiLink = {
  styleOverrides: {
    root: {
      fontFamily: 'Times New Roman',
    },
  },
}

theme.components.MuiButton = {
  styleOverrides: {
    root: {
      fontFamily: 'Times New Roman',
    },
  },
}

theme.components.MuiTab = {
  styleOverrides: {
    root: {
      fontFamily: 'Times New Roman',
    },
  },
}

theme.components.MuiList = {
  styleOverrides: {
    root: {
      fontFamily: 'Times New Roman',
    },
  },
}

export default theme;
