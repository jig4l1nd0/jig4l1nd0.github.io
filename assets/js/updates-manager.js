class UpdatesManager {
    constructor() {
        this.updates = [
            {
                date: '2025-07',
                type: 'Project',
                title: 'Enhanced website features and SEO optimization',
                link: null
            },
            {
                date: '2025-06',
                type: 'Note',
                title: 'LaTeX integration for math rendering',
                link: 'pages/notes/index.html'
            },
            {
                date: '2025-06',
                type: 'Project',
                title: 'Personal website development',
                link: 'pages/projects/index.html'
            },
            {
                date: '2025-05',
                type: 'Research',
                title: 'New computational modeling experiments',
                link: 'pages/projects/research.html'
            },
            {
                date: '2025-05',
                type: 'Note',
                title: 'Quantum Information Theory documentation',
                link: 'pages/notes/computer-science/quantum-information.html'
            }
        ];
    }

    render() {
        const container = document.querySelector('.updates-grid');
        if (!container) return;

        // Tomar solo los últimos 3-4 updates
        const recentUpdates = this.updates.slice(0, 4);

        container.innerHTML = recentUpdates.map(update => `
            <div class="update-item">
                <span class="update-date">${update.date}</span>
                <span class="update-type">${update.type}</span>
                <span class="update-title">
                    ${update.link ? `<a href="${update.link}">${update.title}</a>` : update.title}
                </span>
            </div>
        `).join('');
    }

    addUpdate(update) {
        this.updates.unshift(update);
        this.render();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const updatesManager = new UpdatesManager();
    updatesManager.render();

    // Hacer disponible globalmente para agregar updates fácilmente
    window.updatesManager = updatesManager;
});