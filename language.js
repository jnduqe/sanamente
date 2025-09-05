// Language functionality for SanaMente website
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'es';
        this.languageBtn = null;
        this.currentLangSpan = null;
        this.otherLangSpan = null;
        
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.languageBtn = document.getElementById('languageBtn');
        this.currentLangSpan = document.getElementById('currentLang');
        this.otherLangSpan = document.getElementById('otherLang');
        
        if (!this.languageBtn || !this.currentLangSpan || !this.otherLangSpan) {
            console.error('Language toggle elements not found');
            return;
        }
        
        // Set initial language
        this.setLanguage(this.currentLanguage, false);
        
        // Add click event listener
        this.languageBtn.addEventListener('click', () => this.toggleLanguage());
        
        // Add keyboard support
        this.languageBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleLanguage();
            }
        });
    }
    
    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
        this.setLanguage(newLanguage, true);
    }
    
    setLanguage(language, animate = false) {
        // Validate language
        if (!['es', 'en'].includes(language)) {
            console.error('Invalid language:', language);
            return;
        }
        
        this.currentLanguage = language;
        
        // Save preference
        localStorage.setItem('preferredLanguage', language);
        
        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', language);
        document.getElementById('html-lang').setAttribute('lang', language);
        
        // Add animation class if requested
        if (animate) {
            document.body.classList.add('language-switching');
            setTimeout(() => {
                document.body.classList.remove('language-switching');
            }, 500);
        }
        
        // Update button text
        this.updateLanguageButton();
        
        // Update all content
        this.updateContent();
        
        // Update meta tags
        this.updateMetaTags();
        
        // Update form placeholders
        this.updateFormPlaceholders();
        
        // Fire custom event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: language }
        }));
    }
    
    updateLanguageButton() {
        if (this.currentLanguage === 'es') {
            this.currentLangSpan.textContent = 'ES';
            this.otherLangSpan.textContent = 'EN';
        } else {
            this.currentLangSpan.textContent = 'EN';
            this.otherLangSpan.textContent = 'ES';
        }
    }
    
    updateContent() {
        const elements = document.querySelectorAll('[data-es][data-en]');
        
        elements.forEach(element => {
            const content = element.getAttribute(`data-${this.currentLanguage}`);
            if (content) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = content;
                } else if (element.hasAttribute('title')) {
                    element.title = content;
                } else {
                    element.textContent = content;
                }
            }
        });
    }
    
    updateMetaTags() {
        const metaTags = document.querySelectorAll('meta[data-es][data-en], title[data-es][data-en]');
        
        metaTags.forEach(tag => {
            const content = tag.getAttribute(`data-${this.currentLanguage}`);
            if (content) {
                if (tag.tagName === 'TITLE') {
                    tag.textContent = content;
                } else if (tag.hasAttribute('content')) {
                    tag.setAttribute('content', content);
                }
            }
        });
    }
    
    updateFormPlaceholders() {
        const formElements = document.querySelectorAll('input[data-es][data-en], textarea[data-es][data-en]');
        
        formElements.forEach(element => {
            const placeholder = element.getAttribute(`data-${this.currentLanguage}`);
            if (placeholder) {
                element.setAttribute('placeholder', placeholder);
            }
        });
    }
    
    // Public method to get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // Public method to check if language is supported
    isLanguageSupported(language) {
        return ['es', 'en'].includes(language);
    }
    
    // Method to get translations for dynamic content
    getTranslation(key) {
        const translations = {
            es: {
                'form_success_title': '¡MUCHAS GRACIAS!',
                'form_success_text': 'Formulario Enviado',
                'whatsapp_greeting': '¡Hola SanaMente!',
                'whatsapp_message_intro': 'Me gustaría agendar una sesión. Aquí están mis datos:',
                'whatsapp_name': '*Nombre:*',
                'whatsapp_email': '*Correo:*',
                'whatsapp_phone': '*Teléfono:*',
                'whatsapp_message': '*Mensaje:*',
                'validation_name': 'Por favor ingresa tu nombre completo.',
                'validation_email': 'Por favor ingresa un correo electrónico válido.',
                'close': 'Cerrar'
            },
            en: {
                'form_success_title': 'THANK YOU VERY MUCH!',
                'form_success_text': 'Form Submitted',
                'whatsapp_greeting': 'Hello SanaMente!',
                'whatsapp_message_intro': 'I would like to schedule a session. Here is my information:',
                'whatsapp_name': '*Name:*',
                'whatsapp_email': '*Email:*',
                'whatsapp_phone': '*Phone:*',
                'whatsapp_message': '*Message:*',
                'validation_name': 'Please enter your full name.',
                'validation_email': 'Please enter a valid email address.',
                'close': 'Close'
            }
        };
        
        return translations[this.currentLanguage]?.[key] || key;
    }
}

// Create global instance
const languageManager = new LanguageManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}

// Enhanced form handling with language support
document.addEventListener('DOMContentLoaded', function() {
    // Update SweetAlert messages based on language
    const originalScriptUrl = 'https://script.google.com/macros/s/AKfycbzcx-roLPgPDpJYqPrzm9GipeUadsQ8hbShS7ciHHeODn5uMpA_o0XGOfxZDe_kqNJGqg/exec';
    
    // Override the form submission for form2
    const form2 = document.getElementById('formu2');
    if (form2) {
        form2.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch(originalScriptUrl, {method: 'POST', body: formData})
                .then(response => {
                    Swal.fire({
                        title: languageManager.getTranslation('form_success_title'),
                        text: languageManager.getTranslation('form_success_text'),
                        icon: "success"
                    });
                })
                .then(() => { 
                    window.location.reload(); 
                })
                .catch(error => console.error('Error', error.message));
        });
    }
    
    // Update validation messages when language changes
    document.addEventListener('languageChanged', function() {
        const invalidFeedbacks = document.querySelectorAll('.invalid-feedback');
        invalidFeedbacks.forEach(feedback => {
            if (feedback.hasAttribute('data-es') && feedback.hasAttribute('data-en')) {
                feedback.textContent = feedback.getAttribute(`data-${languageManager.getCurrentLanguage()}`);
            }
        });
    });
    
    // Update modal aria-label for close button
    document.addEventListener('languageChanged', function() {
        const closeButtons = document.querySelectorAll('.btn-close');
        closeButtons.forEach(button => {
            button.setAttribute('aria-label', languageManager.getTranslation('close'));
        });
    });
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    const languageBtn = document.getElementById('languageBtn');
    if (languageBtn) {
        // Add ARIA attributes
        languageBtn.setAttribute('aria-label', 'Toggle language between Spanish and English');
        languageBtn.setAttribute('role', 'button');
        languageBtn.setAttribute('tabindex', '0');
        
        // Update ARIA label when language changes
        document.addEventListener('languageChanged', function(e) {
            const newLang = e.detail.language;
            const ariaLabel = newLang === 'es' 
                ? 'Cambiar idioma entre español e inglés'
                : 'Toggle language between Spanish and English';
            languageBtn.setAttribute('aria-label', ariaLabel);
        });
    }
});

// Detect browser language preference on first visit
document.addEventListener('DOMContentLoaded', function() {
    // Only set language based on browser if no preference is stored
    if (!localStorage.getItem('preferredLanguage')) {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (languageManager.isLanguageSupported(langCode)) {
            languageManager.setLanguage(langCode, false);
        }
    }
});