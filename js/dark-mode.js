document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.querySelector('.theme-label');
    
    // Check if user has previously set a preference
    const userSetTheme = localStorage.getItem('theme');
    
    // Get system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme based on user preference or system preference
    if (userSetTheme === 'dark' || (systemPrefersDark && !userSetTheme)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        updateParticlesColor(true);
    } else if (userSetTheme === 'light' || (!systemPrefersDark && !userSetTheme)) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
        updateParticlesColor(false);
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            const newIsDark = e.matches;
            document.documentElement.setAttribute('data-theme', newIsDark ? 'dark' : 'light');
            themeToggle.checked = newIsDark;
            updateParticlesColor(newIsDark);
        }
    });
    
    // Toggle theme when checkbox is clicked
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (themeLabel) themeLabel.textContent = this.checked ? 'Light Mode' : 'Dark Mode';
        updateParticlesColor(this.checked);
    });
    
    function updateParticlesColor(isDarkMode) {
        if (window.pJSDom && window.pJSDom[0]) {
            const particleColor = isDarkMode ? '#888888' : '#333333';
            window.pJSDom[0].pJS.particles.color.value = particleColor;
            window.pJSDom[0].pJS.particles.line_linked.color = particleColor;
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }
});
