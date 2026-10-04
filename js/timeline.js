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

    // Flat lookup so nested client projects can still be opened in the modal by id
    const itemsById = new Map();
    timelineData.forEach((item, i) => {
        const id = `e${i}`;
        itemsById.set(id, item);
        (item.projects || []).forEach((project, j) => {
            itemsById.set(`${id}-p${j}`, { ...project, parentCompany: item.company });
        });
    });

    const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    // Big-name clients worth "flexing" upfront, deduped by display name (e.g. Keller Williams
    // appears across two separate engagements but should only get one marquee badge).
    const buildFlagshipClients = () => {
        const flat = timelineData.flatMap((item) => [item, ...(item.projects || [])]);
        const seen = new Set();
        return flat
            .filter((item) => item.flagship)
            .filter((item) => {
                const name = item.brandLabel || item.company;
                if (seen.has(name)) return false;
                seen.add(name);
                return true;
            });
    };

    const buildClientsMarquee = () => {
        const clients = buildFlagshipClients();
        if (clients.length === 0) return '';

        const badge = (client) => `
            <div class="client-badge" style="--client-color: ${client.timelineColor || 'var(--primary-color)'}">
                <span class="client-badge-name">${escapeHtml(client.brandLabel || client.company)}</span>
                <span class="client-badge-meta">${escapeHtml([client.industry, client.country].filter(Boolean).join(' · '))}</span>
            </div>
        `;

        // Render the list twice back-to-back so the CSS marquee can loop seamlessly
        const track = clients.map(badge).join('') + clients.map(badge).join('');

        return `
            <div class="clients-marquee">
                <div class="clients-marquee-label">Collaborated with teams at</div>
                <div class="clients-marquee-track">${track}</div>
            </div>
        `;
    };

    // Build the markup for one career chapter slide, including its nested client projects filmstrip
    const buildChapterSlide = (item, index) => {
        const id = `e${index}`;
        const projects = item.projects || [];
        const topSkills = item.skills.slice(0, 5);
        const extraSkills = item.skills.length - topSkills.length;

        const filmstrip = projects.length > 0 ? `
            <div class="chapter-projects">
                <span class="chapter-projects-label"><i class="fas fa-diagram-project"></i> ${projects.length} client project${projects.length > 1 ? 's' : ''}</span>
                <div class="chapter-projects-filmstrip">
                    ${projects
                        .map((project, projectIndex) => ({ project, projectIndex }))
                        .sort((a, b) => (b.project.flagship ? 1 : 0) - (a.project.flagship ? 1 : 0) || b.project.startYear - a.project.startYear)
                        .map(({ project, projectIndex }) => `
                            <button type="button" class="chapter-project-card${project.flagship ? ' is-flagship' : ''}" data-id="${id}-p${projectIndex}">
                                ${project.flagship ? `<span class="chapter-project-flagship-tag"><i class="fas fa-star"></i> Notable client</span>` : ''}
                                <span class="chapter-project-company">${escapeHtml(project.brandLabel || project.company)}</span>
                                <span class="chapter-project-duration">${formatDateRange(project.startYear, project.endYear)}</span>
                                ${project.flagship
                                    ? `<span class="chapter-project-meta">${escapeHtml([project.industry, project.country].filter(Boolean).join(' · '))}</span>`
                                    : `<span class="chapter-project-impact">${escapeHtml(project.impact || project.description)}</span>`}
                            </button>
                        `)
                        .join('')}
                </div>
            </div>
        ` : '';

        return `
            <article class="chapter" data-chapter-id="${id}" style="--chapter-color: ${item.timelineColor || 'var(--primary-color)'}">
                <div class="chapter-content">
                    <div class="chapter-kicker">
                        <span class="chapter-index-label">Chapter ${String(index + 1).padStart(2, '0')}</span>
                        ${getTypeBadge(item.type)}
                        <span class="chapter-duration">${formatDateRange(item.startYear, item.endYear)}</span>
                        ${item.flagship ? `<span class="chapter-flagship-badge"><i class="fas fa-star"></i> Notable client</span>` : ''}
                    </div>
                    <h3 class="chapter-title">${escapeHtml(item.position)}</h3>
                    <p class="chapter-subtitle">
                        ${escapeHtml(item.company)}
                        <span class="chapter-location"><i class="fas fa-map-marker-alt"></i>${escapeHtml(item.location)}</span>
                    </p>
                    ${item.impact ? `<p class="chapter-impact">&ldquo;${escapeHtml(item.impact)}&rdquo;</p>` : ''}
                    <div class="chapter-skills">
                        ${topSkills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                        ${extraSkills > 0 ? `<span class="skill-tag-more">+${extraSkills}</span>` : ''}
                    </div>
                    ${filmstrip}
                    <button type="button" class="chapter-details-btn" data-id="${id}">
                        Full story <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </article>
        `;
    };

    const renderTimeline = () => {
        const chaptersViewport = document.getElementById('chapters-viewport');
        const dotsContainer = document.getElementById('chapter-dots');
        const counterEl = document.getElementById('chapter-counter');
        const prevBtn = document.getElementById('chapter-prev');
        const nextBtn = document.getElementById('chapter-next');
        if (!chaptersViewport) return;

        const introSlide = `
            <section class="chapter chapter-intro" data-chapter-id="intro">
                <div class="chapter-content">
                    <span class="chapter-eyebrow">My Career</span>
                    <h2 class="chapter-title">A Journey, Chapter by Chapter</h2>
                    <p class="chapter-lede">From a computer science classroom to engineering teams across four continents. Scroll or use the arrows to explore.</p>
                    ${buildClientsMarquee()}
                    <div class="chapter-scroll-cue"><i class="fas fa-chevron-down"></i></div>
                </div>
            </section>
        `;

        chaptersViewport.innerHTML = introSlide + timelineData.map(buildChapterSlide).join('');

        const slides = Array.from(chaptersViewport.querySelectorAll('.chapter'));
        const total = slides.length;

        // Build dot navigation, one dot per slide (intro + each chapter)
        dotsContainer.innerHTML = slides.map((slide, i) => {
            const label = i === 0 ? 'Introduction' : timelineData[i - 1].company;
            return `<button type="button" class="chapter-dot" data-slide-index="${i}" aria-label="Go to ${escapeHtml(label)}"></button>`;
        }).join('');
        const dots = Array.from(dotsContainer.querySelectorAll('.chapter-dot'));

        let activeIndex = 0;

        const setActive = (index) => {
            activeIndex = index;
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            counterEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === total - 1;
        };

        const scrollToSlide = (index) => {
            const target = slides[Math.max(0, Math.min(index, total - 1))];
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        // Track which slide is dominant on screen as the user scrolls/swipes
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                    setActive(slides.indexOf(entry.target));
                }
            });
        }, { root: chaptersViewport, threshold: [0.6] });

        slides.forEach((slide) => observer.observe(slide));

        setActive(0);

        dots.forEach((dot, i) => dot.addEventListener('click', () => scrollToSlide(i)));
        prevBtn.addEventListener('click', () => scrollToSlide(activeIndex - 1));
        nextBtn.addEventListener('click', () => scrollToSlide(activeIndex + 1));

        // Keyboard navigation while the deck has focus
        chaptersViewport.addEventListener('keydown', (e) => {
            if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) {
                e.preventDefault();
                scrollToSlide(activeIndex + 1);
            } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
                e.preventDefault();
                scrollToSlide(activeIndex - 1);
            }
        });

        // Open the detail modal from a chapter's "Full story" button or a project filmstrip card
        chaptersViewport.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-id]');
            if (!trigger) return;
            const item = itemsById.get(trigger.getAttribute('data-id'));
            if (item) openModal(item);
        });
    };

    // Modal functionality
    const modal = document.getElementById('timeline-modal');
    const modalBackdrop = document.getElementById('timeline-modal-backdrop');
    const modalClose = document.getElementById('modal-close');

    const openModal = (item) => {
        document.getElementById('modal-title').textContent = item.position;
        document.getElementById('modal-company').textContent = item.brandLabel || item.company;
        document.getElementById('modal-date').textContent = formatDateRange(item.startYear, item.endYear);
        document.getElementById('modal-location').textContent = item.location;
        document.getElementById('modal-description').textContent = item.description;

        // Set type badge
        const typeBadgeContainer = document.getElementById('modal-type-badge');
        if (typeBadgeContainer && item.type) {
            typeBadgeContainer.innerHTML = getTypeBadge(item.type);
        }

        // Flagship badge + industry/country, for big-name clients worth flexing
        const flagshipBadge = document.getElementById('modal-flagship-badge');
        flagshipBadge.style.display = item.flagship ? 'inline-flex' : 'none';

        const industryEl = document.getElementById('modal-industry');
        const industryText = [item.industry, item.country].filter(Boolean).join(' · ');
        if (industryText) {
            industryEl.textContent = industryText;
            industryEl.style.display = 'block';
        } else {
            industryEl.style.display = 'none';
        }

        // Breadcrumb for client projects delivered through a parent engagement
        const parentEl = document.getElementById('modal-parent');
        if (item.parentCompany) {
            parentEl.textContent = `Delivered via ${item.parentCompany}`;
            parentEl.style.display = 'block';
        } else {
            parentEl.style.display = 'none';
        }

        // Impact callout
        const impactEl = document.getElementById('modal-impact');
        if (item.impact) {
            impactEl.textContent = item.impact;
            impactEl.style.display = 'block';
        } else {
            impactEl.style.display = 'none';
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

