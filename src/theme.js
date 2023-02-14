import * as Color from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: Color.deepPurple[500], dark: Color.deepPurple[500], contrastText: 'white', light: Color.deepPurple[500]},
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
  fontFamily: 'Helvetica Neue',
};

theme.typography.h2 = {
  fontFamily: 'Helvetica Neue',
};

theme.typography.h3 = {
  fontFamily: 'Helvetica Neue',
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
  fontFamily: 'Helvetica Neue',
};

theme.typography.h5 = {
  styleOverrides: {
    fontFamily: 'Helvetica Neue',
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
  fontFamily: 'Helvetica Neue',
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
    fontFamily: 'Helvetica Neue'
};

theme.components.MuiTextField = {
  styleOverrides: {
    root: {
      fontFamily: 'Helvetica Neue',
    },
  },
}

theme.components.MuiFormLabel = {
  styleOverrides: {
    root: {
      fontFamily: 'Helvetica Neue',
      fontSize: '10px'
    },
  },
}

theme.components.MuiLink = {
  styleOverrides: {
    root: {
      fontFamily: 'Helvetica Neue',
    },
  },
}

theme.components.MuiButton = {
  styleOverrides: {
    root: {
      fontFamily: 'Helvetica Neue',
    },
  },
}

theme.components.MuiTab = {
  styleOverrides: {
    root: {
      fontFamily: 'Helvetica Neue',
    },
  },
}

theme.components.MuiList = {
  styleOverrides: {
    root: {
      fontFamily: 'Helvetica Neue',
    },
  },
}

export default theme;
