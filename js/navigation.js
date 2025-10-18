// Navigation active state handler
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');

    // Function to update active nav link based on scroll position
    const updateActiveNavLink = () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY + 100; // Offset for navbar height
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1); // Remove '#'
            if (href === currentSection) {
                link.classList.add('active');
            }
        });
    };

    // Update on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Update on load
    updateActiveNavLink();

    // Smooth scroll with offset for fixed navbar
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = 100; // Approximate navbar height + spacing
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

