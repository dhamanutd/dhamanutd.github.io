document.addEventListener('DOMContentLoaded', () => {
    const launchButton = document.getElementById('launch-button');
    const rocket = document.querySelector('.rocket');
    const exhaustFlame = document.querySelector('.exhaust-flame');
    const particleContainer = document.querySelector('.particle-container');
    const countdown = document.querySelector('.countdown');
    const countdownTimer = document.getElementById('countdown-timer');
    const launchMessage = document.querySelector('.launch-message');
    
    let particles = [];
    let isLaunching = false;
    let countdownInterval;
    
    // Launch sequence
    launchButton.addEventListener('click', () => {
        if (isLaunching) return;
        isLaunching = true;
        
        // Start countdown
        launchButton.disabled = true;
        launchButton.textContent = 'Preparing Launch...';
        countdown.classList.remove('hidden');
        
        let countdownValue = 10;
        countdownTimer.textContent = countdownValue;
        
        countdownInterval = setInterval(() => {
            countdownValue--;
            countdownTimer.textContent = countdownValue;
            
            // Play countdown sound
            playSound('countdown');
            
            if (countdownValue === 0) {
                clearInterval(countdownInterval);
                launchRocket();
            }
        }, 1000);
    });
    
    // Launch the rocket
    function launchRocket() {
        countdown.classList.add('hidden');
        launchMessage.textContent = 'Lift off!';
        launchMessage.classList.remove('hidden');
        
        // Ignite rocket
        exhaustFlame.classList.add('active');
        
        // Play launch sound
        playSound('launch');
        
        // Generate smoke particles
        const smokeInterval = setInterval(createSmokeParticles, 30);
        
        // Launch the rocket after a small delay
        setTimeout(() => {
            rocket.classList.add('launching');
            
            // Add space station interaction
            setTimeout(() => {
                launchMessage.textContent = 'Approaching Space Station...';
                
                setTimeout(() => {
                    launchMessage.textContent = 'Mission Successful!';
                    clearInterval(smokeInterval);
                    setTimeout(resetLaunch, 3000);
                }, 3000);
            }, 2000);
        }, 500);
    }
    
    // Create smoke particles
    function createSmokeParticles() {
        const rocketRect = rocket.getBoundingClientRect();
        const containerRect = particleContainer.getBoundingClientRect();
        
        // Calculate position relative to the rocket's exhaust
        const x = rocketRect.left + rocketRect.width / 2 - containerRect.left;
        const y = rocketRect.bottom - 10 - containerRect.top;
        
        // Create multiple particles per frame
        for (let i = 0; i < 3; i++) {
            createSmokeParticle(x, y);
        }
        
        // Remove old particles
        particles = particles.filter(particle => {
            const element = particle.element;
            const opacity = parseFloat(element.style.opacity);
            
            if (opacity <= 0) {
                element.remove();
                return false;
            }
            return true;
        });
    }
    
    // Create a single smoke particle
    function createSmokeParticle(x, y) {
        const element = document.createElement('div');
        element.className = 'smoke-particle';
        
        // Enhanced particle properties for more realism
        const size = 20 + Math.random() * 35; // Larger particles
        const angle = (Math.random() * Math.PI * 0.5) - Math.PI/4; // Wider spread
        const speed = 1 + Math.random() * 3;
        const lifespan = 3000 + Math.random() * 2000; // Longer lifespan
        
        // Add variation to make the smoke look more natural
        const turbulenceX = Math.random() * 2 - 1;
        const turbulenceY = Math.random() * 1.5;
        
        const particle = {
            element,
            x,
            y,
            size,
            speedX: Math.cos(angle) * speed + turbulenceX,
            speedY: Math.sin(angle) * speed * 1.5 + turbulenceY,
            opacity: 0.8 + Math.random() * 0.2, // Vary initial opacity
            lifespan,
            createdAt: Date.now(),
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 3,
            // Add randomness to particle evolution
            growthRate: 0.5 + Math.random() * 0.5,
            turbulenceFactor: Math.random() * 0.01
        };
        
        particleContainer.appendChild(element);
        particles.push(particle);
        animateParticle(particle);
    }
    
    // Animate smoke particle
    function animateParticle(particle) {
        const now = Date.now();
        const lifeProgress = (now - particle.createdAt) / particle.lifespan;
        
        if (lifeProgress >= 1) {
            particle.element.remove();
            return;
        }
        
        // Update position with enhanced natural movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Slow down as the particle rises
        particle.speedY *= 0.99;
        
        // Expand size over time with custom growth rate
        const currentSize = particle.size * (1 + lifeProgress * particle.growthRate);
        
        // More natural opacity fade
        particle.opacity = 0.9 * Math.pow(1 - lifeProgress, 1.5);
        
        // Add rotation and dynamic turbulence
        particle.rotation += particle.rotationSpeed;
        particle.x += Math.sin(now * particle.turbulenceFactor) * (1 + lifeProgress);
        
        // Apply enhanced changes
        const element = particle.element;
        element.style.transform = `translate(${particle.x}px, ${-particle.y}px) rotate(${particle.rotation}deg)`;
        element.style.width = `${currentSize}px`;
        element.style.height = `${currentSize}px`;
        element.style.opacity = particle.opacity;
        
        // Continue animation
        requestAnimationFrame(() => animateParticle(particle));
    }
    
    // Play sound effects
    function playSound(type) {
        // Implement sound effects if needed
    }
    
    // Reset launch sequence
    function resetLaunch() {
        rocket.classList.remove('launching');
        exhaustFlame.classList.remove('active');
        launchMessage.classList.add('hidden');
        launchButton.disabled = false;
        launchButton.textContent = 'Launch Rocket';
        isLaunching = false;
        
        // Remove all remaining particles
        particles.forEach(particle => particle.element.remove());
        particles = [];
        
        // Reset position with a transition
        rocket.style.transition = 'none';
        rocket.style.bottom = '60px';
        rocket.style.transform = 'translateX(-50%)';
        
        // Force a reflow before re-enabling transitions
        rocket.offsetHeight;
        rocket.style.transition = '';
    }
});
