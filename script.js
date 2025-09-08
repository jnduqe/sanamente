// Enhanced SanaMente Website JavaScript
// Manejo mejorado de formularios, idiomas y funcionalidades

const scriptUrl = 'https://script.google.com/macros/s/AKfycbzcx-roLPgPDpJYqPrzm9GipeUadsQ8hbShS7ciHHeODn5uMpA_o0XGOfxZDe_kqNJGqg/exec';

// Language Management System
const languageManager = {
    currentLanguage: localStorage.getItem('preferredLanguage') || 'es',
    
    init() {
        this.updateLanguageButton();
        this.applyLanguage(this.currentLanguage);
        this.bindEvents();
    },
    
    bindEvents() {
        document.getElementById('languageBtn').addEventListener('click', () => {
            this.toggleLanguage();
        });
    },
    
    toggleLanguage() {
        const newLang = this.currentLanguage === 'es' ? 'en' : 'es';
        this.setLanguage(newLang);
    },
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        this.updateLanguageButton();
        this.applyLanguage(lang);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    },
    
    updateLanguageButton() {
        const currentLangSpan = document.getElementById('currentLang');
        const otherLangSpan = document.getElementById('otherLang');
        
        if (this.currentLanguage === 'es') {
            currentLangSpan.textContent = 'ES';
            otherLangSpan.textContent = 'EN';
        } else {
            currentLangSpan.textContent = 'EN';
            otherLangSpan.textContent = 'ES';
        }
    },
    
    applyLanguage(lang) {
        document.body.classList.add('language-changing');
        
        setTimeout(() => {
            // Update elements with data attributes
            const elements = document.querySelectorAll('[data-es][data-en]');
            elements.forEach(element => {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = element.getAttribute(`data-${lang}`);
                } else if (element.hasAttribute('content')) {
                    element.setAttribute('content', element.getAttribute(`data-${lang}`));
                } else {
                    element.textContent = element.getAttribute(`data-${lang}`);
                }
            });
            
            // Update HTML lang attribute
            document.documentElement.lang = lang;
            const htmlLangElement = document.getElementById('html-lang');
            if (htmlLangElement) {
                htmlLangElement.lang = lang;
            }
            
            document.body.classList.remove('language-changing');
        }, 100);
    },
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
};

// Enhanced WhatsApp Form Handler
function initializeWhatsAppForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (form.checkValidity()) {
            const fullName = document.getElementById('fullName').value;
            const emailAddress = document.getElementById('emailAddress').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const message = document.getElementById('message').value;
            const currentLang = languageManager.getCurrentLanguage();
            
            const whatsappMessage = currentLang === 'es' ? 
                `¡Hola SanaMente! 😊
Me gustaría agendar una sesión. Aquí están mis datos:

*Nombre:* ${fullName}
*Correo:* ${emailAddress}
*Teléfono:* ${phoneNumber}

*Mensaje:* ${message}

¡Espero su respuesta!` :
                `Hello SanaMente! 😊
I would like to schedule a session. Here is my information:

*Name:* ${fullName}
*Email:* ${emailAddress}
*Phone:* ${phoneNumber}

*Message:* ${message}

Looking forward to your response!`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/573148763819?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            form.reset();
            form.classList.remove('was-validated');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            if (modal) {
                modal.hide();
            }
        } else {
            form.classList.add('was-validated');
        }
    });
}

// Regular Form Handler with Google Sheets Integration
function initializeRegularForms() {
    const forms = document.querySelectorAll('form[name="contact-form"]:not(#contactForm)');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentLang = languageManager.getCurrentLanguage();
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';
            
            fetch(scriptUrl, {
                method: 'POST', 
                body: formData
            })
            .then(response => {
                const title = currentLang === 'es' ? '¡MUCHAS GRACIAS!' : 'THANK YOU VERY MUCH!';
                const text = currentLang === 'es' ? 'Formulario enviado correctamente' : 'Form submitted successfully';
                
                return Swal.fire({
                    title: title,
                    text: text,
                    icon: "success",
                    confirmButtonColor: '#a08d7b',
                    confirmButtonText: currentLang === 'es' ? 'Continuar' : 'Continue'
                });
            })
            .then(() => { 
                form.reset();
                const modal = form.closest('.modal');
                if (modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const title = currentLang === 'es' ? 'Error' : 'Error';
                const text = currentLang === 'es' 
                    ? 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.' 
                    : 'There was a problem submitting the form. Please try again.';
                
                Swal.fire({
                    title: title,
                    text: text,
                    icon: "error",
                    confirmButtonColor: '#a08d7b',
                    confirmButtonText: currentLang === 'es' ? 'Entendido' : 'Understood'
                });
            })
            .finally(() => {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        });
    });
}

// Smooth Scrolling for Internal Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                // Remove observer after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    document.querySelectorAll('.card-hover, .testimonial-card, .lead').forEach(el => {
        observer.observe(el);
    });
}

// Form Validation Enhancement
function enhanceFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') && this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            });
        });
    });
}

// Performance Optimization - Lazy Loading for Images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Error Handling for Missing Elements
function handleMissingElements() {
    const criticalElements = ['#languageBtn', '#contactForm'];
    
    criticalElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Critical element ${selector} not found`);
        }
    });
}

// Analytics and Tracking (Google Analytics ready)
function initializeTracking() {
    // Track CTA button clicks
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            // Google Analytics event tracking (if gtag is available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'CTA',
                    'event_label': buttonText
                });
            }
            
            console.log('CTA Click:', buttonText);
        });
    });
    
    // Track language changes
    document.addEventListener('languageChanged', function(e) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'language_change', {
                'event_category': 'User Interaction',
                'event_label': e.detail.language
            });
        }
        
        console.log('Language changed to:', e.detail.language);
    });
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'sr-only sr-only-focusable';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 10000;
        color: white;
        background: var(--nude-accent);
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        }
    });
}

// Main Initialization Function
function initializeWebsite() {
    try {
        // Core functionality
        languageManager.init();
        initializeWhatsAppForm();
        initializeRegularForms();
        initializeSmoothScrolling();
        
        // Enhanced features
        initializeAnimations();
        enhanceFormValidation();
        initializeLazyLoading();
        initializeTracking();
        enhanceAccessibility();
        
        // Error handling
        handleMissingElements();
        
        console.log('SanaMente website initialized successfully');
        
    } catch (error) {
        console.error('Error initializing website:', error);
    }
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}

// Export functions for external use if needed
window.SanaMente = {
    languageManager,
    initializeWebsite
};