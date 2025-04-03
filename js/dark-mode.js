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
        updateRocketLaunchTheme(true);
        updateHeroSectionTheme(true);
    } else if (userSetTheme === 'light' || (!systemPrefersDark && !userSetTheme)) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
        updateParticlesColor(false);
        updateRocketLaunchTheme(false);
        updateHeroSectionTheme(false);
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            const newIsDark = e.matches;
            document.documentElement.setAttribute('data-theme', newIsDark ? 'dark' : 'light');
            themeToggle.checked = newIsDark;
            updateParticlesColor(newIsDark);
            updateRocketLaunchTheme(newIsDark);
            updateHeroSectionTheme(newIsDark);
        }
    });
    
    // Toggle theme when checkbox is clicked
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (themeLabel) themeLabel.textContent = this.checked ? 'Light Mode' : 'Dark Mode';
        updateParticlesColor(this.checked);
        updateRocketLaunchTheme(this.checked);
        updateHeroSectionTheme(this.checked);
    });
    
    function updateParticlesColor(isDarkMode) {
        if (window.pJSDom && window.pJSDom[0]) {
            const particleColor = isDarkMode ? '#888888' : '#333333';
            window.pJSDom[0].pJS.particles.color.value = particleColor;
            window.pJSDom[0].pJS.particles.line_linked.color = particleColor;
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    // Add function to update rocket launch theme
    function updateRocketLaunchTheme(isDarkMode) {
        const starrySkies = document.querySelectorAll('.starry-sky');
        const capeCanaveralScene = document.querySelector('.cape-canaveral-scene');
        
        starrySkies.forEach(sky => {
            if (isDarkMode) {
                sky.style.display = 'block';
            } else {
                sky.style.display = 'none';
            }
        });
        
        if (capeCanaveralScene) {
            if (isDarkMode) {
                capeCanaveralScene.style.display = 'none';
            } else {
                capeCanaveralScene.style.display = 'block';
            }
        }
    }
    
    // Add function to update hero section theme
    function updateHeroSectionTheme(isDarkMode) {
        const spaceCanvas = document.getElementById('space-animation');
        if (spaceCanvas) {
            if (isDarkMode) {
                spaceCanvas.style.display = 'block';
            } else {
                spaceCanvas.style.display = 'none';
            }
        }
    }
    
    // Initialize rocket launch theme based on current mode
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    updateRocketLaunchTheme(isDarkMode);
    updateHeroSectionTheme(isDarkMode);
});

// Trigger the theme update immediately after page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're already past DOMContentLoaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        updateRocketLaunchTheme(isDarkMode);
        updateHeroSectionTheme(isDarkMode);
    }
});
