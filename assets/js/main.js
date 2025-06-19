/**
 * Main JavaScript file for Personal Digital Space
 * Handles core functionality and initialization
 */

// Global app state
const App = {
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('language') || 'en',
  isInitialized: false
};

// Utility functions
const Utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Smooth scroll to element
  scrollToElement(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  },

  // Get element by selector with error handling
  getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
      return null;
    }
    return element;
  },

  // Format date for display
  formatDate(date, locale = 'en-US') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  },

  // Simple template engine
  template(str, data) {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || '');
  }
};

// Navigation functionality
const Navigation = {
  init() {
    this.setupSmoothScrolling();
    this.setupActiveNavigation();
    this.setupMobileNavigation();
  },

  setupSmoothScrolling() {
    // Handle anchor links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          Utils.scrollToElement(target, 80); // Account for sticky header
        }
      }
    });
  },

  setupActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (currentPath.includes(href) || (href === 'index.html' && currentPath === '/'))) {
        link.classList.add('active');
      }
    });
  },

  setupMobileNavigation() {
    // Add mobile menu toggle if needed
    const mobileToggle = Utils.getElement('.mobile-nav-toggle');
    const navMenu = Utils.getElement('.nav-menu');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-navigation')) {
          navMenu.classList.remove('mobile-open');
          mobileToggle.classList.remove('active');
        }
      });
    }
  }
};

// Scroll effects and animations
const ScrollEffects = {
  init() {
    this.setupScrollToTop();
    this.setupScrollAnimations();
    this.setupHeaderScroll();
  },

  setupScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top hidden';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);

    // Show/hide scroll button
    const toggleScrollButton = Utils.throttle(() => {
      if (window.scrollY > 400) {
        scrollButton.classList.remove('hidden');
      } else {
        scrollButton.classList.add('hidden');
      }
    }, 100);

    window.addEventListener('scroll', toggleScrollButton);

    // Scroll to top functionality
    scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  setupScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .update-item, .hero-content');
    animateElements.forEach(el => {
      observer.observe(el);
    });
  },

  setupHeaderScroll() {
    // Add scroll effect to header
    const header = Utils.getElement('.site-header');
    if (!header) return;

    const handleScroll = Utils.throttle(() => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 50);

    window.addEventListener('scroll', handleScroll);
  }
};

// Form handling
const Forms = {
  init() {
    this.setupFormValidation();
    this.setupFormSubmission();
  },

  setupFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', Utils.debounce(() => this.validateField(input), 300));
      });

      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });
    });
  },

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let message = '';

    // Required validation
    if (required && !value) {
      isValid = false;
      message = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }

    // Show/hide error message
    this.showFieldError(field, isValid, message);
    return isValid;
  },

  validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },

  showFieldError(field, isValid, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Add error class
    field.classList.toggle('field-invalid', !isValid);
    field.classList.toggle('field-valid', isValid && field.value.trim());

    // Show error message
    if (!isValid && message) {
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      field.parentNode.appendChild(errorElement);
    }
  },

  setupFormSubmission() {
    // Handle contact form submissions
    const contactForms = document.querySelectorAll('form[data-contact]');
    
    contactForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleContactForm(form);
      });
    });
  },

  async handleContactForm(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    try {
      // Show loading state
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      this.showFormMessage(form, 'Message sent successfully!', 'success');
      form.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      this.showFormMessage(form, 'Failed to send message. Please try again.', 'error');
    } finally {
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  },

  showFormMessage(form, message, type) {
    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.textContent = message;
    
    // Insert at top of form
    form.insertBefore(messageElement, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 5000);
  }
};

// Performance and loading
const Performance = {
  init() {
    this.setupLazyLoading();
    this.setupImageOptimization();
  },

  setupLazyLoading() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  },

  setupImageOptimization() {
    // Add loading="lazy" to images without it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }
};

// Accessibility improvements
const Accessibility = {
  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupAriaLabels();
  },

  setupKeyboardNavigation() {
    // Handle escape key for modals/dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open modals, dropdowns, etc.
        const openElements = document.querySelectorAll('.modal.open, .dropdown.open');
        openElements.forEach(el => {
          el.classList.remove('open');
        });
      }
    });

    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only focus:not-sr-only';
    document.body.insertBefore(skipLink, document.body.firstChild);
  },

  setupFocusManagement() {
    // Highlight focus for keyboard users
    let isUsingKeyboard = false;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('keyboard-focus');
      }
    });

    document.addEventListener('mousedown', () => {
      isUsingKeyboard = false;
      document.body.classList.remove('keyboard-focus');
    });
  },

  setupAriaLabels() {
    // Add aria-labels to buttons without text
    const iconButtons = document.querySelectorAll('button:not([aria-label]):empty, button:not([aria-label]) > svg:only-child');
    iconButtons.forEach(button => {
      const purpose = button.className.includes('theme') ? 'Toggle theme' :
                     button.className.includes('menu') ? 'Toggle menu' :
                     button.className.includes('close') ? 'Close' : 'Button';
      button.setAttribute('aria-label', purpose);
    });
  }
};

// Error handling
const ErrorHandler = {
  init() {
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
  },

  handleError(event) {
    console.error('JavaScript error:', event.error);
    // Could send to analytics or error reporting service
  },

  handlePromiseRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent console error
  }
};

// Main initialization
const init = () => {
  // Check if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
};

const startApp = () => {
  if (App.isInitialized) return;

  try {
    // Initialize all modules
    Navigation.init();
    ScrollEffects.init();
    Forms.init();
    Performance.init();
    Accessibility.init();
    ErrorHandler.init();

    // Initialize theme (from theme-switcher.js)
    if (typeof ThemeSwitcher !== 'undefined') {
      ThemeSwitcher.init();
    }

    // Initialize LaTeX renderer (from latex-renderer.js)
    if (typeof LaTeXRenderer !== 'undefined') {
      LaTeXRenderer.init();
    }

    App.isInitialized = true;
    console.log('🚀 Personal Digital Space initialized successfully');

  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
};

// Start the application
init();

// Export for use in other modules
window.App = App;
window.Utils = Utils;