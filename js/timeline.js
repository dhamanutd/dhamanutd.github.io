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

        // Create vertical timeline structure
        const timelineVertical = document.createElement('div');
        timelineVertical.className = 'timeline-vertical';

        years.forEach((year, yearIndex) => {
            const yearSection = document.createElement('div');
            yearSection.className = 'timeline-year-section';
            yearSection.setAttribute('data-aos', 'fade-up');
            yearSection.setAttribute('data-aos-duration', '600');
            yearSection.setAttribute('data-aos-delay', `${yearIndex * 50}`);

            // Year label on the left
            const yearLabel = document.createElement('div');
            yearLabel.className = 'timeline-year-label';
            yearLabel.textContent = year;

            // Items container on the right
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'timeline-year-items';

            // Find all items that include this year
            const itemsForYear = timelineData.filter(item => {
                const currentYear = new Date().getFullYear();
                const endYear = item.endYear || currentYear;
                return item.startYear <= year && endYear >= year;
            });

            // Add items for this year
            itemsForYear.forEach((item, itemIndex) => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';

                // Only show full card if this is the start year
                if (item.startYear === year) {
                    timelineItem.classList.add('timeline-item-start');
                    timelineItem.style.setProperty('--timeline-marker-color', item.timelineColor || '#6366F1');

                    timelineItem.innerHTML = `
                        <div class="timeline-item-marker"></div>
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
                    `;
                } else {
                    // Show continuation indicator for ongoing items
                    timelineItem.classList.add('timeline-item-continue');
                    timelineItem.style.setProperty('--timeline-marker-color', item.timelineColor || '#6366F1');

                    timelineItem.innerHTML = `
                        <div class="timeline-item-marker"></div>
                        <div class="timeline-content-continue" data-index="${timelineData.indexOf(item)}">
                            <div class="timeline-continue-info">
                                <span class="timeline-continue-label">${item.company}</span>
                                <span class="timeline-continue-duration">${formatDateRange(item.startYear, item.endYear)}</span>
                            </div>
                            <i class="fas fa-eye timeline-continue-icon"></i>
                        </div>
                    `;
                }

                itemsContainer.appendChild(timelineItem);
            });

            yearSection.appendChild(yearLabel);
            yearSection.appendChild(itemsContainer);
            timelineVertical.appendChild(yearSection);
        });

        timelineContainer.appendChild(timelineVertical);

        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                once: true,
                offset: 50
            });
        }

        // Add click handlers to open modal
        document.querySelectorAll('.timeline-content, .timeline-content-continue').forEach(content => {
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

    // Re-initialize on theme change (if theme toggle exists)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 300);
        });
    }

    // Add window resize handler for responsive adjustments
    window.addEventListener('resize', () => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
});
