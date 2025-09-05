const scriptUrl = 'https://script.google.com/macros/s/AKfycbzcx-roLPgPDpJYqPrzm9GipeUadsQ8hbShS7ciHHeODn5uMpA_o0XGOfxZDe_kqNJGqg/exec';

// Enhanced form handler with language support
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[name="contact-form"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get current language from language manager
            const currentLang = (typeof languageManager !== 'undefined') 
                ? languageManager.getCurrentLanguage() 
                : (localStorage.getItem('preferredLanguage') || 'es');
            
            const formData = new FormData(this);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';
            
            fetch(scriptUrl, {
                method: 'POST', 
                body: formData
            })
            .then(response => {
                // Success message based on current language
                const title = currentLang === 'es' ? '¡MUCHAS GRACIAS!' : 'THANK YOU VERY MUCH!';
                const text = currentLang === 'es' ? 'Formulario Enviado' : 'Form Submitted';
                
                return Swal.fire({
                    title: title,
                    text: text,
                    icon: "success",
                    confirmButtonColor: '#a08d7b', // Matching theme color
                    confirmButtonText: currentLang === 'es' ? 'Continuar' : 'Continue'
                });
            })
            .then(() => { 
                // Reset form
                form.reset();
                
                // Close modal if form is inside one
                const modal = form.closest('.modal');
                if (modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
                
                // Optional: Don't reload the page to maintain language preference
                // window.location.reload(); 
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Error message based on current language
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
    
    // Language change listener to update dynamic content
    document.addEventListener('languageChanged', function(e) {
        const currentLang = e.detail.language;
        
        // Update any dynamic form labels or messages if needed
        updateDynamicFormContent(currentLang);
    });
});

// Function to update dynamic form content
function updateDynamicFormContent(language) {
    // Update submit button texts if they don't have data attributes
    const submitButtons = document.querySelectorAll('button[type="submit"]:not([data-es])');
    submitButtons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes('submit') || btn.textContent.toLowerCase().includes('enviar')) {
            btn.textContent = language === 'es' ? 'Enviar' : 'Submit';
        }
    });
    
    // Update loading states
    const loadingButtons = document.querySelectorAll('button:disabled');
    loadingButtons.forEach(btn => {
        if (btn.textContent.includes('...')) {
            btn.textContent = language === 'es' ? 'Enviando...' : 'Sending...';
        }
    });
}

// Enhanced WhatsApp integration with language support
function createWhatsAppMessage(formData, language) {
    const translations = {
        es: {
            greeting: '¡Hola SanaMente! 😊',
            intro: 'Me gustaría agendar una sesión. Aquí están mis datos:',
            name: '*Nombre:*',
            email: '*Correo:*',
            phone: '*Teléfono:*',
            message: '*Mensaje:*'
        },
        en: {
            greeting: 'Hello SanaMente! 😊',
            intro: 'I would like to schedule a session. Here is my information:',
            name: '*Name:*',
            email: '*Email:*',
            phone: '*Phone:*',
            message: '*Message:*'
        }
    };
    
    const t = translations[language] || translations.es;
    
    return `${t.greeting}
${t.intro}

${t.name} ${formData.name}
${t.email} ${formData.email}
${t.phone} ${formData.phone}

${t.message} ${formData.message}`;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateDynamicFormContent,
        createWhatsAppMessage
    };
}