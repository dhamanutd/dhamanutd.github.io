document.addEventListener('DOMContentLoaded', function() {
    // Core elements
    const hobbyPanels = document.querySelectorAll('.hobby-panel');
    const hobbyContents = document.querySelectorAll('.hobby-content');
    const hobbyNavButtons = document.querySelectorAll('.hobby-nav-btn');
    
    // State variables
    let currentIndex = 0;
    const totalHobbies = hobbyPanels.length;
    let isAnimating = false;
    
    // Position hobby nav buttons in the center between columns
    function positionHobbyNav() {
        const hobbyNav = document.querySelector('.hobby-nav');
        if (!hobbyNav) return;
        
        const hobbiesInfo = document.querySelector('.hobbies-info');
        const hobbiesVisual = document.querySelector('.hobbies-visual');
        
        if (!hobbiesInfo || !hobbiesVisual) return;
        
        // Position the nav element absolutely
        hobbyNav.style.position = 'absolute';
        hobbyNav.style.zIndex = '20';
        
        // Calculate the position - align exactly with column border
        const infoRect = hobbiesInfo.getBoundingClientRect();
        const visualRect = hobbiesVisual.getBoundingClientRect();
        
        // The exact border position is where the info column ends
        const borderX = infoRect.right;
        
        // Set horizontal position (center on the border)
        const navWidth = hobbyNav.offsetWidth;
        hobbyNav.style.left = `${borderX - navWidth / 2}px`;
        
        // Set vertical position (middle of the section)
        const hobbiesSection = document.querySelector('.hobbies-section');
        const sectionRect = hobbiesSection.getBoundingClientRect();
        const centerY = sectionRect.top + (sectionRect.height / 2);
        const navHeight = hobbyNav.offsetHeight;
        
        hobbyNav.style.top = `${centerY - navHeight / 2}px`;
        
        // Adjust for mobile view
        if (window.innerWidth < 992) {
            // Switch to horizontal layout for mobile
            hobbyNav.style.flexDirection = 'row';
            hobbyNav.style.top = `${infoRect.bottom - navHeight - 30}px`;
            hobbyNav.style.left = '50%';
            hobbyNav.style.transform = 'translateX(-50%)';
        } else {
            // Switch back to vertical layout for desktop
            hobbyNav.style.flexDirection = 'column';
            hobbyNav.style.transform = 'none';
        }
    }
    
    function switchHobby(index) {
        if (isAnimating || index === currentIndex) return;
        
        isAnimating = true;
        
        // Calculate new index with wrap-around
        const newIndex = ((index % totalHobbies) + totalHobbies) % totalHobbies;
        
        // Remove active classes from current elements
        hobbyPanels[currentIndex].classList.remove('active');
        hobbyContents[currentIndex].classList.remove('active');
        hobbyNavButtons[currentIndex].classList.remove('active');
        
        // Add active classes to new elements
        currentIndex = newIndex;
        hobbyPanels[currentIndex].classList.add('active');
        hobbyContents[currentIndex].classList.add('active');
        hobbyNavButtons[currentIndex].classList.add('active');
        
        // Trigger animations for new panel
        animateVisualContent(hobbyPanels[currentIndex]);
        animateTextContent(hobbyContents[currentIndex]);
        
        // Reset animation flag after transition completes
        setTimeout(() => isAnimating = false, 800);
    }
    
    function animateTextContent(element) {
        // Animate heading
        const heading = element.querySelector('h3');
        gsap.fromTo(heading, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
        
        // Animate paragraph with slight delay
        const paragraph = element.querySelector('p');
        gsap.fromTo(paragraph, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
        );
    }
    
    function animateVisualContent(panel) {
        const hobbyType = panel.id.replace('-hobby', '');
        const container = panel.querySelector('.hobby-animation-container');
        
        // Clear previous animation
        container.innerHTML = '';
        
        // Create appropriate animation
        switch(hobbyType) {
            case 'football': createFootballAnimation(container); break;
            case 'gaming': createGamingAnimation(container); break;
            case 'jogging': createJoggingAnimation(container); break;
        }
        
        // Add entrance animation for container
        gsap.fromTo(container, 
            { scale: 0.8, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
        );
    }
    
    function createFootballAnimation(container) {
        container.innerHTML = `
            <div class="football-animation">
                <div class="grass-surface"></div>
                <svg viewBox="0 0 100 100" class="football">
                    <!-- Classic soccer ball pattern with hexagons and pentagons -->
                    <circle cx="50" cy="50" r="40" fill="#fff" stroke="#333" stroke-width="1" />
                    <!-- Pentagon at the top -->
                    <polygon points="50,10 65,20 60,40 40,40 35,20" fill="#333" />
                    <!-- Hexagons and pentagons around the ball -->
                    <polygon points="30,15 45,15 50,30 40,45 25,40 20,25" fill="#333" />
                    <polygon points="70,15 85,25 80,40 65,45 55,30 60,15" fill="#333" />
                    <polygon points="15,35 25,25 40,30 45,50 30,65 15,55" fill="#333" />
                    <polygon points="85,35 90,50 80,65 60,65 50,50 65,35" fill="#333" />
                    <polygon points="35,70 50,75 65,70 70,85 50,90 30,85" fill="#333" />
                </svg>
                <div class="ball-shadow"></div>
            </div>
        `;
        
        // Add CSS for grass surface
        const style = document.createElement('style');
        style.textContent = `
            .football-animation {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            .grass-surface {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 30px;
                background: linear-gradient(to bottom, #4caf50, #2e7d32);
                border-top-left-radius: 50%;
                border-top-right-radius: 50%;
            }
            .football {
                width: 80px;
                height: 80px;
                position: relative;
                z-index: 2;
            }
            .ball-shadow {
                position: absolute;
                bottom: 25px;
                width: 60px;
                height: 10px;
                background: rgba(0,0,0,0.3);
                border-radius: 50%;
                filter: blur(3px);
            }
        `;
        container.appendChild(style);
        
        // Create rolling animation
        const timeline = gsap.timeline({
            repeat: -1,
            defaults: { ease: "none" }
        });
        
        // Ball starts from left
        gsap.set(container.querySelector('.football'), {
            x: -100,
            y: -20
        });
        
        gsap.set(container.querySelector('.ball-shadow'), {
            x: -100,
            scale: 0.8,
            opacity: 0.7
        });
        
        // Roll the ball across the grass
        timeline.to(container.querySelector('.football'), {
            x: 150,
            rotation: 360 * 3, // 3 full rotations
            duration: 4,
            ease: "power1.inOut"
        });
        
        // Move the shadow along with the ball
        timeline.to(container.querySelector('.ball-shadow'), {
            x: 150,
            duration: 4,
            ease: "power1.inOut"
        }, "<"); // Start at the same time as the ball animation
        
        // Add a slight bounce effect
        timeline.to(container.querySelector('.football'), {
            y: -30,
            duration: 0.5,
            repeat: 7,
            yoyo: true,
            ease: "power1.inOut"
        }, "<");
        
        // Sync shadow size with bounce height
        timeline.to(container.querySelector('.ball-shadow'), {
            scale: 0.6,
            opacity: 0.5,
            duration: 0.5,
            repeat: 7,
            yoyo: true,
            ease: "power1.inOut"
        }, "<");
    }
    
    function createGamingAnimation(container) {
        container.innerHTML = `
            <div class="gaming-animation">
                <svg viewBox="0 0 100 60" class="controller">
                    <rect x="20" y="10" rx="15" ry="15" width="60" height="40" class="controller-body" />
                    <circle cx="35" cy="30" r="8" class="controller-button left-pad" />
                    <circle cx="65" cy="30" r="8" class="controller-button right-pad" />
                    <rect x="45" y="20" rx="2" ry="2" width="10" height="5" class="controller-button center-button" />
                    <rect x="38" y="40" rx="5" ry="5" width="24" height="3" class="controller-detail" />
                    <path d="M10 25 C5 30, 5 35, 10 40 L20 40 L20 25 Z" class="controller-grip" />
                    <path d="M90 25 C95 30, 95 35, 90 40 L80 40 L80 25 Z" class="controller-grip" />
                </svg>
                <div class="controller-shadow"></div>
            </div>
        `;
        
        // Button animations with GSAP timeline
        const timeline = gsap.timeline({repeat: -1, repeatDelay: 1});
        
        // Left button
        timeline.to(container.querySelector('.left-pad'), {
            scale: 0.85,
            fill: '#f1c40f',
            duration: 0.2
        });
        
        timeline.to(container.querySelector('.left-pad'), {
            scale: 1,
            fill: '#555',
            duration: 0.2
        });
        
        // Right button
        timeline.to(container.querySelector('.right-pad'), {
            scale: 0.85,
            fill: '#f1c40f',
            duration: 0.2
        }, "+=0.3");
        
        timeline.to(container.querySelector('.right-pad'), {
            scale: 1,
            fill: '#555',
            duration: 0.2
        });
        
        // Center button
        timeline.to(container.querySelector('.center-button'), {
            scale: 0.85,
            fill: '#f1c40f',
            duration: 0.2
        }, "+=0.3");
        
        timeline.to(container.querySelector('.center-button'), {
            scale: 1,
            fill: '#555',
            duration: 0.2
        });
        
        // Make controller float
        gsap.to(container.querySelector('.controller'), {
            y: -10,
            rotation: 5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    function createJoggingAnimation(container) {
        container.innerHTML = `
            <div class="jogging-animation">
                <div class="runner">
                    <div class="runner-head"></div>
                    <div class="runner-body"></div>
                    <div class="runner-arm runner-arm-left"></div>
                    <div class="runner-arm runner-arm-right"></div>
                    <div class="runner-leg runner-leg-left"></div>
                    <div class="runner-leg runner-leg-right"></div>
                </div>
                <div class="track">
                    <div class="track-line"></div>
                    <div class="tree tree-1"></div>
                    <div class="tree tree-2"></div>
                    <div class="tree tree-3"></div>
                </div>
            </div>
        `;
        
        // Animate runner
        gsap.to(container.querySelector('.runner'), {
            y: -5,
            duration: 0.4,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
        
        // Animate runner arms and legs
        gsap.to(container.querySelector('.runner-arm-left'), {
            rotation: 30,
            transformOrigin: "top",
            duration: 0.4,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
        
        gsap.to(container.querySelector('.runner-arm-right'), {
            rotation: -30,
            transformOrigin: "top",
            duration: 0.4,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: 0.2
        });
        
        gsap.to(container.querySelector('.runner-leg-left'), {
            rotation: 30,
            transformOrigin: "top",
            duration: 0.4,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
        
        gsap.to(container.querySelector('.runner-leg-right'), {
            rotation: -30,
            transformOrigin: "top",
            duration: 0.4,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: 0.2
        });
        
        // Animate trees moving
        gsap.to([
            container.querySelector('.tree-1'),
            container.querySelector('.tree-2'),
            container.querySelector('.tree-3')
        ], {
            x: -300,
            duration: 4,
            repeat: -1,
            ease: "none",
            stagger: 1.3
        });
    }
    
    function initParallaxEffect() {
        document.querySelectorAll('.hobby-bg').forEach(bg => {
            bg.addEventListener('mousemove', e => {
                const rect = bg.getBoundingClientRect();
                const xPercent = (e.clientX - rect.left) / rect.width;
                const yPercent = (e.clientY - rect.top) / rect.height;
                
                gsap.to(bg, {
                    backgroundPosition: `${50 + (xPercent - 0.5) * 10}% ${50 + (yPercent - 0.5) * 10}%`,
                    duration: 1
                });
            });
        });
    }
    
    function setupEventListeners() {
        // Hobby nav buttons - these will be the only way to switch slides now
        hobbyNavButtons.forEach((button, index) => {
            button.addEventListener('click', () => switchHobby(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', e => {
            // Only when hobbies section is visible
            const hobbiesSection = document.getElementById('hobbies');
            const rect = hobbiesSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (!isVisible) return;
            
            if (e.key === 'ArrowLeft') switchHobby(currentIndex - 1);
            if (e.key === 'ArrowRight') switchHobby(currentIndex + 1);
        });
        
        // Touch swipe support
        const hobbiesSection = document.querySelector('.hobbies-section');
        let touchStartX = 0;
        
        hobbiesSection.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        hobbiesSection.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                switchHobby(currentIndex + 1); // Next
            } else if (touchEndX > touchStartX + swipeThreshold) {
                switchHobby(currentIndex - 1); // Previous
            }
        }, { passive: true });
    }
    
    function setupAutoAdvance() {
        let autoAdvanceTimer;
        
        function startAutoAdvance() {
            stopAutoAdvance();
            autoAdvanceTimer = setInterval(() => switchHobby(currentIndex + 1), 8000);
        }
        
        function stopAutoAdvance() {
            clearInterval(autoAdvanceTimer);
        }
        
        // Start auto-advance
        startAutoAdvance();
        
        // Pause on interaction
        const hobbiesSection = document.querySelector('.hobbies-section');
        hobbiesSection.addEventListener('mouseenter', stopAutoAdvance);
        hobbiesSection.addEventListener('mouseleave', startAutoAdvance);
        hobbiesSection.addEventListener('touchstart', stopAutoAdvance, { passive: true });
        
        // Resume auto-advance after touch ends if not on hobby navigation buttons
        hobbiesSection.addEventListener('touchend', e => {
            if (!e.target.closest('.hobby-nav-btn')) {
                startAutoAdvance();
            }
        }, { passive: true });
    }
    
    function handleResponsiveLayout() {
        const updateLayout = () => {
            const isMobile = window.innerWidth < 992;
            
            if (isMobile) {
                document.querySelectorAll('.hobby-tooltip').forEach(tooltip => {
                    tooltip.style.left = '50%';
                    tooltip.style.top = '-30px';
                    tooltip.style.transform = 'translateX(-50%)';
                });
            } else {
                document.querySelectorAll('.hobby-tooltip').forEach(tooltip => {
                    tooltip.style.left = '70px';
                    tooltip.style.top = '50%';
                    tooltip.style.transform = 'translateY(-50%)';
                });
            }
            
            // Position hobby nav between columns
            positionHobbyNav();
        };
        
        // Initialize and listen for changes
        updateLayout();
        window.addEventListener('resize', updateLayout);
        
        // Also reposition when images might load and change layout
        window.addEventListener('load', updateLayout);
    }
    
    // Initialize everything
    function initialize() {
        // First animation
        animateTextContent(hobbyContents[currentIndex]);
        animateVisualContent(hobbyPanels[currentIndex]);
        
        // Setup all interactions and effects
        setupEventListeners();
        initParallaxEffect();
        setupAutoAdvance();
        handleResponsiveLayout();
        
        // Ensure positioning happens after initial render
        setTimeout(positionHobbyNav, 100);
    }
    
    // Start the module
    initialize();
});
