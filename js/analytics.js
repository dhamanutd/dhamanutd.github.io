document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Analytics tracking
    
    // Track section visibility
    const sectionVisibilityTracker = () => {
        // Initial state storage - only track sections that exist
        const sectionStates = {};
        
        // Track timeline scroll progress
        let timelineMaxScroll = 0;
        const timeline = document.querySelector('.timeline');
        
        if (timeline) {
            timeline.addEventListener('scroll', () => {
                const scrollPercentage = Math.round((timeline.scrollLeft / (timeline.scrollWidth - timeline.clientWidth)) * 100);

                // Update max scroll if current scroll is further
                if (scrollPercentage > timelineMaxScroll && typeof gtag === 'function') {
                    timelineMaxScroll = scrollPercentage;

                    // Track important milestones (25%, 50%, 75%, 100%)
                    if (scrollPercentage >= 25 && timelineMaxScroll < 50) {
                        gtag('event', 'timeline_scroll', {
                            'event_category': 'engagement',
                            'event_label': 'timeline_25_percent',
                            'value': 25
                        });
                    } else if (scrollPercentage >= 50 && timelineMaxScroll < 75) {
                        gtag('event', 'timeline_scroll', {
                            'event_category': 'engagement',
                            'event_label': 'timeline_50_percent',
                            'value': 50
                        });
                    } else if (scrollPercentage >= 75 && timelineMaxScroll < 100) {
                        gtag('event', 'timeline_scroll', {
                            'event_category': 'engagement',
                            'event_label': 'timeline_75_percent',
                            'value': 75
                        });
                    } else if (scrollPercentage >= 99) {
                        gtag('event', 'timeline_scroll', {
                            'event_category': 'engagement',
                            'event_label': 'timeline_complete',
                            'value': 100
                        });
                    }
                }
            });
        }
        
        // Use Intersection Observer to track when sections are visible
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // Section is considered "viewed" when 50% visible
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;

                // Initialize section state if it doesn't exist
                if (!sectionStates[sectionId]) {
                    sectionStates[sectionId] = { visible: false, startTime: 0, totalTime: 0 };
                }

                // If section is now visible but wasn't before
                if (entry.isIntersecting && !sectionStates[sectionId].visible) {
                    sectionStates[sectionId].visible = true;
                    sectionStates[sectionId].startTime = Date.now();

                    // Track section view event
                    if (typeof gtag === 'function') {
                        gtag('event', 'section_view', {
                            'event_category': 'engagement',
                            'event_label': `viewed_${sectionId}_section`
                        });
                    }

                // If section is no longer visible but was before
                } else if (!entry.isIntersecting && sectionStates[sectionId].visible) {
                    sectionStates[sectionId].visible = false;
                    const timeSpent = Math.round((Date.now() - sectionStates[sectionId].startTime) / 1000);
                    sectionStates[sectionId].totalTime += timeSpent;

                    // Track time spent on section if more than 2 seconds (to filter quick scrolls)
                    if (timeSpent > 2 && typeof gtag === 'function') {
                        gtag('event', 'section_engagement', {
                            'event_category': 'engagement',
                            'event_label': `time_on_${sectionId}`,
                            'value': timeSpent
                        });
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section, header').forEach(section => {
            if (section.id) {
                sectionObserver.observe(section);
            }
        });
        
        // Track engagement on page unload
        window.addEventListener('beforeunload', () => {
            if (typeof gtag !== 'function') return;

            // For each visible section when user leaves, log total time
            Object.keys(sectionStates).forEach(sectionId => {
                if (sectionStates[sectionId].visible) {
                    const finalTimeSpent = Math.round((Date.now() - sectionStates[sectionId].startTime) / 1000);
                    sectionStates[sectionId].totalTime += finalTimeSpent;
                }

                // Only send final total if significant time was spent
                if (sectionStates[sectionId].totalTime > 3) {
                    gtag('event', 'section_total_time', {
                        'event_category': 'engagement',
                        'event_label': `total_time_${sectionId}`,
                        'value': sectionStates[sectionId].totalTime,
                        'non_interaction': true
                    });
                }
            });

            // Track timeline max scroll on exit if user engaged with timeline
            if (timelineMaxScroll > 0) {
                gtag('event', 'timeline_max_scroll', {
                    'event_category': 'engagement',
                    'event_label': 'timeline_scroll_exit',
                    'value': timelineMaxScroll,
                    'non_interaction': true
                });
            }
        });
    };
    
    // Initialize tracking when consent is granted
    // gtag is already loaded, but we need to wait for user consent
    const initTracker = () => {
        if (typeof gtag === 'function') {
            sectionVisibilityTracker();
        }
    };

    // Listen for consent granted event from cookie-consent.js
    window.addEventListener('consentGranted', initTracker);

    // Also initialize immediately if consent was already given (returning user)
    // Check if analytics_storage is granted by checking if GA cookies exist
    if (document.cookie.includes('_ga')) {
        initTracker();
    }
});
