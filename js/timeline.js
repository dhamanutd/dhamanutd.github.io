document.addEventListener('DOMContentLoaded', () => {
    // Timeline data from CV - reorganized in chronological order
    const timelineData = [
        {
            date: "2013 - 2017",
            company: "Universitas Amikom",
            position: "Bachelor's Degree in System Information",
            location: "Yogyakarta, Indonesia",
            description: "Formal education in information systems and computer science.",
            skills: ["System Analysis", "Programming", "Database Design", "Software Engineering"],
            highlights: [
                "Graduated with degree in System Information"
            ],
            timelineColor: "#4285F4"
        },
        {
            date: "2018 - 2024",
            company: "Refactory",
            position: "Senior Principal",
            location: "Sleman, Yogyakarta, Indonesia",
            description: "Leading software development projects from assessment to delivery, with focus on technology stack selection and team management.",
            skills: ["Project Management", "Team Leadership", "Technology Assessment", "Full-stack Development"],
            highlights: [
                "Leading project assessments, defining technologies, and managing development timelines",
                "Collaborating with Product Owners & Project Managers to determine optimal solutions",
                "Managing team performance and adapting plans to ensure project success"
            ],
            timelineColor: "#4285F4"
        },
        {
            date: "2018 - 2019",
            company: "Atenda",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Led development of human resources software system.",
            skills: ["Node.js", "Vue.js", "React Native"],
            highlights: [
                "Led HR Software System development using Node.js, Vue.js, React Native"
            ],
            timelineColor: "#FBBC05"
        },
        {
            date: "2018 - 2019",
            company: "Yabaik",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Led development of Islamic financial technology solution.",
            skills: ["Golang", "React.js", "React Native"],
            highlights: [
                "Led White Label Syariah E-Wallet development using Golang, React.js, React Native"
            ],
            timelineColor: "#EA4335"
        },
        {
            date: "2019 - 2020",
            company: "Keller Williams",
            position: "Software Engineer",
            location: "Austin, Texas",
            description: "Developing goals and reports for agent performance, developing task automation integration for agent leads and contacts",
            skills: ["Next.js", "PHP Lumens", "Redis", "Google PubSub", "Zapier"],
            highlights: [
                "Developing Zapier integration for Keller Williams Agents and building goals and reporting system",
            ],
            timelineColor: "#34A853"
        },
        {
            date: "2019 - 2020",
            company: "Berlian Sistem Informasi",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Developed mobile applications and management systems for automotive industry.",
            skills: ["Flutter", "Vue.js", "C#"],
            highlights: [
                "Developed Mitsubishi Sales Agent App using C#, Flutter & Vue.js",
            ],
            timelineColor: "#FBBC05"
        },
        {
            date: "2020 - 2021",
            company: "Telkomsel",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Built chat systems for one of Telkomsel business products",
            skills: ["Kotlin"],
            highlights: [
                "Developed Dunia Games Chat System (like Discord) using Kotlin",
            ],
            timelineColor: "#EA4335"
        },
        {
            date: "2020 - 2021",
            company: "Lionparcel",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Developed logistics software for a major Indonesian delivery service.",
            skills: ["Golang", "Vue.js", "API Integration"],
            highlights: [
                "Developed Agent Software System for Logistics using Golang & Vue.js",
                "Integrated core systems with partners like Indomaret"
            ],
            timelineColor: "#4285F4"
        },
        {
            date: "2020 - 2021",
            company: "Lauretta",
            position: "Software Engineer",
            location: "Singapore",
            description: "Developed AI-powered security and monitoring solutions.",
            skills: ["React", "Node.js", "Python", "AI/ML", "Computer Vision"],
            highlights: [
                "Developed AI-powered CCTV monitoring & analytics using React, Node.js, Python",
                "Core team member for software system initialization"
            ],
            timelineColor: "#34A853"
        },
        {
            date: "2021 - 2022",
            company: "E-Sidig",
            position: "Lead Principal",
            location: "Jakarta, Indonesia",
            description: "Led planning and execution of government applications.",
            skills: ["Project Management", "Government Systems", "Technical Leadership"],
            highlights: [
                "Led Government Application Planning & Execution without direct coding"
            ],
            timelineColor: "#4285F4"
        },
        {
            date: "2021 - 2022",
            company: "MNC",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Led development of travel services.",
            skills: ["Node.js", "Vue.js", "MySQL", "AWS Amplify", "AWS Lambda"],
            highlights: [
                "Led MisterAladin Explore & B2B service development of new features on existing system",
            ],
            timelineColor: "#FBBC05"
        },
        {
            date: "2021 - 2023",
            company: "Keller Williams",
            position: "Software Engineer",
            location: "Austin, Texas",
            description: "Rejoined to continue work on reporting and notification systems with enhanced features.",
            skills: ["Next.js", "NestJS", "PHP Lumens", "Redis", "Google PubSub", "BigQuery", "MongoDB"],
            highlights: [
                "Further improved Agent's Reporting System and Legacy Notification Service",
                "Implemented new features and system optimizations",
                "Data aggregating and reporting for Keller Williams Agents",
            ],
            timelineColor: "#34A853"
        },
        {
            date: "2022 - 2023",
            company: "IDN Media",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Developed mobile application focused on food content and community.",
            skills: ["Flutter", "Mobile Development"],
            highlights: [
                "Developed Cooking & Recipe Sharing Mobile App using Flutter"
            ],
            timelineColor: "#EA4335"
        },
        {
            date: "2022 - 2023",
            company: "Biofarma",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Core team member for national healthcare digitalization initiative.",
            skills: ["Swift", "Kotlin", "Mobile Development", "Healthcare Systems"],
            highlights: [
                "Core team for Indonesia Healthcare System Digitalization",
                "Led Mediverse mobile development (Swift, Kotlin)"
            ],
            timelineColor: "#34A853"
        },
        {
            date: "2022 - 2023",
            company: "Telkomsel",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Rejoined to expand and enhance telecommunications systems.",
            skills: ["Node.js", "React.js", "RabbitMQ", "Redis", "Amazon SQS/SNS"],
            highlights: [
                "Develop enterprise data package management solutions for Indonesia's largest telecommunications provider.",
                "Implemented system improvements for Enterprise Data Package Management",
                "Applying High Availability architecture"
            ],
            timelineColor: "#EA4335"
        },
        {
            date: "2023",
            company: "MNC",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Rejoined to support big migration of the e-commerce system.",
            skills: ["React.js", "Golang", "Next.js", "PostgreSQL", "MySQL", "Magento"],
            highlights: [
                "Migrated ETL & technology stack from MySQL (EAV) to PostgreSQL, PHP Magento to Golang & Next.js",
                "Enhanced MisterAladin platform with new functionalities",
                "Optimized performance of previously migrated systems"
            ],
            timelineColor: "#FBBC05"
        },
        {
            date: "2023",
            company: "MulaiKelola",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Rapid development of procurement system MVP.",
            skills: ["Golang", "Next.js", "Rapid Development"],
            highlights: [
                "Developed E-Procurement MVP in 1 month using Golang & Next.js"
            ],
            timelineColor: "#34A853"
        },
        {
            date: "2023 - 2024",
            company: "Gaya Motor",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Led development of procurement systems using Microsoft technologies.",
            skills: ["C#", ".Net", "Blazor"],
            highlights: [
                "Led E-Procurement System Development using C# .Net & Blazor"
            ],
            timelineColor: "#4285F4"
        },
        {
            date: "2023 - 2024",
            company: "Berlian Sistem Informasi",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Rejoined to develop on the old systems.",
            skills: ["C#", "K2 Workflow", "React.js"],
            highlights: [
                "Created Approval Management System using C# & K2 Workflow",
                "Developed Car Pool Management System using React.js"
            ],
            timelineColor: "#FBBC05"
        },
        {
            date: "2023 - 2024",
            company: "Lauretta",
            position: "Software Engineer",
            location: "Singapore",
            description: "Rejoined to advance AI-powered security solutions with improved algorithms.",
            skills: ["React", "Node.js", "Python", "AI/ML", "Computer Vision"],
            highlights: [
                "Enhanced AI capabilities for CCTV monitoring with advanced analytics",
                "Implemented new machine learning models for improved detection accuracy"
            ],
            timelineColor: "#34A853"
        },
        {
            date: "2024",
            company: "WTF",
            position: "Software Engineer",
            location: "Singapore",
            description: "Led development of food-sharing application with AI capabilities.",
            skills: ["Golang", "React.js", "Flutter", "Python", "AI/ML"],
            highlights: [
                "Led MVP development for food-sharing & AI suggestions using Golang, React.js, Flutter, Python"
            ],
            timelineColor: "#FBBC05"
        },
        {
            date: "2024",
            company: "Paper Indonesia",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Developed white label financial technology solution.",
            skills: ["Golang", "Fintech"],
            highlights: [
                "Developed White Label E-Wallet Application using Golang"
            ],
            timelineColor: "#EA4335"
        },
        {
            date: "2024",
            company: "Cellcast",
            position: "Software Engineer",
            location: "Melbourne, Australia",
            description: "Develop text messaging platform for broadcasting and blasting messages.",
            skills: ["Golang", "Node.js", "React.js", "Communication", "AWS", "AWS Lambda", "AWS CloudFormation"],
            highlights: [
                "Migrating existing system from Node.js to Golang and deploy it to AWS Lambda for the serverless architecture. To achieve millions processes in lower budget",
            ],
            timelineColor: "#3898ec"
        },
        {
            date: "2024",
            company: "Berlian Sistem Informasi",
            position: "Software Engineer",
            location: "Jakarta, Indonesia",
            description: "Rejoined to join initiator team for the R&D division to building an AI assistance platform.",
            skills: ["Flutter", "C#", "AI/ML", "Prompt Engineering"],
            highlights: [
                "Development eye-catchy UI for the AI assistance platform using Flutter, tweak and tuning prompt engineering to achieve the best result",
            ],
            timelineColor: "#FBBC05"
        },
        {
            date: "2025 - Present",
            company: "Peek & Cloppenburg",
            position: "Software Engineer",
            location: "Dusseldorf, Germany",
            description: "Developing mobile application for the fashion retail industry.",
            skills: ["Flutter"],
            highlights: [
              "Developing mobile application for the fashion retail industry using Flutter",
            ],
            timelineColor: "#333333"
        }
    ];

    const renderTimeline = () => {
        const timelineContainer = document.querySelector('.timeline');
        if (!timelineContainer) return;

        // Create a wrapper for the timeline if it doesn't exist
        let timelineWrapper = timelineContainer.parentElement.querySelector('.timeline-wrapper');
        if (!timelineWrapper) {
            timelineWrapper = document.createElement('div');
            timelineWrapper.className = 'timeline-wrapper';
            timelineContainer.parentNode.insertBefore(timelineWrapper, timelineContainer);
            timelineWrapper.appendChild(timelineContainer);
        }

        // Clear the container
        timelineContainer.innerHTML = '';
        
        // Create a track for the timeline items
        const timelineTrack = document.createElement('div');
        timelineTrack.className = 'timeline-track';
        timelineContainer.appendChild(timelineTrack);
        
        // Add scroll indicators to the wrapper, not the scrollable container
        let scrollLeftIndicator = timelineWrapper.querySelector('.timeline-scroll-indicator.timeline-scroll-left');
        if (!scrollLeftIndicator) {
            scrollLeftIndicator = document.createElement('div');
            scrollLeftIndicator.className = 'timeline-scroll-indicator timeline-scroll-left';
            scrollLeftIndicator.innerHTML = '<i class="fas fa-chevron-left"></i>';
            timelineWrapper.appendChild(scrollLeftIndicator);
        }
        
        let scrollRightIndicator = timelineWrapper.querySelector('.timeline-scroll-indicator.timeline-scroll-right');
        if (!scrollRightIndicator) {
            scrollRightIndicator = document.createElement('div');
            scrollRightIndicator.className = 'timeline-scroll-indicator timeline-scroll-right';
            scrollRightIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';
            timelineWrapper.appendChild(scrollRightIndicator);
        }
        
        // Add timeline items to the track
        timelineData.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.setAttribute('data-aos', 'fade-up');
            timelineItem.setAttribute('data-aos-duration', '800');
            timelineItem.setAttribute('data-aos-delay', `${index * 100}`);
            timelineItem.style.setProperty('--i', index);
            timelineItem.style.setProperty('--timeline-marker-color', item.timelineColor || '#333333');
            
            timelineItem.innerHTML = `
                <div class="timeline-date">${item.date}</div>
                <div class="timeline-content" id="timeline-content-${index+1}">
                    <div class="timeline-info">
                        <h3>${item.position}</h3>
                        <h4>${item.company}</h4>
                        <div class="timeline-location">
                            <i class="fas fa-map-marker-alt"></i> ${item.location}
                        </div>
                        <p>${item.description}</p>
                        <div class="timeline-skills">
                            ${item.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                        <ul class="timeline-highlights">
                            ${item.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                        <button class="timeline-expand-btn" aria-label="Expand details" data-content-id="timeline-content-${index+1}">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                </div>
            `;
            
            timelineTrack.appendChild(timelineItem);
        });
        
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                once: false,
                mirror: true
            });
        }
        
        // Add event listeners for expand buttons
        document.querySelectorAll('.timeline-expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contentId = btn.getAttribute('data-content-id');
                const content = document.getElementById(contentId);
                content.classList.toggle('expanded');
                e.stopPropagation();
            });
        });
        
        // Add event listeners for scroll indicators
        scrollLeftIndicator.addEventListener('click', () => {
            timelineContainer.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
        
        scrollRightIndicator.addEventListener('click', () => {
            timelineContainer.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
        
        // Add keyboard navigation for accessibility
        timelineContainer.tabIndex = 0;
        timelineContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                timelineContainer.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowLeft') {
                timelineContainer.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            }
        });
        
        // Optional: Add drag to scroll functionality
        let isDown = false;
        let startX;
        let scrollLeft;

        timelineContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            timelineContainer.style.cursor = 'grabbing';
            startX = e.pageX - timelineContainer.offsetLeft;
            scrollLeft = timelineContainer.scrollLeft;
        });
        
        timelineContainer.addEventListener('mouseleave', () => {
            isDown = false;
            timelineContainer.style.cursor = 'grab';
        });
        
        timelineContainer.addEventListener('mouseup', () => {
            isDown = false;
            timelineContainer.style.cursor = 'grab';
        });
        
        timelineContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - timelineContainer.offsetLeft;
            const walk = (x - startX) * 2; // Adjust scroll speed
            timelineContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Set initial grab cursor
        timelineContainer.style.cursor = 'grab';
    };

    renderTimeline();
    
    // Re-initialize on theme change
    document.getElementById('theme-toggle').addEventListener('change', () => {
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 300);
    });
    
    // Add window resize handler for responsive adjustments
    window.addEventListener('resize', () => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
});
