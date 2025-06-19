/**
 * Theme Switcher for Personal Digital Space
 * Handles light/dark theme switching with persistence
 */

const ThemeSwitcher = {
  currentTheme: localStorage.getItem('theme') || 'light',
  toggleButton: null,

  init() {
    this.setupThemeButton();
    this.applyTheme(this.currentTheme);
    this.setupSystemThemeDetection();
    this.setupKeyboardShortcut();
  },

  setupThemeButton() {
    this.toggleButton = document.querySelector('.theme-toggle');
    
    if (!this.toggleButton) {
      console.warn('Theme toggle button not found');
      return;
    }

    // Set initial button state
    this.updateButtonAppearance();

    // Add click event listener
    this.toggleButton.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Add keyboard support
    this.toggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  },

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    
    // Add visual feedback
    this.addToggleAnimation();
  },

  setTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
    this.updateButtonAppearance();
    this.notifyThemeChange(theme);
  },

  applyTheme(theme) {
    // Update document attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update body class for additional styling
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  },

  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    // Set appropriate theme color based on current theme
    const themeColors = {
      light: '#ffffff',
      dark: '#0f172a'
    };

    metaThemeColor.content = themeColors[theme] || themeColors.light;
  },

  updateButtonAppearance() {
    if (!this.toggleButton) return;

    // Update button text/icon
    const icons = {
      light: '🌙', // Show moon when in light mode (click to go dark)
      dark: '☀️'   // Show sun when in dark mode (click to go light)
    };

    this.toggleButton.innerHTML = icons[this.currentTheme];
    
    // Update aria-label for accessibility
    const labels = {
      light: 'Switch to dark theme',
      dark: 'Switch to light theme'
    };
    
    this.toggleButton.setAttribute('aria-label', labels[this.currentTheme]);
    
    // Update title for tooltip
    this.toggleButton.title = labels[this.currentTheme];
  },

  addToggleAnimation() {
    if (!this.toggleButton) return;

    // Add animation class
    this.toggleButton.classList.add('theme-switching');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      this.toggleButton.classList.remove('theme-switching');
    }, 300);
  },

  saveTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  },

  setupSystemThemeDetection() {
    // Check if user prefers dark mode and no saved preference exists
    if (!localStorage.getItem('theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      
      if (prefersDark.matches) {
        this.setTheme('dark');
      }

      // Listen for system theme changes
      prefersDark.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme-manual')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  },

  setupKeyboardShortcut() {
    // Add keyboard shortcut: Ctrl/Cmd + Shift + T
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
        
        // Mark as manual preference
        localStorage.setItem('theme-manual', 'true');
      }
    });
  },

  notifyThemeChange(theme) {
    // Dispatch custom event for other components to listen to
    const event = new CustomEvent('themechange', {
      detail: { theme, previousTheme: this.currentTheme }
    });
    
    window.dispatchEvent(event);

    // Update global App state if available
    if (window.App) {
      window.App.theme = theme;
    }
  },

  // Method to get current theme (for external use)
  getCurrentTheme() {
    return this.currentTheme;
  },

  // Method to check if dark theme is active
  isDarkTheme() {
    return this.currentTheme === 'dark';
  },

  // Method to programmatically set theme (for external use)
  forceTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      this.setTheme(theme);
      localStorage.setItem('theme-manual', 'true');
    } else {
      console.warn('Invalid theme:', theme);
    }
  }
};

// CSS for theme switching animation (inject into head)
const themeCSS = `
.theme-toggle {
  transition: transform 0.3s ease, background-color 0.2s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

.theme-toggle.theme-switching {
  transform: rotate(180deg) scale(1.1);
}

/* Smooth transitions for theme changes */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Prevent transition on initial load */
.no-transitions * {
  transition: none !important;
}

/* Theme-specific styles */
.theme-light {
  color-scheme: light;
}

.theme-dark {
  color-scheme: dark;
}

/* Focus styles for theme toggle */
.keyboard-focus .theme-toggle:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
`;

// Inject theme CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = themeCSS;
document.head.appendChild(styleSheet);

// Prevent flash of unstyled content (FOUC)
const preventFOUC = () => {
  // Add no-transitions class to prevent animations on load
  document.body.classList.add('no-transitions');
  
  // Remove no-transitions class after a brief delay
  setTimeout(() => {
    document.body.classList.remove('no-transitions');
  }, 100);
};

// Initialize FOUC prevention immediately
preventFOUC();

// Export for global use
window.ThemeSwitcher = ThemeSwitcher;