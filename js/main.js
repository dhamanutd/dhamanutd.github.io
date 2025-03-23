document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Create embedded animation data from the JSON files to avoid CORS issues
    const programmingAnimationData = {"v":"5.5.7","fr":30,"ip":0,"op":60,"w":800,"h":600,"nm":"Programming Animation","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":0,"ty":4,"nm":"Programming Icon","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[400,300,0],"ix":2},"a":{"a":0,"k":[400,300,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[200,200],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":20,"ix":4},"fill":[{"ty":"fl","c":{"a":0,"k":[0.2,0.6,0.8,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1}],"stroke":[{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":5,"ix":5}}]}],"cix":2,"ix":1,"mn":"ADBE Vector Group"}],"ip":0,"op":60,"st":0,"bm":0}],"markers":[]};
    
    const hobbiesAnimationData = {"v":"5.6.10","fr":30,"ip":0,"op":60,"w":500,"h":500,"nm":"Hobbies Animation","ddd":false,"assets":[],"layers":[{"ddd":false,"ind":0,"ty":4,"nm":"Hobby Icons","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[250,250,0],"ix":2,"l":2},"a":{"a":0,"k":[250,250,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.5],"y":[1]},"o":{"x":[0.5],"y":[0]},"t":0,"s":[0,0,100]},{"t":30,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"el","s":{"a":0,"k":[100,100],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"fillColor":{"a":0,"k":[1,0.5,0,1],"ix":4},"strokeColor":{"a":0,"k":[0,0,0,1],"ix":5},"strokeWidth":{"a":0,"k":0,"ix":6},"d":1,"nm":"Circle"}],"nm":"Circle Group","p":{},"m":1,"ix":1}],"ip":0,"op":60,"st":0,"bm":0}],"markers":[]};
    
    const experienceAnimationData = {"v":"5.6.10","fr":30,"ip":0,"op":120,"w":800,"h":600,"nm":"Experience Animation","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Experience Background","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[400,300,0],"ix":2},"a":{"a":0,"k":[400,300,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[800,600],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":0,"ix":4},"fill":[{"ty":"fl","c":{"a":0,"k":[0.2,0.2,0.2,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1}],"stroke":[],"ix":1,"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false}],"nm":"Rectangle","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":120,"st":0,"bm":0}],"markers":[]};

    if (window.lottie) {
        // Initialize Lottie animations with embedded data
        const lottieAnimations = {
            programming: lottie.loadAnimation({
                container: document.getElementById('programming-animation'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: programmingAnimationData
            }),
            hobbies: lottie.loadAnimation({
                container: document.getElementById('hobbies-animation'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: hobbiesAnimationData
            }),
            experience: lottie.loadAnimation({
                container: document.getElementById('experience-animation'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: experienceAnimationData
            })
        };
    } else {
        console.warn('Lottie library not loaded properly');
    }

    // Initialize particles with inline configuration
    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { 
                    enable: true, 
                    distance: 150, 
                    color: "#ffffff", 
                    opacity: 0.4, 
                    width: 1 
                },
                move: { 
                    enable: true, 
                    speed: 6, 
                    direction: "none", 
                    random: false, 
                    straight: false, 
                    out_mode: "out", 
                    bounce: false 
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    } else {
        console.warn('ParticlesJS library not loaded properly');
    }
});
