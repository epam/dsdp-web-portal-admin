import {
  OSDefaultLight as defaultTheme,
} from '#web-components/styles';
import { createMuiTheme } from '#web-components/exports/theme';
import { ThemeFlags } from '#web-components/types/theme';
import createBreakpoints from '#web-components/styles/createBreakpoints';

export default () => {
  const theme = (APPLICATION_THEME as typeof defaultTheme)?.colors
    ? (APPLICATION_THEME as typeof defaultTheme)
    : defaultTheme;
  const themeName = REGISTRY_ENVIRONMENT_VARIABLES.theme || 'OSDefaultLight';
  const themeUrl = `${import.meta.env.BASE_URL}/themes/${themeName}`;

  const breakpoints = createBreakpoints({
    values: {
      xs: 0,
      mobile: 320,
      tabletS: 632,
      tabletL: 960,
      desktopS: 1260,
      desktopL: 1548,
      desktopMax: 1842,
    },
  });

  return createMuiTheme({
    typography: theme.typography,
    spacing: theme.spacing || 6,
    breakpoints,
    colors: theme.colors,
    flags: theme.flags as ThemeFlags,
    borders: theme.borders,
    shadow: theme.shadow,
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [...theme.fonts.map((font) => ({
            fontFamily: font.fontFamily,
            fontStyle: font.fontStyle,
            fontWeight: font.fontWeight,
            src: `url('${themeUrl}/fonts/${font.fontName}') format('${font.fontFormat}')`,
          }))],
        },
      },
      MuiPaper: {
        elevation4: {
          boxShadow: 'none',
        },
      },
    },
  });
};
