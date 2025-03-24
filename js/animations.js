const sections = document.querySelectorAll('.section');
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    } else {
      entry.target.classList.remove('animate');
    }
  });
}, options);

sections.forEach(section => {
  observer.observe(section);
});

// Enhance existing animations.js file with timeline-specific animations

document.addEventListener('DOMContentLoaded', function() {
    // Get all timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Set animation delay dynamically for a staggered effect
    timelineItems.forEach((item, index) => {
        item.style.setProperty('--i', index);
    });
    
    // Modified parallax effect for timeline items to prevent conflicts with 3D canvases
    window.addEventListener('scroll', function() {
        timelineItems.forEach(item => {
            const speed = 0.2;
            const rect = item.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInView) {
                const yPos = -(window.scrollY * speed);
                // Only apply transform if it doesn't already have a transform from another source
                if (!item.style.transform.includes('rotate') && !item.style.transform.includes('scale')) {
                    item.style.transform = `translateY(${yPos}px)`;
                }
                
                // Add visible class for fade in effect
                item.classList.add('visible');
            }
        });
    });
    
    // Interactive hover effects for timeline skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            // Generate a random subtle animation
            const animations = [
                'scale(1.1)',
                'translateY(-5px)',
                'rotate(5deg)',
                'scale(1.05) translateY(-3px)'
            ];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            tag.style.transform = randomAnimation;
        });
        
        tag.addEventListener('mouseleave', function() {
            tag.style.transform = 'none';
        });
    });
});
