// Tailwind CSS v4 type definitions
declare module '*.css' {
  const content: string;
  export default content;
}

// Extend CSS to recognize Tailwind v4 directives and custom syntax
declare global {
  namespace CSS {
    interface AtRules {
      theme: string;
      apply: string;
      layer: string;
      config: string;
      import: string;
      tailwind: string;
      screen: string;
      variant: string;
      responsive: string;
      keyframes: string;
    }
    
    interface Properties {
      // Custom CSS properties for theme variables
      '--color-primary'?: string;
      '--color-primary-50'?: string;
      '--color-primary-100'?: string;
      '--color-primary-200'?: string;
      '--color-primary-300'?: string;
      '--color-primary-400'?: string;
      '--color-primary-500'?: string;
      '--color-primary-600'?: string;
      '--color-primary-700'?: string;
      '--color-primary-800'?: string;
      '--color-primary-900'?: string;
      '--color-primary-950'?: string;
      '--color-primary-foreground'?: string;
      
      '--color-secondary'?: string;
      '--color-secondary-50'?: string;
      '--color-secondary-100'?: string;
      '--color-secondary-200'?: string;
      '--color-secondary-300'?: string;
      '--color-secondary-400'?: string;
      '--color-secondary-500'?: string;
      '--color-secondary-600'?: string;
      '--color-secondary-700'?: string;
      '--color-secondary-800'?: string;
      '--color-secondary-900'?: string;
      '--color-secondary-950'?: string;
      '--color-secondary-foreground'?: string;
      
      '--color-accent'?: string;
      '--color-accent-50'?: string;
      '--color-accent-100'?: string;
      '--color-accent-200'?: string;
      '--color-accent-300'?: string;
      '--color-accent-400'?: string;
      '--color-accent-500'?: string;
      '--color-accent-600'?: string;
      '--color-accent-700'?: string;
      '--color-accent-800'?: string;
      '--color-accent-900'?: string;
      '--color-accent-950'?: string;
      '--color-accent-foreground'?: string;
      
      '--color-background'?: string;
      '--color-foreground'?: string;
      '--color-card'?: string;
      '--color-card-foreground'?: string;
      '--color-muted'?: string;
      '--color-muted-foreground'?: string;
      '--color-border'?: string;
      '--color-input'?: string;
      
      // Font family variables
      '--font-family-primary'?: string;
      '--font-family-secondary'?: string;
      '--font-family-mono'?: string;
      
      // Font weight variables
      '--font-weight-normal'?: string;
      '--font-weight-medium'?: string;
      '--font-weight-bold'?: string;
      
      // Line height variables
      '--line-height-relaxed'?: string;
      
      // Letter spacing variables
      '--letter-spacing-wide'?: string;
      
      // Border radius variables
      '--border-radius-sm'?: string;
      '--border-radius-md'?: string;
      '--border-radius-lg'?: string;
      
      // Transition variables
      '--transition-smooth'?: string;
    }
  }
}

// Theme color definitions for better type safety
export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
}

// Tailwind CSS v4 theme configuration types
export interface TailwindThemeConfig {
  colors?: ThemeColors & Record<string, string | Record<string, string>>;
  fontFamily?: Record<string, string[]>;
  fontSize?: Record<string, string | [string, string]>;
  fontWeight?: Record<string, string | number>;
  lineHeight?: Record<string, string | number>;
  letterSpacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  spacing?: Record<string, string>;
  screens?: Record<string, string>;
  animation?: Record<string, string>;
  keyframes?: Record<string, Record<string, Record<string, string>>>;
}

// Theme switcher utility types
export type ThemeMode = 'light' | 'dark';
export type ThemeVariant = 'default' | 'water';

export interface ThemeSwitcherConfig {
  defaultTheme?: ThemeVariant;
  defaultMode?: ThemeMode;
  storageKey?: string;
  attribute?: string;
}

// Tailwind CSS v4 layer types
export type TailwindLayer = 'base' | 'components' | 'utilities' | 'theme';

// Custom utility class types for better IntelliSense
export type ColorScale = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';
export type ColorFamily = 'primary' | 'secondary' | 'accent';

// Spacing scale types
export type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

// Font family types
export type FontFamily = 'primary' | 'secondary' | 'mono';

export {};
