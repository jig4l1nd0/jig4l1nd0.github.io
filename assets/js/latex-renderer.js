// LaTeX Renderer - Enhanced math rendering for notes system
// Handles complex mathematical expressions and figure captions

class LaTeXRenderer {
  constructor() {
    this.isKaTeXReady = false;
    this.renderQueue = [];
    this.init();
  }

  async init() {
    // Wait for KaTeX to be available
    await this.waitForKaTeX();
    this.isKaTeXReady = true;
    
    // Process any queued renders
    this.processQueue();
    
    // Set up automatic rendering for new content
    this.setupAutoRender();
  }

  waitForKaTeX() {
    return new Promise((resolve) => {
      const checkKaTeX = () => {
        if (typeof katex !== 'undefined' && typeof renderMathInElement !== 'undefined') {
          resolve();
        } else {
          setTimeout(checkKaTeX, 100);
        }
      };
      checkKaTeX();
    });
  }

  // Enhanced rendering with error handling
  renderMath(element) {
    if (!this.isKaTeXReady) {
      this.renderQueue.push(element);
      return;
    }

    try {
      // Use the global configuration from latex-config.js
      if (typeof autoRenderOptions !== 'undefined') {
        renderMathInElement(element, autoRenderOptions);
      } else {
        // Fallback configuration
        renderMathInElement(element, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }
      
      // Add accessibility attributes
      this.addMathAccessibility(element);
      
    } catch (error) {
      console.error('LaTeX rendering error:', error);
      this.showRenderError(element, error);
    }
  }

  // Process queued renders
  processQueue() {
    while (this.renderQueue.length > 0) {
      const element = this.renderQueue.shift();
      this.renderMath(element);
    }
  }

  // Set up automatic rendering for dynamically added content
  setupAutoRender() {
    // Render existing math
    this.renderMath(document.body);

    // Observer for new content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if node contains math
            if (this.containsMath(node)) {
              this.renderMath(node);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Check if element contains math expressions
  containsMath(element) {
    const mathPatterns = [/\$\$[\s\S]*?\$\$/, /\$[^$]*\$/, /\\\[[\s\S]*?\\\]/, /\\\([\s\S]*?\\\)/];
    const text = element.textContent || '';
    return mathPatterns.some(pattern => pattern.test(text));
  }

  // Add accessibility attributes to rendered math
  addMathAccessibility(container) {
    const mathElements = container.querySelectorAll('.katex');
    mathElements.forEach((math, index) => {
      math.setAttribute('role', 'img');
      math.setAttribute('aria-label', `Mathematical expression ${index + 1}`);
      
      // Try to extract the original LaTeX for screen readers
      const annotation = math.querySelector('annotation[encoding="application/x-tex"]');
      if (annotation) {
        math.setAttribute('aria-label', `Math: ${annotation.textContent}`);
      }
    });
  }

  // Show render errors in a user-friendly way
  showRenderError(container, error) {
    const errorElements = container.querySelectorAll('.katex-error');
    errorElements.forEach(errorEl => {
      errorEl.style.cssText = `
        background-color: #fee2e2;
        color: #dc2626;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-family: monospace;
        font-size: 0.875rem;
        border: 1px solid #fca5a5;
      `;
      errorEl.title = `LaTeX Error: ${error.message}`;
    });
  }

  // Manual render method for specific containers
  renderContainer(selector) {
    const container = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
      
    if (container) {
      this.renderMath(container);
    }
  }

  // Enhanced figure handling
  setupFigureHandling() {
    document.addEventListener('DOMContentLoaded', () => {
      this.processFigures();
    });
  }

  processFigures() {
    const figures = document.querySelectorAll('.note-figure');
    figures.forEach((figure, index) => {
      // Add figure numbering if not present
      const caption = figure.querySelector('.figure-caption');
      if (caption && !caption.innerHTML.includes('Figure')) {
        const figNum = index + 1;
        caption.innerHTML = `<strong>Figure ${figNum}:</strong> ${caption.innerHTML}`;
      }

      // Add loading states for images
      const img = figure.querySelector('img');
      if (img) {
        img.addEventListener('load', () => {
          figure.classList.add('loaded');
        });
        
        img.addEventListener('error', () => {
          figure.classList.add('error');
          console.warn(`Failed to load image: ${img.src}`);
        });
      }
    });
  }

  // Copy math expression to clipboard
  enableMathCopy() {
    document.addEventListener('click', (e) => {
      const mathElement = e.target.closest('.katex');
      if (mathElement && e.altKey) {
        const annotation = mathElement.querySelector('annotation[encoding="application/x-tex"]');
        if (annotation) {
          navigator.clipboard.writeText(annotation.textContent).then(() => {
            this.showCopyFeedback(mathElement);
          });
        }
      }
    });
  }

  showCopyFeedback(element) {
    const feedback = document.createElement('div');
    feedback.textContent = 'LaTeX copied!';
    feedback.style.cssText = `
      position: absolute;
      background: #059669;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      z-index: 1000;
      pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    feedback.style.left = `${rect.left}px`;
    feedback.style.top = `${rect.top - 30}px`;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 1500);
  }
}

// Initialize the renderer
const latexRenderer = new LaTeXRenderer();

// Also set up figure handling
latexRenderer.setupFigureHandling();

// Enable math copy functionality (Alt + click)
latexRenderer.enableMathCopy();

// Export for use in other scripts
window.LaTeXRenderer = LaTeXRenderer;
window.latexRenderer = latexRenderer;