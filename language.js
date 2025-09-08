// Language Management System for SanaMente Website
// Standalone language switching functionality

(function() {
    'use strict';
    
    // Language Manager Object
    const LanguageManager = {
        // Current language state
        currentLanguage: localStorage.getItem('preferredLanguage') || 'es',
        
        // Available languages
        availableLanguages: ['es', 'en'],
        
        // Initialize the language system
        init() {
            this.createLanguageButton();
            this.bindEvents();
            this.applyLanguage(this.currentLanguage);
            console.log('Language system initialized with language:', this.currentLanguage);
        },
        
        // Create language toggle button if it doesn't exist
        createLanguageButton() {
            let existingToggle = document.querySelector('.language-toggle');
            
            if (!existingToggle) {
                const toggleContainer = document.createElement('div');
                toggleContainer.className = 'language-toggle';
                
                const button = document.createElement('button');
                button.id = 'languageBtn';
                button.className = 'btn btn-outline-primary btn-sm';
                button.innerHTML = `
                    <span id="currentLang">ES</span> | <span id="otherLang">EN</span>
                `;
                
                toggleContainer.appendChild(button);
                document.body.appendChild(toggleContainer);
            }
            
            this.updateLanguageButton();
        },
        
        // Bind event listeners
        bindEvents() {
            const languageBtn = document.getElementById('languageBtn');
            
            if (languageBtn) {
                languageBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleLanguage();
                });
                
                // Add keyboard support
                languageBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleLanguage();
                    }
                });
            }
        },
        
        // Toggle between languages
        toggleLanguage() {
            const currentIndex = this.availableLanguages.indexOf(this.currentLanguage);
            const nextIndex = (currentIndex + 1) % this.availableLanguages.length;
            const newLanguage = this.availableLanguages[nextIndex];
            
            this.setLanguage(newLanguage);
        },
        
        // Set specific language
        setLanguage(lang) {
            if (!this.availableLanguages.includes(lang)) {
                console.warn(`Language "${lang}" not supported. Available: ${this.availableLanguages.join(', ')}`);
                return;
            }
            
            const previousLanguage = this.currentLanguage;
            this.currentLanguage = lang;
            
            // Save to localStorage
            localStorage.setItem('preferredLanguage', lang);
            
            // Update UI
            this.updateLanguageButton();
            this.applyLanguage(lang);
            
            // Dispatch custom event
            this.dispatchLanguageChangeEvent(lang, previousLanguage);
            
            console.log(`Language changed from ${previousLanguage} to ${lang}`);
        },
        
        // Update the language button display
        updateLanguageButton() {
            const currentLangSpan = document.getElementById('currentLang');
            const otherLangSpan = document.getElementById('otherLang');
            
            if (currentLangSpan && otherLangSpan) {
                if (this.currentLanguage === 'es') {
                    currentLangSpan.textContent = 'ES';
                    otherLangSpan.textContent = 'EN';
                } else {
                    currentLangSpan.textContent = 'EN';
                    otherLangSpan.textContent = 'ES';
                }
            }
        },
        
        // Apply language to all elements
        applyLanguage(lang) {
            // Add transition class
            document.body.classList.add('language-changing');
            
            // Small delay for smooth transition
            setTimeout(() => {
                // Update elements with data attributes
                const elements = document.querySelectorAll('[data-es][data-en]');
                
                elements.forEach(element => {
                    const content = element.getAttribute(`data-${lang}`);
                    
                    if (content) {
                        // Handle different element types
                        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                            element.placeholder = content;
                        } else if (element.hasAttribute('content')) {
                            element.setAttribute('content', content);
                        } else if (element.tagName === 'TITLE') {
                            element.textContent = content;
                            document.title = content;
                        } else if (element.hasAttribute('alt')) {
                            element.alt = content;
                        } else if (element.hasAttribute('aria-label')) {
                            element.setAttribute('aria-label', content);
                        } else {
                            element.textContent = content;
                        }
                    }
                });
                
                // Update HTML lang attribute
                document.documentElement.lang = lang;
                
                // Update meta tags
                this.updateMetaTags(lang);
                
                // Remove transition class
                document.body.classList.remove('language-changing');
                
            }, 100);
        },
        
        // Update meta tags based on language
        updateMetaTags(lang) {
            const metaElements = document.querySelectorAll('meta[data-es][data-en]');
            
            metaElements.forEach(meta => {
                const content = meta.getAttribute(`data-${lang}`);
                if (content) {
                    meta.setAttribute('content', content);
                }
            });
        },
        
        // Dispatch language change event
        dispatchLanguageChangeEvent(newLang, previousLang) {
            const event = new CustomEvent('languageChanged', {
                detail: {
                    language: newLang,
                    previousLanguage: previousLang,
                    timestamp: new Date().toISOString()
                },
                bubbles: true,
                cancelable: true
            });
            
            document.dispatchEvent(event);
        },
        
        // Get current language
        getCurrentLanguage() {
            return this.currentLanguage;
        },
        
        // Get available languages
        getAvailableLanguages() {
            return [...this.availableLanguages];
        },
        
        // Check if language is supported
        isLanguageSupported(lang) {
            return this.availableLanguages.includes(lang);
        },
        
        // Get translated text for specific key
        getText(key, lang = null) {
            const targetLang = lang || this.currentLanguage;
            const element = document.querySelector(`[data-key="${key}"]`);
            
            if (element) {
                return element.getAttribute(`data-${targetLang}`);
            }
            
            return null;
        },
        
        // Add new language (for future expansion)
        addLanguage(langCode, langName) {
            if (!this.availableLanguages.includes(langCode)) {
                this.availableLanguages.push(langCode);
                console.log(`Added language: ${langCode} (${langName})`);
            }
        },
        
        // Set language from URL parameter
        setLanguageFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const langParam = urlParams.get('lang');
            
            if (langParam && this.isLanguageSupported(langParam)) {
                this.setLanguage(langParam);
            }
        },
        
        // Browser language detection
        detectBrowserLanguage() {
            const browserLang = navigator.language || navigator.userLanguage;
            const primaryLang = browserLang.split('-')[0];
            
            if (this.isLanguageSupported(primaryLang)) {
                return primaryLang;
            }
            
            return 'es'; // Default fallback
        },
        
        // Auto-detect and set language on first visit
        autoDetectLanguage() {
            const savedLang = localStorage.getItem('preferredLanguage');
            
            if (!savedLang) {
                const detectedLang = this.detectBrowserLanguage();
                this.setLanguage(detectedLang);
                console.log('Auto-detected language:', detectedLang);
            }
        }
    };
    
    // Auto-initialize when DOM is ready
    function initializeLanguageSystem() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                LanguageManager.init();
                LanguageManager.setLanguageFromURL();
            });
        } else {
            LanguageManager.init();
            LanguageManager.setLanguageFromURL();
        }
    }
    
    // Initialize immediately
    initializeLanguageSystem();
    
    // Export to global scope
    window.languageManager = LanguageManager;
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LanguageManager;
    }
    
    // Export for AMD
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return LanguageManager;
        });
    }
    
})();