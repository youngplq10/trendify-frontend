"use client"

import { createTheme } from "@mui/material";

export const theme = createTheme ({
  palette: {
    primary: {
      main: '#9c92e1',
    },
    secondary: {
      main: '#2c1e87',
    },
    background: {
      paper: '#05040c',
    },
    text: {
      primary: '#e8e6f5',
      secondary: '#e8e6f5',
    },
    info: {
      main: '#9c92e1',
    },
    error: {
        main: '#C60031'
    },
    success: {
      main: '#5cb85c',
    }
  },
  typography: {
    fontFamily: 'Roboto',
    h1: {
      fontSize: 64,
      fontWeight: 300,
      letterSpacing: '0em',
    },
    h2: {
      fontWeight: 300,
      fontSize: 48,
      letterSpacing: '0em',
    },
    h3: {
      fontSize: 36,
      fontWeight: 300,
    },
    h4: {
      fontSize: 24,
      fontWeight: 300,
      letterSpacing: '0em',
    },
    h5: {
      fontSize: 18,
      fontWeight: 300,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: 12,
      fontWeight: 300,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: 16,
      fontWeight: 300,
      letterSpacing: '0em',
    },
    body2: {
      fontSize: 16,
      fontWeight: 100,
      letterSpacing: '0em',
    },
    subtitle1: {
      fontSize: 12,
      letterSpacing: '0em',
    },
    subtitle2: {
      fontSize: 12,
      fontWeight: 100,
      letterSpacing: '0em',
    },
  },

  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: '#e8e6f5',
            backgroundColor: '#9c92e1',
          },
        },
        {
            props: { variant: 'outlined' },
            style: {
              color: '#e8e6f5',
            },
        }
      ],


      styleOverrides: {
        contained: {
            color: '#05040c',
        },
        outlined: {
            color: '#e8e6f5'
        },
      }
    },
  },
});