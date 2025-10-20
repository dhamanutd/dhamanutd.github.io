document.addEventListener('DOMContentLoaded', async () => {
    // Helper function to format date range from startYear and endYear
    const formatDateRange = (startYear, endYear) => {
        if (!startYear) return '';
        if (!endYear || endYear === null) return `${startYear} - Present`;
        if (startYear === endYear) return `${startYear}`;
        return `${startYear} - ${endYear}`;
    };

    // Helper function to get type badge HTML
    const getTypeBadge = (type) => {
        const typeConfig = {
            study: {
                icon: 'fa-graduation-cap',
                label: 'Education'
            },
            work: {
                icon: 'fa-briefcase',
                label: 'Employment'
            },
            project: {
                icon: 'fa-code',
                label: 'Project'
            }
        };

        const config = typeConfig[type] || typeConfig.work;
        return `<span class="timeline-type-badge type-${type}">
            <i class="fas ${config.icon}"></i>
            <span>${config.label}</span>
        </span>`;
    };

    // Load timeline data from JSON file
    let timelineData = [];

    try {
        const response = await fetch('data/timeline.json');
        timelineData = await response.json();
    } catch (error) {
        console.error('Error loading timeline data:', error);
        return;
    }

    const renderTimeline = () => {
        const timelineContainer = document.querySelector('.timeline');
        if (!timelineContainer) return;

        // Clear the container
        timelineContainer.innerHTML = '';

        // Get all unique years from timeline data
        const allYears = new Set();
        timelineData.forEach(item => {
            const currentYear = new Date().getFullYear();
            const endYear = item.endYear || currentYear;
            for (let year = item.startYear; year <= endYear; year++) {
                allYears.add(year);
            }
        });

        const years = Array.from(allYears).sort((a, b) => b - a); // Descending order (newest first)

        // Create timeline controls
        const timelineControls = document.createElement('div');
        timelineControls.className = 'timeline-controls';

        const collapseAllBtn = document.createElement('button');
        collapseAllBtn.className = 'timeline-control-btn';
        collapseAllBtn.innerHTML = '<i class="fas fa-compress-alt"></i> <span>Collapse All</span>';

        const expandAllBtn = document.createElement('button');
        expandAllBtn.className = 'timeline-control-btn';
        expandAllBtn.innerHTML = '<i class="fas fa-expand-alt"></i> <span>Expand All</span>';

        timelineControls.appendChild(collapseAllBtn);
        timelineControls.appendChild(expandAllBtn);
        timelineContainer.appendChild(timelineControls);

        // Create vertical timeline structure
        const timelineVertical = document.createElement('div');
        timelineVertical.className = 'timeline-vertical';

        years.forEach((year) => {
            const yearSection = document.createElement('div');
            yearSection.className = 'timeline-year-section collapsed';
            // Remove AOS from year sections to prevent lazy loading issues with collapse
            // All sections are now rendered immediately for proper collapse/expand functionality
            // Default state is collapsed

            // Find all items that include this year
            const itemsForYear = timelineData.filter(item => {
                const currentYear = new Date().getFullYear();
                const endYear = item.endYear || currentYear;
                return item.startYear <= year && endYear >= year;
            });

            // Count items that start in this year
            const startItemsCount = itemsForYear.filter(item => item.startYear === year).length;

            // Year header with toggle button
            const yearHeader = document.createElement('div');
            yearHeader.className = 'timeline-year-header';

            const yearLabel = document.createElement('div');
            yearLabel.className = 'timeline-year-label';

            const yearToggle = document.createElement('button');
            yearToggle.className = 'timeline-year-toggle';
            yearToggle.setAttribute('aria-label', `Toggle ${year} timeline`);
            yearToggle.innerHTML = `
                <span class="year-text">${year}</span>
                <span class="year-count">${startItemsCount}</span>
                <i class="fas fa-chevron-right toggle-icon"></i>
            `;

            yearLabel.appendChild(yearToggle);
            yearHeader.appendChild(yearLabel);

            // Items container on the right
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'timeline-year-items';

            // Add items for this year
            itemsForYear.forEach((item) => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';

                // Get icon based on type
                const getTypeIcon = (type) => {
                    const icons = {
                        study: 'fa-graduation-cap',
                        work: 'fa-briefcase',
                        project: 'fa-code'
                    };
                    return icons[type] || icons.work;
                };

                // Only show full card if this is the start year
                if (item.startYear === year) {
                    timelineItem.classList.add('timeline-item-start');

                    timelineItem.innerHTML = `
                        <div class="timeline-content" data-index="${timelineData.indexOf(item)}">
                            <div class="timeline-item-header">
                                ${getTypeBadge(item.type)}
                                <span class="timeline-item-duration">${formatDateRange(item.startYear, item.endYear)}</span>
                            </div>
                            <h3 class="timeline-item-title">${item.position}</h3>
                            <h4 class="timeline-item-company">${item.company}</h4>
                            <div class="timeline-item-location">
                                <i class="fas fa-map-marker-alt"></i> ${item.location}
                            </div>
                            <div class="timeline-skills">
                                ${item.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                ${item.skills.length > 3 ? `<span class="skill-tag-more">+${item.skills.length - 3}</span>` : ''}
                            </div>
                        </div>
                        <div class="timeline-item-chip" data-index="${timelineData.indexOf(item)}">
                            <i class="fas ${getTypeIcon(item.type)} timeline-item-chip-icon"></i>
                            <span class="timeline-item-chip-text">${item.company}</span>
                        </div>
                    `;
                } else {
                    // Show continuation indicator for ongoing items
                    timelineItem.classList.add('timeline-item-continue');

                    timelineItem.innerHTML = `
                        <div class="timeline-content-continue" data-index="${timelineData.indexOf(item)}">
                            <div class="timeline-continue-info">
                                <span class="timeline-continue-label">${item.company}</span>
                                <span class="timeline-continue-duration">${formatDateRange(item.startYear, item.endYear)}</span>
                            </div>
                            <i class="fas fa-eye timeline-continue-icon"></i>
                        </div>
                        <div class="timeline-item-chip" data-index="${timelineData.indexOf(item)}">
                            <i class="fas ${getTypeIcon(item.type)} timeline-item-chip-icon"></i>
                            <span class="timeline-item-chip-text">${item.company}</span>
                        </div>
                    `;
                }

                itemsContainer.appendChild(timelineItem);
            });

            yearSection.appendChild(yearHeader);
            yearSection.appendChild(itemsContainer);
            timelineVertical.appendChild(yearSection);

            // Add toggle functionality
            yearToggle.addEventListener('click', (e) => {
                e.stopPropagation();

                yearSection.classList.toggle('collapsed');

                // Update icon
                const icon = yearToggle.querySelector('.toggle-icon');
                if (yearSection.classList.contains('collapsed')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-right');
                } else {
                    icon.classList.remove('fa-chevron-right');
                    icon.classList.add('fa-chevron-down');

                    // When expanding, ensure items are visible and trigger any animations
                    setTimeout(() => {
                        const items = itemsContainer.querySelectorAll('.timeline-item');
                        items.forEach((item, idx) => {
                            item.style.animationDelay = `${idx * 0.05}s`;
                        });
                    }, 50);
                }
            });
        });

        timelineContainer.appendChild(timelineVertical);

        // Add collapse/expand all functionality
        collapseAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.timeline-year-section').forEach(section => {
                if (!section.classList.contains('collapsed')) {
                    section.classList.add('collapsed');
                    const icon = section.querySelector('.toggle-icon');
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-right');
                    }
                }
            });
        });

        expandAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.timeline-year-section').forEach(section => {
                if (section.classList.contains('collapsed')) {
                    section.classList.remove('collapsed');
                    const icon = section.querySelector('.toggle-icon');
                    if (icon) {
                        icon.classList.remove('fa-chevron-right');
                        icon.classList.add('fa-chevron-down');
                    }
                }
            });
        });

        // Add staggered fade-in animation to year sections using CSS
        document.querySelectorAll('.timeline-year-section').forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
        });

        // Add click handlers to open modal
        document.querySelectorAll('.timeline-content, .timeline-content-continue, .timeline-item-chip').forEach(content => {
            content.addEventListener('click', () => {
                const index = parseInt(content.getAttribute('data-index'));
                openModal(timelineData[index]);
            });
        });
    };

    // Modal functionality
    const modal = document.getElementById('timeline-modal');
    const modalBackdrop = document.getElementById('timeline-modal-backdrop');
    const modalClose = document.getElementById('modal-close');

    const openModal = (item) => {
        document.getElementById('modal-title').textContent = item.position;
        document.getElementById('modal-company').textContent = item.company;
        document.getElementById('modal-date').textContent = formatDateRange(item.startYear, item.endYear);
        document.getElementById('modal-location').textContent = item.location;
        document.getElementById('modal-description').textContent = item.description;

        // Set type badge
        const typeBadgeContainer = document.getElementById('modal-type-badge');
        if (typeBadgeContainer && item.type) {
            typeBadgeContainer.innerHTML = getTypeBadge(item.type);
        }

        // Handle skills
        const skillsSection = document.getElementById('modal-skills-section');
        const skillsContainer = document.getElementById('modal-skills');
        if (item.skills && item.skills.length > 0) {
            skillsContainer.innerHTML = item.skills
                .map(skill => `<span class="timeline-modal-skill-tag">${skill}</span>`)
                .join('');
            skillsSection.style.display = 'block';
        } else {
            skillsSection.style.display = 'none';
        }

        // Handle highlights
        const highlightsSection = document.getElementById('modal-highlights-section');
        const highlightsContainer = document.getElementById('modal-highlights');
        if (item.highlights && item.highlights.length > 0) {
            highlightsContainer.innerHTML = item.highlights
                .map(highlight => `<li>${highlight}</li>`)
                .join('');
            highlightsSection.style.display = 'block';
        } else {
            highlightsSection.style.display = 'none';
        }

        modal.style.display = 'block';
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.style.display = 'none';
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal on backdrop click
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    renderTimeline();
});
