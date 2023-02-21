import * as Color from '@mui/material/colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = responsiveFontSizes(createTheme({
  palette: {
    primary: { main: Color.deepPurple[500], dark: Color.deepPurple[500], contrastText: 'white', light: Color.deepPurple[500]},
  }
}));

theme.typography.h1 = {
  fontFamily: 'Helvetica Neue',
};

theme.typography.h2 = {
  fontFamily: 'Helvetica Neue',
};

theme.typography.h3 = {
  fontFamily: 'Helvetica Neue',
};

theme.typography.h4 = {
  fontFamily: 'Helvetica Neue',
};

theme.typography.h5 = {
  fontFamily: 'Helvetica Neue',
};

theme.typography.h6 = {
  fontFamily: 'Helvetica Neue',
};

theme.typography.body1 = {
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
      fontFamily: 'Helvetica Neue'
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
