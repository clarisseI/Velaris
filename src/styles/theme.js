// Theme configuration for consistent styling across the app
export const theme = {
  colors: {
    primary: '#fff',
    secondary: 'rgba(255,255,255,0.8)',
    muted: 'rgba(255,255,255,0.6)',
    faint: 'rgba(255,255,255,0.5)',
    bgPrimary: '#0a0a0a',
    bgSecondary: '#1a1a1a',
    border: '#2a2a2a',
    borderLight: 'rgba(255,255,255,0.1)',
    cardBg: 'rgba(26, 26, 26, 0.95)',
    success: '#52c41a',
    error: '#f5222d',
    warning: '#faad14',
    info: '#1890ff',
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    sizes: {
      xs: '9px',
      sm: '10px',
      base: '11px',
      md: '13px',
      lg: '14px',
      xl: '16px',
      '2xl': '18px',
      '3xl': '22px',
      '4xl': '28px',
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  
  gradients: {
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    blue: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    teal: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    dark: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
  },
  
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.5)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    xl: '0 12px 40px rgba(0, 0, 0, 0.7)',
  },
};
