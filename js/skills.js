document.addEventListener('DOMContentLoaded', async () => {
    // Load skills data from JSON
    let skillsData = [];
    let categories = {};
    let timelineData = [];

    try {
        const response = await fetch('data/skills.json');
        const skillsConfig = await response.json();
        skillsData = skillsConfig.skills;
        categories = skillsConfig.categories;
    } catch (error) {
        console.error('Error loading skills data:', error);
        return;
    }

    // Load timeline data and extract skills
    const extractSkillsFromTimeline = async () => {
        try {
            const response = await fetch('data/timeline.json');
            timelineData = await response.json();
            const skillsMap = {};

            timelineData.forEach(item => {
                if (item.skills && Array.isArray(item.skills)) {
                    item.skills.forEach(skill => {
                        skillsMap[skill] = (skillsMap[skill] || 0) + 1;
                    });
                }
            });

            return skillsMap;
        } catch (error) {
            console.error('Error loading timeline data for skills:', error);
            return {};
        }
    };

    // Render skills by category
    const renderSkills = async () => {
        const skillsGrid = document.getElementById('skills-grid');
        if (!skillsGrid) return;

        // Load skills from timeline data
        const skillsMap = await extractSkillsFromTimeline();

        // Add project counts to skills
        const enrichedSkills = skillsData.map(skill => ({
            ...skill,
            count: skillsMap[skill.name] || 0
        }));

        // Group skills by category
        const groupedSkills = {};
        enrichedSkills.forEach(skill => {
            if (!groupedSkills[skill.category]) {
                groupedSkills[skill.category] = [];
            }
            groupedSkills[skill.category].push(skill);
        });

        // Sort skills within each category by count
        Object.keys(groupedSkills).forEach(category => {
            groupedSkills[category].sort((a, b) => b.count - a.count);
        });

        // Render as simple grid
        const categoryOrder = ['Frontend', 'Mobile', 'Backend', 'Data', 'DevOps', 'Management'];
        skillsGrid.innerHTML = categoryOrder.map((categoryName, catIndex) => {
            const categoryConfig = categories[categoryName];
            const categorySkills = groupedSkills[categoryName] || [];

            if (categorySkills.length === 0) return '';

            return `
                <div class="skill-category" data-aos="fade-up" data-aos-duration="600" data-aos-delay="${catIndex * 100}" style="--category-color: ${categoryConfig.color}">
                    <div class="skill-category-header">
                        <div class="skill-category-icon">
                            <i class="${categoryConfig.icon}"></i>
                        </div>
                        <div class="skill-category-info">
                            <h3 class="skill-category-title">${categoryName}</h3>
                            <p class="skill-category-description">${categoryConfig.description}</p>
                        </div>
                        <div class="skill-category-count">${categorySkills.length} skills</div>
                    </div>
                    <div class="skill-pills">
                        ${categorySkills.map(skill => `
                            <div class="skill-pill ${skill.count > 0 ? 'skill-pill-clickable' : ''}" data-skill-name="${skill.name}" data-skill-icon="${skill.icon}">
                                <i class="${skill.icon}"></i>
                                <span class="skill-pill-name">${skill.name}</span>
                                ${skill.count > 0 ? `<span class="skill-pill-badge" title="${skill.count} projects">${skill.count} proj</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Reinitialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        // Add click handlers to skill pills
        addSkillClickHandlers();
    };

    // Skill modal functionality
    const modal = document.getElementById('skill-modal');
    const modalBackdrop = document.getElementById('skill-modal-backdrop');
    const modalClose = document.getElementById('skill-modal-close');

    const formatDateRange = (startYear, endYear) => {
        if (!endYear) {
            return `${startYear} - Present`;
        }
        return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
    };

    const getTypeBadge = (type) => {
        const badges = {
            'work': '<span class="type-badge type-badge-work"><i class="fas fa-briefcase"></i> Work</span>',
            'project': '<span class="type-badge type-badge-project"><i class="fas fa-code"></i> Project</span>',
            'study': '<span class="type-badge type-badge-study"><i class="fas fa-graduation-cap"></i> Study</span>'
        };
        return badges[type] || '';
    };

    const openSkillModal = (skillName, skillIcon) => {
        // Filter timeline data by skill
        const projectsWithSkill = timelineData.filter(item =>
            item.skills && item.skills.includes(skillName)
        );

        // Sort by start year (descending)
        projectsWithSkill.sort((a, b) => b.startYear - a.startYear);

        // Update modal content
        document.getElementById('skill-modal-title').textContent = skillName;
        document.getElementById('skill-modal-icon').className = `skill-modal-icon ${skillIcon}`;
        document.getElementById('skill-modal-subtitle').textContent =
            `${projectsWithSkill.length} ${projectsWithSkill.length === 1 ? 'project' : 'projects'} using this technology`;

        // Render projects
        const projectsContainer = document.getElementById('skill-modal-projects');
        projectsContainer.innerHTML = projectsWithSkill.map(item => `
            <div class="skill-modal-project-card">
                <div class="skill-modal-project-header">
                    ${getTypeBadge(item.type)}
                    <span class="skill-modal-project-date">${formatDateRange(item.startYear, item.endYear)}</span>
                </div>
                <h3 class="skill-modal-project-title">${item.position}</h3>
                <h4 class="skill-modal-project-company">${item.company}</h4>
                <p class="skill-modal-project-description">${item.description}</p>
                ${item.highlights && item.highlights.length > 0 ? `
                    <ul class="skill-modal-project-highlights">
                        ${item.highlights.slice(0, 2).map(highlight => `<li>${highlight}</li>`).join('')}
                        ${item.highlights.length > 2 ? `<li class="skill-modal-more">+${item.highlights.length - 2} more highlights</li>` : ''}
                    </ul>
                ` : ''}
            </div>
        `).join('');

        // Show modal
        modal.style.display = 'block';
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeSkillModal = () => {
        modal.style.display = 'none';
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Add click handlers to skill pills
    const addSkillClickHandlers = () => {
        const skillPills = document.querySelectorAll('.skill-pill-clickable');
        skillPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const skillName = pill.getAttribute('data-skill-name');
                const skillIcon = pill.getAttribute('data-skill-icon');
                openSkillModal(skillName, skillIcon);
            });
        });
    };

    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeSkillModal);
    }

    // Close modal on backdrop click
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeSkillModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeSkillModal();
        }
    });

    // Initialize
    renderSkills();
});

