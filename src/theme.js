import * as Color from '@mui/material/colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'light',
    primary: { 
      main: Color.deepPurple[500], 
      dark: Color.deepPurple[900], 
      light: Color.deepPurple[100],
      contrastText: '#FFFFFF', 
    },
    secondary: { 
      main: '#FFFFFF', 
      dark: '#FFFFFF',
      light: '#FFFFFF',
      contrastText: '#FFFFFF'
    },
    text: {
      primary: '#000000',
      secondary: Color.grey[500]
    },
    common: {
      white: '#FFFFFF',
      black: '#000000'
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: Color.deepPurple[200],
            width: '10px',
            height: '10px'
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: Color.deepPurple[800],
            border: "none",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  }
}));

theme.typography.h1 = {
  fontFamily: '"Helvetica Neue"',
};
theme.typography.h2 = {
  fontFamily: '"Helvetica Neue"',
};
theme.typography.h3 = {
  fontFamily: '"Helvetica Neue"',
};
theme.typography.h4 = {
  fontFamily: '"Helvetica Neue"',
};
theme.typography.h5 = {
  fontFamily: '"Helvetica Neue"',
};
theme.typography.h6 = {
  fontFamily: '"Helvetica Neue"',
};

theme.typography.body1 = {
  fontFamily: '"Helvetica Neue"'
};
theme.typography.body2 = {
  fontFamily: '"Helvetica Neue"'
};

theme.typography.subtitle1 = {
  fontFamily: '"Helvetica Neue"',
};
theme.typography.subtitle2 = {
  fontFamily: '"Helvetica Neue"'
};

theme.components.MuiTextField = {
  styleOverrides: {
    root: {
      fontFamily: '"Helvetica Neue"',
    },
  },
}

theme.components.MuiFormLabel = {
  styleOverrides: {
    root: {
      fontFamily: '"Helvetica Neue"'
    },
  },
}

theme.components.MuiLink = {
  styleOverrides: {
    root: {
      fontFamily: '"Helvetica Neue"',
    },
  },
}

theme.components.MuiButton = {
  styleOverrides: {
    root: {
      fontFamily: '"Helvetica Neue"',
    },
  },
}

theme.components.MuiTab = {
  styleOverrides: {
    root: {
      fontFamily: '"Helvetica Neue"',
    },
  },
}

theme.components.MuiList = {
  styleOverrides: {
    root: {
      fontFamily: '"Helvetica Neue"',
    },
  },
}

export default theme;
