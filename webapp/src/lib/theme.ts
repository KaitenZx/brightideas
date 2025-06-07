import { createTheme, Paper, NavLink, Input, Textarea, InputWrapper, type MantineTheme } from '@mantine/core'

export const theme = createTheme({
  /** Put your mantine theme override here */
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },
  lineHeights: { sm: '1.4', md: '1.5', lg: '1.6' }, // Slightly increased line height
  radius: { xs: '2px', sm: '4px', md: '8px', lg: '16px' }, // Defined radii
  defaultRadius: 'md', // Set default radius

  primaryColor: 'teal', // Changed primary color to teal
  // primaryShade: 6, // Optionally specify the shade for dark/light modes

  headings: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    sizes: {
      h1: { fontSize: '2.2rem', lineHeight: '1.3' }, // Example heading sizes
      h2: { fontSize: '1.8rem', lineHeight: '1.35' },
      h3: { fontSize: '1.5rem', lineHeight: '1.4' },
    },
  },

  components: {
    Paper: Paper.extend({
      // Extended Paper styles
      defaultProps: {
        shadow: 'xs', // Add a subtle shadow by default
        withBorder: false, // Remove border by default, can be added explicitly
      },
    }),
    NavLink: NavLink.extend({
      // Extended NavLink styles
      styles: (theme) => ({
        root: {
          borderRadius: theme.radius.sm, // Consistent radius with theme
        },
        label: {
          fontSize: theme.fontSizes.sm, // Slightly smaller font for nav links
        },
      }),
    }),
    Input: Input.extend({
      // Ensure inputs use default radius
      defaultProps: {
        radius: 'md',
      },
    }),
    Textarea: Textarea.extend({
      // Ensure textareas use default radius
      defaultProps: {
        radius: 'md',
      },
    }),
    InputWrapper: InputWrapper.extend({
      styles: (theme) => ({
        error: {
          fontSize: theme.fontSizes.md,
          color: theme.colors.red[6],
        },
      }),
    }),
    Anchor: {
      defaultProps: (theme: MantineTheme) => ({
        c: theme.primaryColor, // Use 'c' prop instead of 'color'
      }),
    },
  },
})
