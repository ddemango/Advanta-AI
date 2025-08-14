// Theme system for multi-tenant branded landing pages

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    hero: string;
  };
  font: {
    family: string;
    heading: string;
    body: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  rounded: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Default theme presets
export const defaultThemes: Record<string, ThemeConfig> = {
  'modern-blue': {
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#1F2937',
      muted: '#F3F4F6',
      border: '#E5E7EB',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
      secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      hero: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 50%, #DB2777 100%)',
    },
    font: {
      family: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    rounded: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
  },
  'emerald-green': {
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#1F2937',
      muted: '#F0FDF4',
      border: '#D1FAE5',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      secondary: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      hero: 'linear-gradient(135deg, #065F46 0%, #10B981 50%, #34D399 100%)',
    },
    font: {
      family: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    rounded: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
  },
  'purple-night': {
    colors: {
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#F59E0B',
      background: '#1F2937',
      foreground: '#F9FAFB',
      muted: '#374151',
      border: '#4B5563',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
      secondary: 'linear-gradient(135deg, #A855F7 0%, #C084FC 100%)',
      hero: 'linear-gradient(135deg, #581C87 0%, #8B5CF6 50%, #C084FC 100%)',
    },
    font: {
      family: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    rounded: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
  },
};

// Apply theme to CSS custom properties
export function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;
  
  // Colors
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-foreground', theme.colors.foreground);
  root.style.setProperty('--color-muted', theme.colors.muted);
  root.style.setProperty('--color-border', theme.colors.border);
  
  // Gradients
  root.style.setProperty('--gradient-primary', theme.gradients.primary);
  root.style.setProperty('--gradient-secondary', theme.gradients.secondary);
  root.style.setProperty('--gradient-hero', theme.gradients.hero);
  
  // Typography
  root.style.setProperty('--font-family', theme.font.family);
  root.style.setProperty('--font-heading', theme.font.heading);
  root.style.setProperty('--font-body', theme.font.body);
  
  // Spacing
  root.style.setProperty('--spacing-xs', theme.spacing.xs);
  root.style.setProperty('--spacing-sm', theme.spacing.sm);
  root.style.setProperty('--spacing-md', theme.spacing.md);
  root.style.setProperty('--spacing-lg', theme.spacing.lg);
  root.style.setProperty('--spacing-xl', theme.spacing.xl);
  
  // Border radius
  root.style.setProperty('--rounded-sm', theme.rounded.sm);
  root.style.setProperty('--rounded-md', theme.rounded.md);
  root.style.setProperty('--rounded-lg', theme.rounded.lg);
  root.style.setProperty('--rounded-full', theme.rounded.full);
  
  // Shadows
  root.style.setProperty('--shadow-sm', theme.shadows.sm);
  root.style.setProperty('--shadow-md', theme.shadows.md);
  root.style.setProperty('--shadow-lg', theme.shadows.lg);
  root.style.setProperty('--shadow-xl', theme.shadows.xl);
}

// Get theme by ID
export function getTheme(themeId: string): ThemeConfig | null {
  return defaultThemes[themeId] || null;
}

// Get all available themes
export function getAllThemes(): Array<{ id: string; name: string; theme: ThemeConfig }> {
  return Object.entries(defaultThemes).map(([id, theme]) => ({
    id,
    name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    theme,
  }));
}