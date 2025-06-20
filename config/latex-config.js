// KaTeX Configuration for Mathematical Rendering
// Handles both inline and display math expressions

// KaTeX rendering options
const katexOptions = {
  // Display settings
  displayMode: false,
  throwOnError: false,
  errorColor: '#cc0000',
  
  // Math delimiters
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false }
  ],
  
  // Macros for common expressions
  macros: {
    "\\RR": "\\mathbb{R}",
    "\\CC": "\\mathbb{C}",
    "\\NN": "\\mathbb{N}",
    "\\ZZ": "\\mathbb{Z}",
    "\\QQ": "\\mathbb{Q}",
    "\\grad": "\\nabla",
    "\\curl": "\\nabla \\times",
    "\\div": "\\nabla \\cdot",
    "\\laplacian": "\\nabla^2",
    "\\partial": "\\frac{\\partial}{\\partial}",
    "\\pderiv": ["\\frac{\\partial #1}{\\partial #2}", 2],
    "\\dderiv": ["\\frac{d #1}{d #2}", 2],
    "\\norm": ["\\left\\|#1\\right\\|", 1],
    "\\abs": ["\\left|#1\\right|", 1],
    "\\braket": ["\\langle #1 \\rangle", 1],
    "\\bra": ["\\langle #1 |", 1],
    "\\ket": ["| #1 \\rangle", 1],
    "\\expectation": ["\\langle #1 \\rangle", 1]
  },
  
  // Physics-specific macros
  physicsMode: true,
  strict: false,
  trust: true,
  
  // Output settings
  output: 'html',
  fleqn: false,
  leqno: false,
  minRuleThickness: 0.04
};

// Auto-render configuration
const autoRenderOptions = {
  delimiters: katexOptions.delimiters,
  ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
  ignoredClasses: ['no-math'],
  preProcess: (math) => {
    // Custom preprocessing for special notations
    return math.replace(/\\newcommand/g, '');
  },
  renderError: (error) => {
    console.warn('KaTeX rendering error:', error);
    return `<span class="katex-error">${error.message}</span>`;
  }
};

// Initialize KaTeX when DOM is ready
function initializeKaTeX() {
  if (typeof renderMathInElement !== 'undefined') {
    // Render all math on the page
    renderMathInElement(document.body, autoRenderOptions);
    
    // Set up observers for dynamic content
    setupMathObserver();
    
    console.log('KaTeX initialized successfully');
  } else {
    console.warn('KaTeX auto-render not available');
  }
}

// Observer for dynamically added content
function setupMathObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            renderMathInElement(node, autoRenderOptions);
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Manual rendering function for specific elements
function renderMathInContainer(container) {
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(container, autoRenderOptions);
  }
}

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    katexOptions,
    autoRenderOptions,
    initializeKaTeX,
    renderMathInContainer
  };
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', initializeKaTeX);