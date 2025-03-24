document.addEventListener('DOMContentLoaded', function() {
    if (!window.THREE) {
        console.warn('Three.js not loaded, skipping 3D hobby visualizations');
        return;
    }

    // Theme-aware color management
    const getThemeColors = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            background: isDark ? '#2c2c2c' : '#ffffff',
            primary: isDark ? '#888888' : '#333333',
            secondary: isDark ? '#64b5f6' : '#2196F3',
            accent: isDark ? '#f1c40f' : '#f39c12'
        };
    };

    // Slideshow functionality
    const initSlideshow = () => {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const indicators = document.querySelectorAll('.indicator');
        
        if (!slides.length || !prevBtn || !nextBtn) return;
        
        let currentSlide = 0;
        let isAnimating = false;
        const animationDelay = 800; // Match with CSS transition duration
        
        const goToSlide = (index) => {
            if (isAnimating || index === currentSlide) return;
            isAnimating = true;
            
            // Remove active class from current slide and indicator
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide]?.classList.remove('active');
            
            // Update current slide index
            currentSlide = index;
            
            // Handle wrapping
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            
            // Add active class to new slide and indicator
            slides[currentSlide].classList.add('active');
            indicators[currentSlide]?.classList.add('active');
            
            // Reset animation flag after transition completes
            setTimeout(() => {
                isAnimating = false;
                
                // Make sure scenes are properly sized after slide change
                refreshAllScenes();
            }, animationDelay);
        };
        
        // Set up event listeners
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        
        // Set up indicator event listeners
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
            if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
        });
        
        // Add swipe navigation for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        const slideContainer = document.querySelector('.slide-container');
        
        slideContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go to next slide
                goToSlide(currentSlide + 1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go to previous slide
                goToSlide(currentSlide - 1);
            }
        };
        
        return { goToSlide };
    };

    // Reusable scene setup
    const createScene = (canvasId) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const colors = getThemeColors();
        
        // Initialize renderer
        const renderer = new THREE.WebGLRenderer({ 
            canvas,
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(colors.background);
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(
            50, 
            canvas.clientWidth / canvas.clientHeight, 
            0.1, 
            1000
        );
        camera.position.z = 5;
        
        // Add orbit controls for interaction
        const controls = new THREE.OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.7;
        controls.enableZoom = false;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        return { renderer, scene, camera, controls };
    };

    // Store all scenes for refreshing
    const scenes = {};

    // Create football visualization
    const initFootballScene = () => {
        const setup = createScene('football-canvas');
        if (!setup) return;
        
        const { renderer, scene, camera, controls } = setup;
        scenes.football = setup;
        
        const colors = getThemeColors();
        
        // Create a football (soccer ball)
        const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
        
        // Create basic material
        const ballMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.1
        });
        
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        scene.add(ball);
        
        // Add pentagon patterns to the ball
        const pentagonGeometry = new THREE.CircleGeometry(0.3, 5);
        const pentagonMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        // Create and position 12 pentagons around the ball
        for (let i = 0; i < 12; i++) {
            const pentagon = new THREE.Mesh(pentagonGeometry, pentagonMaterial);
            
            // Position pentagons evenly around the sphere
            const phi = Math.acos(-1 + (2 * i) / 12);
            const theta = Math.sqrt(12 * Math.PI) * phi;
            
            pentagon.position.x = 1.01 * Math.cos(theta) * Math.sin(phi);
            pentagon.position.y = 1.01 * Math.sin(theta) * Math.sin(phi);
            pentagon.position.z = 1.01 * Math.cos(phi);
            
            // Orient pentagon to face outward
            pentagon.lookAt(0, 0, 0);
            pentagon.rotateZ(Math.random() * Math.PI);
            
            ball.add(pentagon);
        }

        // Add subtle auto-rotation
        const animate = () => {
            requestAnimationFrame(animate);
            
            ball.rotation.y += 0.005;
            ball.rotation.x += 0.002;
            
            controls.update();
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Handle resize
        const resizeScene = () => {
            if (renderer.domElement.clientWidth === 0) return;
            
            camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight);
        };
        
        window.addEventListener('resize', resizeScene);
        
        // Store resize function
        scenes.football.resize = resizeScene;
        
        // Handle theme changes
        document.getElementById('theme-toggle').addEventListener('change', () => {
            const newColors = getThemeColors();
            scene.background = new THREE.Color(newColors.background);
        });
    };

    // Create gaming visualization
    const initGamingScene = () => {
        const setup = createScene('gaming-canvas');
        if (!setup) return;
        
        const { renderer, scene, camera, controls } = setup;
        scenes.gaming = setup;
        
        const colors = getThemeColors();
        
        // Create a game controller
        const controllerGroup = new THREE.Group();
        scene.add(controllerGroup);
        
        // Controller body
        const bodyGeometry = new THREE.BoxGeometry(3, 1.2, 0.5);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: colors.primary,
            shininess: 30
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        controllerGroup.add(body);
        
        // Controller grips (left and right)
        const gripGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
        const gripMaterial = new THREE.MeshPhongMaterial({
            color: colors.primary,
            shininess: 30
        });
        
        const leftGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        leftGrip.rotation.x = Math.PI / 2;
        leftGrip.position.set(-1.2, -0.4, 0);
        controllerGroup.add(leftGrip);
        
        const rightGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        rightGrip.rotation.x = Math.PI / 2;
        rightGrip.position.set(1.2, -0.4, 0);
        controllerGroup.add(rightGrip);
        
        // D-pad
        const dpadGroup = new THREE.Group();
        dpadGroup.position.set(-0.8, 0.1, 0.3);
        
        const dpadMaterial = new THREE.MeshPhongMaterial({
            color: colors.secondary, 
            shininess: 50
        });
        
        const dpadCenter = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.1),
            dpadMaterial
        );
        dpadCenter.position.z = 0.05;
        dpadGroup.add(dpadCenter);
        
        const dpadUp = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.3, 0.1),
            dpadMaterial
        );
        dpadUp.position.y = 0.25;
        dpadUp.position.z = 0.05;
        dpadGroup.add(dpadUp);
        
        const dpadDown = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.3, 0.1),
            dpadMaterial
        );
        dpadDown.position.y = -0.25;
        dpadDown.position.z = 0.05;
        dpadGroup.add(dpadDown);
        
        const dpadLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.2, 0.1),
            dpadMaterial
        );
        dpadLeft.position.x = -0.25;
        dpadLeft.position.z = 0.05;
        dpadGroup.add(dpadLeft);
        
        const dpadRight = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.2, 0.1),
            dpadMaterial
        );
        dpadRight.position.x = 0.25;
        dpadRight.position.z = 0.05;
        dpadGroup.add(dpadRight);
        
        controllerGroup.add(dpadGroup);
        
        // Buttons
        const buttonGeometry = new THREE.CircleGeometry(0.15, 32);
        const buttonMaterial = new THREE.MeshPhongMaterial({ 
            color: colors.accent,
            shininess: 80
        });
        
        const buttons = new THREE.Group();
        buttons.position.set(0.8, 0.1, 0.3);
        
        const buttonPositions = [
            { x: 0, y: 0.3 },  // Top
            { x: 0.3, y: 0 },  // Right
            { x: 0, y: -0.3 }, // Bottom
            { x: -0.3, y: 0 }  // Left
        ];
        
        buttonPositions.forEach(pos => {
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.position.set(pos.x, pos.y, 0.05);
            button.rotation.x = -Math.PI / 2;
            buttons.add(button);
        });
        
        controllerGroup.add(buttons);
        
        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            
            controllerGroup.rotation.y += 0.01;
            
            // Make controller float up and down
            const time = Date.now() * 0.001;
            controllerGroup.position.y = Math.sin(time) * 0.1;
            
            controls.update();
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Handle resize
        const resizeScene = () => {
            if (renderer.domElement.clientWidth === 0) return;
            
            camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight);
        };
        
        window.addEventListener('resize', resizeScene);
        
        // Store resize function
        scenes.gaming.resize = resizeScene;
        
        // Update colors on theme change
        document.getElementById('theme-toggle').addEventListener('change', () => {
            const newColors = getThemeColors();
            scene.background = new THREE.Color(newColors.background);
            bodyMaterial.color.set(newColors.primary);
            gripMaterial.color.set(newColors.primary);
            dpadMaterial.color.set(newColors.secondary);
            buttonMaterial.color.set(newColors.accent);
        });
    };

    // Create jogging visualization
    const initJoggingScene = () => {
        const setup = createScene('jogging-canvas');
        if (!setup) return;
        
        const { renderer, scene, camera, controls } = setup;
        scenes.jogging = setup;
        
        const colors = getThemeColors();
        
        // Create a ground
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x7CFC00,
            roughness: 0.8,
            metalness: 0.2,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        scene.add(ground);
        
        // Create a running track
        const trackGeometry = new THREE.TorusGeometry(3, 0.3, 16, 100);
        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF4500,
            roughness: 0.5,
            metalness: 0
        });
        const track = new THREE.Mesh(trackGeometry, trackMaterial);
        track.rotation.x = Math.PI / 2;
        track.position.y = -0.9;
        scene.add(track);
        
        // Create a simple runner figure
        const runnerGroup = new THREE.Group();
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: colors.primary
        });
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 0.7;
        runnerGroup.add(head);
        
        // Body
        const torsoGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.5, 32);
        const torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
        torso.position.y = 0.25;
        runnerGroup.add(torso);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
        const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftArm.position.set(0.25, 0.3, 0);
        leftArm.rotation.z = -Math.PI / 4;
        runnerGroup.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightArm.position.set(-0.25, 0.3, 0);
        rightArm.rotation.z = Math.PI / 4;
        runnerGroup.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.07, 0.05, 0.5, 16);
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        leftLeg.position.set(0.1, -0.2, 0);
        runnerGroup.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        rightLeg.position.set(-0.1, -0.2, 0);
        runnerGroup.add(rightLeg);
        
        // Position the runner on the track
        runnerGroup.position.set(0, -0.5, 3);
        scene.add(runnerGroup);
        
        // Create trees for scenery
        const createTree = (x, z) => {
            const treeGroup = new THREE.Group();
            
            // Tree trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 16);
            const trunkMaterial = new THREE.MeshStandardMaterial({
                color: 0x8B4513,
                roughness: 1
            });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 0.4;
            treeGroup.add(trunk);
            
            // Tree top
            const topGeometry = new THREE.ConeGeometry(0.5, 1, 8);
            const topMaterial = new THREE.MeshStandardMaterial({
                color: 0x006400,
                roughness: 0.8
            });
            const top = new THREE.Mesh(topGeometry, topMaterial);
            top.position.y = 1.3;
            treeGroup.add(top);
            
            treeGroup.position.set(x, -1, z);
            return treeGroup;
        };
        
        // Add several trees around the scene
        const treePositions = [
            { x: 4, z: 4 },
            { x: -4, z: 4 },
            { x: 4, z: -4 },
            { x: -4, z: -4 },
            { x: 0, z: 5 },
            { x: 5, z: 0 },
            { x: 0, z: -5 },
            { x: -5, z: 0 }
        ];
        
        treePositions.forEach(pos => {
            scene.add(createTree(pos.x, pos.z));
        });
        
        // Set initial camera position
        camera.position.set(0, 2, 7);
        camera.lookAt(0, 0, 0);
        
        // Animation variables
        let runnerAngle = 0;
        let runnerLegAngle = 0;
        
        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Move runner around the track
            runnerAngle += 0.01;
            runnerGroup.position.x = Math.sin(runnerAngle) * 3;
            runnerGroup.position.z = Math.cos(runnerAngle) * 3;
            
            // Rotate runner to face the direction of movement
            runnerGroup.rotation.y = runnerAngle + Math.PI / 2;
            
            // Animate the runner's legs and arms
            runnerLegAngle += 0.1;
            const legMovement = Math.sin(runnerLegAngle) * 0.2;
            
            leftLeg.rotation.x = legMovement;
            rightLeg.rotation.x = -legMovement;
            
            leftArm.rotation.x = -legMovement;
            rightArm.rotation.x = legMovement;
            
            controls.update();
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Handle resize
        const resizeScene = () => {
            if (renderer.domElement.clientWidth === 0) return;
            
            camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight);
        };
        
        window.addEventListener('resize', resizeScene);
        
        // Store resize function
        scenes.jogging.resize = resizeScene;
        
        // Handle theme changes
        document.getElementById('theme-toggle').addEventListener('change', () => {
            const newColors = getThemeColors();
            scene.background = new THREE.Color(newColors.background);
            bodyMaterial.color.set(newColors.primary);
        });
    };
    
    // Refresh all scenes (useful after slide changes)
    const refreshAllScenes = () => {
        for (const sceneName in scenes) {
            if (scenes[sceneName].resize) {
                scenes[sceneName].resize();
            }
        }
    };

    // Add a new function to center and resize the hobbies slideshow
    const optimizeHobbiesLayout = () => {
        const hobbiesSection = document.getElementById('hobbies');
        const slideshow = hobbiesSection.querySelector('.hobbies-slideshow');
        const slideContainer = slideshow.querySelector('.slide-container');
        const slides = slideshow.querySelectorAll('.slide');
        
        // Set the height based on viewport
        const viewportHeight = window.innerHeight;
        const headerHeight = document.querySelector('.main-nav').offsetHeight;
        const titleHeight = hobbiesSection.querySelector('h2').offsetHeight;
        const navHeight = slideshow.querySelector('.slideshow-nav').offsetHeight;
        
        // Calculate optimal height
        const optimalHeight = viewportHeight - headerHeight - titleHeight - navHeight - 120; // Extra padding
        
        slides.forEach(slide => {
            const canvasContainer = slide.querySelector('.hobby-canvas-container');
            if (canvasContainer) {
                // Set appropriate height
                canvasContainer.style.height = `${optimalHeight}px`;
            }
        });
        
        // Force resize canvases after layout changes
        setTimeout(refreshAllScenes, 100);
    };

    // Initialize all scenes and slideshow
    const initializeHobbies = () => {
        // First initialize the slideshow
        const slideshow = initSlideshow();
        
        // Then initialize the 3D scenes
        initFootballScene();
        initGamingScene();
        initJoggingScene();
        
        // Force resize of all scenes after a short delay
        setTimeout(refreshAllScenes, 500);
        
        // Refresh scenes when window resizes
        window.addEventListener('resize', refreshAllScenes);
        
        // Observe resizing of containers to refresh canvases
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(refreshAllScenes);
            document.querySelectorAll('.hobby-canvas-container').forEach(container => {
                resizeObserver.observe(container);
            });
        }
        
        // Handle theme change refreshing for fullscreen slides
        document.getElementById('theme-toggle').addEventListener('change', () => {
            // Short delay to allow theme variables to update
            setTimeout(refreshAllScenes, 100);
        });
        
        // Auto-advance slideshow every 12 seconds (longer for fullscreen experience)
        let autoAdvanceInterval;
        
        const startAutoAdvance = () => {
            stopAutoAdvance();
            autoAdvanceInterval = setInterval(() => {
                const activeSlide = document.querySelector('.slide.active');
                if (activeSlide) {
                    const activeIndex = parseInt(activeSlide.dataset.index || 0);
                    slideshow?.goToSlide((activeIndex + 1) % 3);
                }
            }, 12000);
        };
        
        const stopAutoAdvance = () => {
            if (autoAdvanceInterval) {
                clearInterval(autoAdvanceInterval);
            }
        };
        
        // Pause auto-advance when user interacts with slideshow
        document.querySelector('.hobbies-slideshow').addEventListener('mouseenter', stopAutoAdvance);
        document.querySelector('.hobbies-slideshow').addEventListener('touchstart', stopAutoAdvance, { passive: true });
        
        document.querySelector('.hobbies-slideshow').addEventListener('mouseleave', startAutoAdvance);
        document.querySelector('.hobbies-slideshow').addEventListener('touchend', (e) => {
            // Only restart auto-advance if touch end is on the slideshow, not a control
            if (!e.target.closest('.nav-btn') && !e.target.closest('.indicator')) {
                startAutoAdvance();
            }
        }, { passive: true });
        
        // Start auto-advancing
        startAutoAdvance();

        // Optimize layout for full viewport
        optimizeHobbiesLayout();
        
        // Add section transition handling
        document.querySelectorAll('a[href="#hobbies"]').forEach(link => {
            link.addEventListener('click', () => {
                // Wait for scroll to complete then refresh the scenes
                setTimeout(() => {
                    refreshAllScenes();
                    
                    // Make sure the active scene is properly sized
                    const activeSlide = document.querySelector('.slide.active');
                    if (activeSlide) {
                        const activeIndex = parseInt(activeSlide.dataset.index || 0);
                        slideshow?.goToSlide(activeIndex);
                    }
                }, 1000);
            });
        });
    };
    
    // Call the function on load and resize
    window.addEventListener('resize', optimizeHobbiesLayout);
    window.addEventListener('orientationchange', optimizeHobbiesLayout);

    // Initialize with a delay to ensure DOM is fully ready
    setTimeout(initializeHobbies, 500);
});
