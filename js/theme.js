/**
 * Theme Manager - Handles dark/light mode switching
 * Detects system preference and allows manual override
 */

class ThemeManager {
    constructor() {
        this.STORAGE_KEY = 'portfolio-theme';
        this.DARK_MODE_CLASS = 'dark-mode';
        this.LIGHT_MODE_CLASS = 'light-mode';
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        // Apply saved theme or system preference
        this.applyTheme(this.getTheme());
        
        // Set up theme toggle button
        this.setupThemeToggle();
        
        // Listen for system theme changes
        this.listenToSystemThemeChanges();
    }

    /**
     * Get current theme preference
     * Priority: localStorage > system preference > light
     */
    getTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.classList.add(this.DARK_MODE_CLASS);
            html.classList.remove(this.LIGHT_MODE_CLASS);
            html.setAttribute('data-theme', 'dark');
        } else {
            html.classList.add(this.LIGHT_MODE_CLASS);
            html.classList.remove(this.DARK_MODE_CLASS);
            html.setAttribute('data-theme', 'light');
        }

        // Update theme toggle icon
        this.updateThemeToggleIcon(theme);
        
        // Save preference
        localStorage.setItem(this.STORAGE_KEY, theme);
    }

    /**
     * Toggle between light and dark mode
     */
    toggleTheme() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Trigger AOS refresh if available
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.refresh();
            }, 300);
        }
    }

    /**
     * Update theme toggle button icon
     */
    updateThemeToggleIcon(theme) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('i');
        if (!icon) return;

        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            toggleBtn.setAttribute('aria-label', 'Toggle light mode');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
        }
    }

    /**
     * Set up theme toggle button click handler
     */
    setupThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    /**
     * Listen for system theme changes
     */
    listenToSystemThemeChanges() {
        if (!window.matchMedia) return;

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Modern browsers
        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', (e) => {
                // Only apply if user hasn't manually set a preference
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
        // Older browsers
        else if (darkModeQuery.addListener) {
            darkModeQuery.addListener((e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeManager();
    });
} else {
    new ThemeManager();
}

