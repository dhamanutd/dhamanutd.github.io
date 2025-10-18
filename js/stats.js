// Calculate and display hero stats from timeline data
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch timeline data
        const response = await fetch('data/timeline.json');
        const timelineData = await response.json();
        
        // Calculate years of experience
        const calculateYearsOfExperience = () => {
            const currentYear = new Date().getFullYear();
            
            // Find the earliest start year from work and project types
            const workAndProjects = timelineData.filter(item => 
                item.type === 'work' || item.type === 'project'
            );
            
            if (workAndProjects.length === 0) return 0;
            
            const earliestYear = Math.min(...workAndProjects.map(item => item.startYear));
            const yearsOfExperience = currentYear - earliestYear;
            
            return yearsOfExperience;
        };
        
        // Calculate total projects
        const calculateTotalProjects = () => {
            return timelineData.filter(item => item.type === 'project').length;
        };
        
        // Calculate unique technical programming skills (from skills.json where isTechnical: true)
        const calculateUniqueSkills = async () => {
            try {
                // Fetch skills.json to get the list of technical programming skills
                const response = await fetch('data/skills.json');
                const skillsConfig = await response.json();

                // Create a set of technical programming skill names (only where isTechnical: true)
                const technicalSkills = new Set(
                    skillsConfig.skills
                        .filter(s => s.isTechnical === true)
                        .map(s => s.name)
                );

                // Count unique technical programming skills from timeline
                const uniqueTechnicalSkills = new Set();

                timelineData.forEach(item => {
                    if (item.skills && Array.isArray(item.skills)) {
                        item.skills.forEach(skill => {
                            // Only count if it's a technical programming skill
                            if (technicalSkills.has(skill)) {
                                uniqueTechnicalSkills.add(skill);
                            }
                        });
                    }
                });

                return uniqueTechnicalSkills.size;
            } catch (error) {
                console.error('Error calculating skills:', error);
                // Fallback: count all unique skills
                const allSkills = new Set();
                timelineData.forEach(item => {
                    if (item.skills && Array.isArray(item.skills)) {
                        item.skills.forEach(skill => allSkills.add(skill));
                    }
                });
                return allSkills.size;
            }
        };
        
        // Get calculated values
        const yearsOfExperience = calculateYearsOfExperience();
        const totalProjects = calculateTotalProjects();
        const uniqueSkills = await calculateUniqueSkills();
        
        // Update the DOM with animation
        const animateNumber = (element, targetValue, suffix = '') => {
            const duration = 1500; // 1.5 seconds
            const steps = 60;
            const increment = targetValue / steps;
            let currentValue = 0;
            let step = 0;
            
            const timer = setInterval(() => {
                step++;
                currentValue = Math.min(Math.round(increment * step), targetValue);
                element.textContent = currentValue + suffix;
                
                if (step >= steps) {
                    clearInterval(timer);
                    element.textContent = targetValue + suffix;
                }
            }, duration / steps);
        };
        
        // Update stats with animation
        const statYears = document.getElementById('stat-years');
        const statProjects = document.getElementById('stat-projects');
        const statSkills = document.getElementById('stat-skills');

        if (statYears) animateNumber(statYears, yearsOfExperience, '+');
        if (statProjects) animateNumber(statProjects, totalProjects, '+');
        if (statSkills) animateNumber(statSkills, uniqueSkills);

        // Update hero description
        const heroDescription = document.getElementById('hero-description');
        if (heroDescription) {
            heroDescription.textContent = `${yearsOfExperience}+ years of experience building scalable applications and leading technical teams across multiple continents`;
        }

    } catch (error) {
        console.error('Error loading stats:', error);

        // Fallback values if loading fails
        const statYears = document.getElementById('stat-years');
        const statProjects = document.getElementById('stat-projects');
        const statSkills = document.getElementById('stat-skills');

        if (statYears) statYears.textContent = '7+';
        if (statProjects) statProjects.textContent = '50+';
        if (statSkills) statSkills.textContent = '40+';
    }
});

