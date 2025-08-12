// Contact Form Validation Script
class ContactFormValidator {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.messageTextarea = document.getElementById('message');
        this.charCountSpan = document.getElementById('charCount');
        
        this.validators = {
            name: this.validateName.bind(this),
            email: this.validateEmail.bind(this),
            phone: this.validatePhone.bind(this),
            subject: this.validateSubject.bind(this),
            message: this.validateMessage.bind(this),
            terms: this.validateTerms.bind(this)
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupCharacterCount();
    }
    
    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Real-time validation on blur
        Object.keys(this.validators).forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('blur', () => this.validateField(field));
                element.addEventListener('input', () => this.clearError(field));
            }
        });
        
        // Special handling for checkboxes
        document.getElementById('terms').addEventListener('change', () => {
            this.validateField('terms');
        });
    }
    
    setupCharacterCount() {
        this.messageTextarea.addEventListener('input', () => {
            const currentLength = this.messageTextarea.value.length;
            this.charCountSpan.textContent = currentLength;
            
            // Change color based on character count
            if (currentLength > 450) {
                this.charCountSpan.style.color = '#e74c3c';
            } else if (currentLength > 400) {
                this.charCountSpan.style.color = '#f39c12';
            } else {
                this.charCountSpan.style.color = '#666';
            }
        });
    }
    
    validateField(fieldName) {
        if (this.validators[fieldName]) {
            return this.validators[fieldName]();
        }
        return true;
    }
    
    validateName() {
        const name = document.getElementById('name').value.trim();
        const nameInput = document.getElementById('name');
        const errorElement = document.getElementById('nameError');
        
        if (!name) {
            this.showError(nameInput, errorElement, 'Full name is required');
            return false;
        }
        
        if (name.length < 2) {
            this.showError(nameInput, errorElement, 'Name must be at least 2 characters long');
            return false;
        }
        
        if (!/^[a-zA-Z\s'-]+$/.test(name)) {
            this.showError(nameInput, errorElement, 'Name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }
        
        this.showSuccess(nameInput, errorElement);
        return true;
    }
    
    validateEmail() {
        const email = document.getElementById('email').value.trim();
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('emailError');
        
        if (!email) {
            this.showError(emailInput, errorElement, 'Email address is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError(emailInput, errorElement, 'Please enter a valid email address');
            return false;
        }
        
        // Additional email validation
        if (email.length > 254) {
            this.showError(emailInput, errorElement, 'Email address is too long');
            return false;
        }
        
        this.showSuccess(emailInput, errorElement);
        return true;
    }
    
    validatePhone() {
        const phone = document.getElementById('phone').value.trim();
        const phoneInput = document.getElementById('phone');
        const errorElement = document.getElementById('phoneError');
        
        // Phone is optional, so if empty, it's valid
        if (!phone) {
            this.clearError('phone');
            return true;
        }
        
        // Remove all non-digit characters for validation
        const cleanPhone = phone.replace(/\D/g, '');
        
        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            this.showError(phoneInput, errorElement, 'Phone number must be between 10-15 digits');
            return false;
        }
        
        this.showSuccess(phoneInput, errorElement);
        return true;
    }
    
    validateSubject() {
        const subject = document.getElementById('subject').value;
        const subjectInput = document.getElementById('subject');
        const errorElement = document.getElementById('subjectError');
        
        if (!subject) {
            this.showError(subjectInput, errorElement, 'Please select a subject');
            return false;
        }
        
        this.showSuccess(subjectInput, errorElement);
        return true;
    }
    
    validateMessage() {
        const message = document.getElementById('message').value.trim();
        const messageInput = document.getElementById('message');
        const errorElement = document.getElementById('messageError');
        
        if (!message) {
            this.showError(messageInput, errorElement, 'Message is required');
            return false;
        }
        
        if (message.length < 10) {
            this.showError(messageInput, errorElement, 'Message must be at least 10 characters long');
            return false;
        }
        
        if (message.length > 500) {
            this.showError(messageInput, errorElement, 'Message must not exceed 500 characters');
            return false;
        }
        
        this.showSuccess(messageInput, errorElement);
        return true;
    }
    
    validateTerms() {
        const terms = document.getElementById('terms').checked;
        const errorElement = document.getElementById('termsError');
        
        if (!terms) {
            this.showError(null, errorElement, 'You must agree to the Terms of Service and Privacy Policy');
            return false;
        }
        
        this.clearError('terms');
        return true;
    }
    
    showError(inputElement, errorElement, message) {
        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.classList.remove('success');
        }
        
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    showSuccess(inputElement, errorElement) {
        if (inputElement) {
            inputElement.classList.add('success');
            inputElement.classList.remove('error');
        }
        
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
    
    clearError(fieldName) {
        const inputElement = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        
        if (inputElement) {
            inputElement.classList.remove('error', 'success');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    }
    
    validateAllFields() {
        const fieldsToValidate = ['name', 'email', 'phone', 'subject', 'message', 'terms'];
        let allValid = true;
        
        fieldsToValidate.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        if (!this.validateAllFields()) {
            this.showSubmissionError('Please fix the errors above before submitting.');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.submitForm();
            
            // Show success message
            this.showSuccessMessage();
            
        } catch (error) {
            this.showSubmissionError('An error occurred while sending your message. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async submitForm() {
        // Simulate API call with delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    resolve();
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
        
        // In a real application, you would make an actual API call:
        /*
        const formData = new FormData(this.form);
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        
        return response.json();
        */
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('loading');
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
        }
    }
    
    showSuccessMessage() {
        this.form.style.display = 'none';
        this.successMessage.classList.add('show');
        
        // Reset form after showing success
        setTimeout(() => {
            this.resetForm();
        }, 3000);
    }
    
    showSubmissionError(message) {
        // Create or update error message at top of form
        let errorDiv = document.querySelector('.submission-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'submission-error';
            errorDiv.style.cssText = `
                background: #fee;
                color: #e74c3c;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid #fcc;
                font-weight: 500;
            `;
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }
        
        errorDiv.textContent = message;
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    resetForm() {
        // Reset form
        this.form.reset();
        
        // Clear all validation states
        Object.keys(this.validators).forEach(field => {
            this.clearError(field);
        });
        
        // Reset character count
        this.charCountSpan.textContent = '0';
        this.charCountSpan.style.color = '#666';
        
        // Hide success message and show form
        this.successMessage.classList.remove('show');
        this.form.style.display = 'block';
        
        // Remove any submission error
        const errorDiv = document.querySelector('.submission-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // Utility method to format phone numbers (optional enhancement)
    formatPhoneNumber(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber;
    }
}

// Initialize the form validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormValidator();
    
    // Optional: Add phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        // Simple phone formatting for US numbers
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        e.target.value = value;
    });
});

// Export for potential testing or module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormValidator;
}