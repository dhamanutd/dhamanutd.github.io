const projects = [];

function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    
    // Check if the container exists to prevent errors
    if (!projectsContainer) {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            // Create container if it doesn't exist
            const newContainer = document.createElement('div');
            newContainer.id = 'projects-container';
            newContainer.className = 'project-list';
            projectsSection.appendChild(newContainer);
            
            // Now populate the newly created container
            populateProjects(newContainer);
        } else {
            console.warn('Projects section not found in the document');
        }
    } else {
        populateProjects(projectsContainer);
    }
}

function populateProjects(container) {
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project';
        
        projectElement.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p>Technologies: ${project.technologies.join(', ')}</p>
            <a href="${project.link}" target="_blank">View Project</a>
        `;
        
        container.appendChild(projectElement);
    });
}

document.addEventListener('DOMContentLoaded', renderProjects);
