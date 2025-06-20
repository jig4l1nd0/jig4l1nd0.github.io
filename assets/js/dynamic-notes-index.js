/**
 * Simplified Dynamic Notes Index System
 * Updates the notes index based on known existing files
 */

class NotesIndexManager {
    constructor() {
        // Map of real files that exist in the project
        this.realNotes = {
            'physics': [
                { file: 'classical-mechanics.html', title: 'Classical Mechanics', featured: true },
                { file: 'quantum-mechanics.html', title: 'Quantum Mechanics', featured: false },
                { file: 'advanced-mathematical-methods.html', title: 'Advanced Mathematical Methods', featured: false }
            ],
            'physics-topics': [
                { topic: 'plasma-physics', name: 'Plasma Physics', notes: ['lawson-criterion.html'] }
            ],
            'mathematics': [
                { file: 'special-functions.html', title: 'Special Functions', featured: true }
            ],
            'computer-science': [
                { file: 'classic-information.html', title: 'Classic Information', featured: false },
                { file: 'quantum-information.html', title: 'Quantum Information', featured: true },
                { file: 'quantum-computation.html', title: 'Quantum Computation', featured: true }
            ],
            'computer-science-topics': [
                { topic: 'generative-ai', name: 'Generative AI', notes: ['transformer-architectures.html'] }
            ]
        };

        this.areas = {
            'physics': {
                name: 'Physics',
                description: 'From classical mechanics to quantum phenomena and plasma dynamics',
                icon: '⚛️',
                className: 'physics-area'
            },
            'mathematics': {
                name: 'Mathematics', 
                description: 'Pure and applied mathematics, from calculus to advanced analysis',
                icon: '∫',
                className: 'mathematics-area'
            },
            'computer-science': {
                name: 'Computer Science',
                description: 'Algorithms, quantum computing, and information theory',
                icon: '💻',
                className: 'cs-area'
            }
        };
    }

    init() {
        console.log('🔍 Initializing simplified notes index...');
        this.updateAreaCards();
        this.updateRecentNotes();
        this.updateQuickStats();
        console.log('✅ Notes index updated successfully');
    }

    updateAreaCards() {
        const areasGrid = document.querySelector('.areas-grid');
        if (!areasGrid) {
            console.warn('Areas grid not found');
            return;
        }

        // Clear existing area cards (except quick actions)
        const existingCards = areasGrid.querySelectorAll('.knowledge-area:not(.quick-actions-area)');
        existingCards.forEach(card => card.remove());

        // Add updated cards for each area
        for (const [areaKey, areaData] of Object.entries(this.areas)) {
            const card = this.createAreaCard(areaKey, areaData);
            const quickActions = areasGrid.querySelector('.quick-actions-area');
            if (quickActions) {
                areasGrid.insertBefore(card, quickActions);
            } else {
                areasGrid.appendChild(card);
            }
        }
    }

    createAreaCard(areaKey, areaData) {
        const directNotes = this.realNotes[areaKey] || [];
        const topicNotes = this.realNotes[`${areaKey}-topics`] || [];
        const totalNotes = directNotes.length + topicNotes.reduce((sum, topic) => sum + topic.notes.length, 0);
        const completionPercentage = Math.min(Math.round((totalNotes / 10) * 100), 100);

        const card = document.createElement('div');
        card.className = `knowledge-area ${areaData.className}`;
        card.setAttribute('data-area', areaKey);

        // Prepare topics to show (topics first, then direct notes)
        const topicsToShow = [];
        
        // Add topic folders
        topicNotes.forEach(topic => {
            topicsToShow.push({
                name: topic.name,
                path: `${areaKey}/${topic.topic}/`,
                notesCount: topic.notes.length,
                featured: true
            });
        });

        // Add direct notes if space available
        const remainingSlots = 4 - topicsToShow.length;
        directNotes.slice(0, remainingSlots).forEach(note => {
            topicsToShow.push({
                name: note.title,
                path: `${areaKey}/${note.file}`,
                notesCount: 1,
                featured: note.featured
            });
        });

        card.innerHTML = `
            <div class="area-background"></div>
            <div class="area-content">
                <div class="area-header">
                    <div class="area-icon">
                        <span class="icon-symbol">${areaData.icon}</span>
                        <div class="icon-bg"></div>
                    </div>
                    <div class="area-info">
                        <h3>${areaData.name}</h3>
                        <p class="area-description">${areaData.description}</p>
                        <div class="area-stats">
                            <span class="notes-count">${totalNotes} notes</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${completionPercentage}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="area-topics">
                    <div class="topics-header">
                        <span>${topicNotes.length > 0 ? 'Topics' : 'Recent Notes'}</span>
                    </div>
                    <div class="topics-list">
                        ${topicsToShow.map((topic, index) => `
                            <a href="${topic.path}" class="topic-chip ${topic.featured && index === 0 ? 'featured' : ''}">
                                <span class="topic-name">${topic.name}</span>
                                <span class="topic-count">${topic.notesCount}</span>
                            </a>
                        `).join('')}
                    </div>
                    <div class="area-action">
                        <a href="${areaKey}/" class="explore-btn">Explore ${areaData.name} →</a>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    updateRecentNotes() {
        const timelineContainer = document.querySelector('.notes-timeline');
        if (!timelineContainer) {
            console.warn('Timeline container not found');
            return;
        }

        // Create recent notes based on real files
        const recentNotesData = [
            {
                title: 'Transformer Architectures',
                path: 'computer-science/generative-ai/transformer-architectures.html',
                area: 'Computer Science',
                areaClass: 'cs',
                date: 'June 19, 2025',
                preview: 'Deep dive into the Transformer architecture that revolutionized AI: self-attention, positional encoding, multi-head attention, and complete PyTorch implementations.',
                tags: ['Transformers', 'Attention Mechanism', 'PyTorch']
            },
            {
                title: 'Quantum Computation',
                path: 'computer-science/quantum-computation.html',
                area: 'Computer Science',
                areaClass: 'cs',
                date: 'June 19, 2025',
                preview: 'Comprehensive guide to quantum computation: quantum circuits, algorithms, error correction, and NISQ implementations.',
                tags: ['Quantum Computing', 'Quantum Algorithms', 'NISQ']
            },
            {
                title: 'Quantum Information Theory',
                path: 'computer-science/quantum-information.html',
                area: 'Computer Science',
                areaClass: 'cs',
                date: 'June 19, 2025',
                preview: 'Quantum information processing: qubits, entanglement, quantum protocols, and quantum communication theory.',
                tags: ['Quantum Information', 'Qubits', 'Entanglement']
            }
        ];

        timelineContainer.innerHTML = recentNotesData.map(note => `
            <article class="note-card">
                <div class="note-header">
                    <h3><a href="${note.path}">${note.title}</a></h3>
                    <div class="note-meta">
                        <span class="note-area ${note.areaClass}">${note.area}</span>
                        <span class="note-date">${note.date}</span>
                    </div>
                </div>
                <p class="note-preview">${note.preview}</p>
                <div class="note-tags">
                    ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </article>
        `).join('');
    }

    updateQuickStats() {
        const totalNotes = Object.values(this.realNotes).reduce((sum, notes) => {
            if (Array.isArray(notes)) {
                return sum + notes.length;
            } else {
                // For topic arrays
                return sum + notes.reduce((topicSum, topic) => topicSum + topic.notes.length, 0);
            }
        }, 0);

        // Update hero subtitle with real stats
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = `${totalNotes} technical notes across ${Object.keys(this.areas).length} knowledge areas, with LaTeX support for equations and diagrams`;
        }

        console.log(`📊 Real stats: ${totalNotes} notes, ${Object.keys(this.areas).length} areas`);
    }

    // Method to add new notes (call this when you create new files)
    addNote(area, noteData) {
        if (!this.realNotes[area]) {
            this.realNotes[area] = [];
        }
        this.realNotes[area].push(noteData);
        this.updateAreaCards();
        this.updateQuickStats();
        console.log(`📝 Added note: ${noteData.title} to ${area}`);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const notesManager = new NotesIndexManager();
    notesManager.init();
    
    // Make it globally available for adding notes
    window.notesManager = notesManager;
});

// Export for use in other scripts
window.NotesIndexManager = NotesIndexManager;