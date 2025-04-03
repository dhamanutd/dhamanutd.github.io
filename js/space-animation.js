document.addEventListener('DOMContentLoaded', () => {
    // Get canvas and context
    const canvas = document.getElementById('space-animation');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match window
    const setCanvasDimensions = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    // Call once to initialize
    setCanvasDimensions();
    
    // Update on window resize
    window.addEventListener('resize', setCanvasDimensions);
    
    // Star properties
    const stars = [];
    const numStars = 200;
    const starColors = ['#ffffff', '#f8f8ff', '#e6e6fa', '#fffafa', '#f0f8ff'];
    
    // Initialize stars
    const initStars = () => {
        stars.length = 0; // Clear existing stars
        
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                color: starColors[Math.floor(Math.random() * starColors.length)],
                speed: 0.05 + Math.random() * 0.1,
                opacity: 0.5 + Math.random() * 0.5,
                twinkleSpeed: 0.001 + Math.random() * 0.005,
                twinkleDirection: Math.random() > 0.5 ? 1 : -1
            });
        }
    };
    
    // Draw a single star
    const drawStar = (star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    };
    
    // Update and draw stars
    const updateStars = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            // Move stars
            star.x += star.speed;
            
            // Wrap around if off screen
            if (star.x > canvas.width + star.radius) {
                star.x = -star.radius;
                star.y = Math.random() * canvas.height;
            }
            
            // Twinkle effect
            star.opacity += star.twinkleSpeed * star.twinkleDirection;
            
            // Reverse direction at opacity bounds
            if (star.opacity >= 1 || star.opacity <= 0.3) {
                star.twinkleDirection *= -1;
            }
            
            drawStar(star);
        });
    };
    
    // Create occasional shooting star effect
    const createShootingStar = () => {
        if (Math.random() > 0.98) { // Small chance to create a shooting star
            const shootingStar = {
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height / 3), // Top third of screen
                length: 50 + Math.random() * 100,
                speed: 10 + Math.random() * 15,
                angle: Math.PI / 4 + (Math.random() * Math.PI / 4), // Angle between PI/4 and PI/2
                opacity: 1
            };
            
            const animateShootingStar = () => {
                if (shootingStar.opacity <= 0) return;
                
                ctx.save();
                ctx.beginPath();
                
                // Create gradient for tail effect
                const gradient = ctx.createLinearGradient(
                    shootingStar.x,
                    shootingStar.y,
                    shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
                    shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length
                );
                
                gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(shootingStar.x, shootingStar.y);
                ctx.lineTo(
                    shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
                    shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length
                );
                ctx.stroke();
                ctx.restore();
                
                // Update position
                shootingStar.x += shootingStar.speed * Math.cos(shootingStar.angle);
                shootingStar.y += shootingStar.speed * Math.sin(shootingStar.angle);
                
                // Fade out over time
                shootingStar.opacity -= 0.01;
                
                // Continue animation
                if (shootingStar.x > 0 && shootingStar.x < canvas.width && 
                    shootingStar.y > 0 && shootingStar.y < canvas.height &&
                    shootingStar.opacity > 0) {
                    requestAnimationFrame(animateShootingStar);
                }
            };
            
            animateShootingStar();
        }
    };
    
    // Create occasional nebula effect
    const createNebula = () => {
        if (Math.random() > 0.995) { // Very small chance to create a nebula
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = 50 + Math.random() * 100;
            const color = Math.random() > 0.5 ? '#4D5DFF' : '#FF7E5F';
            let opacity = 0;
            const maxOpacity = 0.1 + Math.random() * 0.1;
            
            const animateNebula = () => {
                if (opacity >= maxOpacity) {
                    // Start fading out
                    fadeOutNebula();
                    return;
                }
                
                // Draw nebula
                ctx.save();
                ctx.beginPath();
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, `rgba(${hexToRgb(color)}, ${opacity})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                
                // Increase opacity gradually
                opacity += 0.001;
                requestAnimationFrame(animateNebula);
            };
            
            const fadeOutNebula = () => {
                if (opacity <= 0) return;
                
                // Draw nebula
                ctx.save();
                ctx.beginPath();
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, `rgba(${hexToRgb(color)}, ${opacity})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                
                // Decrease opacity gradually
                opacity -= 0.001;
                requestAnimationFrame(fadeOutNebula);
            };
            
            animateNebula();
        }
    };
    
    // Helper function to convert hex color to rgb
    const hexToRgb = (hex) => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    };
    
    // Animation loop
    const animate = () => {
        updateStars();
        createShootingStar();
        createNebula();
        requestAnimationFrame(animate);
    };
    
    // Initialize and start animation
    initStars();
    animate();
    
    // Dynamic text typing effect
    const dynamicText = document.getElementById('dynamic-text');
    const phrases = ['web applications', 'mobile apps', 'robust APIs', 'scalable systems', 'elegant solutions'];
    let phraseIndex = 0;
    let letterIndex = 0;
    let currentPhrase = '';
    let isDeleting = false;
    let typingSpeed = 100;
    
    const type = () => {
        const i = phraseIndex % phrases.length;
        const fullPhrase = phrases[i];
        
        if (isDeleting) {
            currentPhrase = fullPhrase.substring(0, letterIndex - 1);
            letterIndex--;
            typingSpeed = 50;
        } else {
            currentPhrase = fullPhrase.substring(0, letterIndex + 1);
            letterIndex++;
            typingSpeed = 100;
        }
        
        if (dynamicText) {
            dynamicText.textContent = currentPhrase;
        }
        
        if (!isDeleting && letterIndex === fullPhrase.length) {
            // Complete word typed, pause before deleting
            isDeleting = true;
            typingSpeed = 1000; // Pause at end of word
        } else if (isDeleting && letterIndex === 0) {
            // Word completely deleted, move to next word
            isDeleting = false;
            phraseIndex++;
            typingSpeed = 500; // Pause before starting new word
        }
        
        setTimeout(type, typingSpeed);
    };
    
    // Start the typing effect
    setTimeout(type, 1000);
});
