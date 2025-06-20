/**
 * Simple Prism.js Syntax Highlighter
 * Supports Python, MATLAB, and Rust only
 */

class EnhancedSyntaxHighlighter {
    constructor() {
        this.supportedLanguages = {
            'python': 'Python',
            'matlab': 'MATLAB', 
            'rust': 'Rust'
        };
        this.init();
    }

    async init() {
        await this.loadPrismJS();
        this.processCodeBlocks();
        this.setupCopyButtons();
    }

    async loadPrismJS() {
        try {
            // Load Prism.js core
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js');
            
            // Load only the languages we need
            const languageComponents = [
                'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-matlab.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-rust.min.js'
            ];

            for (const src of languageComponents) {
                await this.loadScript(src);
            }

            // Load line numbers plugin
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js');

            console.log('✅ Prism.js loaded for Python, MATLAB, and Rust');
        } catch (error) {
            console.error('❌ Error loading Prism.js:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    processCodeBlocks() {
        // Process existing <pre><code> blocks
        const codeBlocks = document.querySelectorAll('pre code, .note-code code');
        codeBlocks.forEach(block => this.enhanceCodeBlock(block));
    }

    enhanceCodeBlock(codeElement) {
        const preElement = codeElement.parentElement;
        if (!preElement || preElement.tagName !== 'PRE') return;

        // Extract language from class or data attribute
        let language = this.detectLanguage(codeElement, preElement);
        
        // Only process supported languages
        if (!language || !this.supportedLanguages[language]) {
            console.log(`Skipping unsupported language: ${language}`);
            return;
        }

        // Clean up the code content first
        this.normalizeCodeContent(codeElement);

        // Create enhanced code block structure
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        
        const header = this.createCodeHeader(language);
        wrapper.appendChild(header);

        // Update classes for Prism.js - let Prism handle line numbers
        preElement.className = `language-${language} line-numbers`;
        codeElement.className = `language-${language}`;

        // Wrap the pre element
        preElement.parentNode.insertBefore(wrapper, preElement);
        wrapper.appendChild(preElement);

        // Let Prism.js handle everything including line numbers
        if (window.Prism) {
            window.Prism.highlightElement(codeElement);
        }
    }

    normalizeCodeContent(codeElement) {
        // Get the raw text content
        let code = codeElement.textContent || codeElement.innerText;
        
        // Remove leading and trailing whitespace
        code = code.trim();
        
        // Split into lines and remove empty lines at start/end
        let lines = code.split('\n');
        
        // Remove empty lines from the beginning
        while (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
        }
        
        // Remove empty lines from the end
        while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
            lines.pop();
        }
        
        // Join the lines back together
        const normalizedCode = lines.join('\n');
        
        // Update the element content
        codeElement.textContent = normalizedCode;
        
        console.log(`Normalized code to ${lines.length} lines`);
    }

    detectLanguage(codeElement, preElement) {
        // Check code element classes
        const codeClasses = Array.from(codeElement.classList);
        for (const className of codeClasses) {
            if (className.startsWith('language-')) {
                return className.replace('language-', '');
            }
        }

        // Check pre element classes
        const preClasses = Array.from(preElement.classList);
        for (const className of preClasses) {
            if (className.startsWith('language-')) {
                return className.replace('language-', '');
            }
        }

        // Check data attributes
        const dataLang = preElement.getAttribute('data-language') || 
                        codeElement.getAttribute('data-language') ||
                        preElement.closest('[data-language]')?.getAttribute('data-language');
        
        if (dataLang) {
            return dataLang;
        }

        // Auto-detect based on content
        const code = codeElement.textContent || codeElement.innerText;
        return this.autoDetectLanguage(code);
    }
    
    autoDetectLanguage(code) {
        // Simple heuristics for the three languages we support
        if (code.includes('def ') && (code.includes('import ') || code.includes('print('))) {
            return 'python';
        }
        if (code.includes('function ') && code.includes('end') && code.includes('%')) {
            return 'matlab';
        }
        if (code.includes('fn ') && (code.includes('let ') || code.includes('println!'))) {
            return 'rust';
        }
        
        return null; // Unknown language
    }

    createCodeHeader(language) {
        const header = document.createElement('div');
        header.className = 'code-header';

        const languageLabel = document.createElement('span');
        languageLabel.className = 'code-language';
        languageLabel.textContent = this.supportedLanguages[language];

        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('data-action', 'copy');

        header.appendChild(languageLabel);
        header.appendChild(copyButton);

        return header;
    }

    setupCopyButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.code-copy-btn')) {
                this.copyCodeToClipboard(e.target);
            }
        });
    }

    async copyCodeToClipboard(button) {
        const codeBlock = button.closest('.code-block');
        const codeElement = codeBlock.querySelector('code');
        
        if (!codeElement) return;

        try {
            await navigator.clipboard.writeText(codeElement.textContent);
            
            // Visual feedback
            const originalText = button.textContent;
            button.textContent = '✓ Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (error) {
            console.error('Failed to copy code:', error);
            button.textContent = '✓ Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        }
    }

    // Public method to highlight new content
    highlightNewContent(container) {
        if (!container) container = document;
        
        const codeBlocks = container.querySelectorAll('pre code:not(.highlighted)');
        codeBlocks.forEach(block => {
            this.enhanceCodeBlock(block);
            block.classList.add('highlighted');
        });

        if (window.Prism) {
            window.Prism.highlightAllUnder(container);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.syntaxHighlighter = new EnhancedSyntaxHighlighter();
});

// Also initialize if script loads after DOM
if (document.readyState !== 'loading') {
    window.syntaxHighlighter = new EnhancedSyntaxHighlighter();
}