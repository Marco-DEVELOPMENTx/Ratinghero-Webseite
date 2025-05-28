// Global variables
let currentStep = 0;
let funnelData = {};
let totalSteps = 8; // Erhöht um 1 für Mitarbeiteranzahl

// Funnel steps configuration
const funnelSteps = [
    {
        id: 'reviews-count',
        title: 'Wie viele Google Bewertungen möchten Sie generieren?',
        subtitle: 'Wählen Sie das passende Paket für Ihr Unternehmen',
        type: 'options',
        icon: '⭐',
        options: [
            { 
                value: '20-reviews', 
                text: '20x Google Bewertungen', 
                price: 'ab 299€',
                description: 'Perfekt für kleine Unternehmen',
                popular: false,
                savings: null
            },
            { 
                value: '30-reviews', 
                text: '30x Google Bewertungen', 
                price: 'ab 399€',
                description: 'Ideal für mittelständische Betriebe',
                popular: true,
                savings: 'Beliebteste Wahl'
            },
            { 
                value: '50-reviews', 
                text: '50x Google Bewertungen', 
                price: 'ab 599€',
                description: 'Für maximale Sichtbarkeit',
                popular: false,
                savings: '20% Ersparnis'
            },
            { 
                value: 'individual', 
                text: 'Individuelle Lösung', 
                price: 'Auf Anfrage',
                description: 'Maßgeschneidert für Ihre Bedürfnisse',
                popular: false,
                savings: null
            }
        ]
    },
    {
        id: 'campaign-speed',
        title: 'Wie schnell soll Ihre Kampagne starten?',
        subtitle: 'Je schneller, desto früher sehen Sie Ergebnisse',
        type: 'options',
        icon: '🚀',
        options: [
            { 
                value: 'express', 
                text: 'Express Start (24h)', 
                price: '+99€',
                description: 'Sofortiger Kampagnenstart',
                popular: false,
                savings: null
            },
            { 
                value: 'fast', 
                text: 'Schnell (2-3 Tage)', 
                price: '+49€',
                description: 'Zügiger Projektbeginn',
                popular: true,
                savings: 'Empfohlen'
            },
            { 
                value: 'normal', 
                text: 'Standard (5-7 Tage)', 
                price: 'Kostenlos',
                description: 'Regulärer Projektstart',
                popular: false,
                savings: null
            },
            { 
                value: 'flexible', 
                text: 'Flexibel terminieren', 
                price: 'Kostenlos',
                description: 'Sie bestimmen den Starttermin',
                popular: false,
                savings: null
            }
        ]
    },
    {
        id: 'profiles-count',
        title: 'Für wie viele Profile benötigen Sie Bewertungen?',
        subtitle: 'Mehrere Profile = größere Reichweite',
        type: 'options',
        icon: '📍',
        options: [
            { 
                value: '1', 
                text: '1 Google My Business Profil', 
                price: 'Inkludiert',
                description: 'Standard für ein Unternehmen',
                popular: false,
                savings: null
            },
            { 
                value: '2-3', 
                text: '2-3 Profile', 
                price: '+149€',
                description: 'Mehrere Standorte oder Marken',
                popular: true,
                savings: 'Oft gewählt'
            },
            { 
                value: '4-5', 
                text: '4-5 Profile', 
                price: '+249€',
                description: 'Für größere Unternehmen',
                popular: false,
                savings: '15% Rabatt'
            },
            { 
                value: 'more', 
                text: 'Mehr als 5 Profile', 
                price: 'Auf Anfrage',
                description: 'Individuelle Preisgestaltung',
                popular: false,
                savings: 'Mengenrabatt'
            }
        ]
    },
    {
        id: 'company-info',
        title: 'Informationen zu Ihrem Unternehmen',
        subtitle: 'Damit wir Sie optimal beraten können',
        type: 'form',
        icon: '🏢',
        fields: [
            { name: 'company', type: 'text', placeholder: 'Unternehmensname', required: true, icon: '🏪' },
            { name: 'industry', type: 'select', placeholder: 'Branche auswählen', required: true, icon: '🎯', options: [
                'Gastronomie & Hotels',
                'Einzelhandel & E-Commerce',
                'Dienstleistungen',
                'Gesundheitswesen & Wellness',
                'Automotive & Werkstätten',
                'Immobilien & Makler',
                'Handwerk & Bau',
                'IT & Software',
                'Beratung & Coaching',
                'Beauty & Kosmetik',
                'Fitness & Sport',
                'Rechtsanwälte & Steuerberater',
                'Sonstiges'
            ]}
        ]
    },
    {
        id: 'team-size',
        title: 'Wie viele Mitarbeiter hat Ihr Unternehmen?',
        subtitle: 'Hilft uns bei der Strategieentwicklung',
        type: 'options',
        icon: '👥',
        options: [
            { 
                value: '1-5', 
                text: '1-5 Mitarbeiter', 
                price: 'Kleinstunternehmen',
                description: 'Persönliche Betreuung',
                popular: false,
                savings: null
            },
            { 
                value: '6-20', 
                text: '6-20 Mitarbeiter', 
                price: 'Kleinunternehmen',
                description: 'Wachstumsorientiert',
                popular: true,
                savings: 'Häufigste Größe'
            },
            { 
                value: '21-50', 
                text: '21-50 Mitarbeiter', 
                price: 'Mittelstand',
                description: 'Etabliertes Unternehmen',
                popular: false,
                savings: null
            },
            { 
                value: '51+', 
                text: 'Mehr als 50 Mitarbeiter', 
                price: 'Großunternehmen',
                description: 'Enterprise-Lösungen verfügbar',
                popular: false,
                savings: 'VIP-Service'
            }
        ]
    },
    {
        id: 'contact-info',
        title: 'Ihre Kontaktdaten',
        subtitle: 'Für die persönliche Beratung und Angebotserstellung',
        type: 'form',
        icon: '📞',
        fields: [
            { name: 'name', type: 'text', placeholder: 'Vor- und Nachname', required: true, icon: '👤' },
            { name: 'email', type: 'email', placeholder: 'E-Mail-Adresse', required: true, icon: '📧' },
            { name: 'phone', type: 'tel', placeholder: 'Telefonnummer', required: true, icon: '📱' }
        ]
    },
    {
        id: 'profile-links',
        title: 'Google My Business Profile',
        subtitle: 'Damit wir Ihre aktuellen Bewertungen analysieren können',
        type: 'form',
        icon: '🔗',
        fields: [
            { name: 'profile_url', type: 'url', placeholder: 'Link zu Ihrem Google My Business Profil', required: true, icon: '🌐' },
            { name: 'additional_urls', type: 'textarea', placeholder: 'Weitere Profile (optional, ein Link pro Zeile)', required: false, icon: '📋' }
        ]
    },
    {
        id: 'final-step',
        title: 'Wählen Sie Ihre Option',
        subtitle: 'Starten Sie noch heute mit Ratinghero',
        type: 'final',
        icon: '🎯',
        options: [
            { 
                value: 'book', 
                text: 'Jetzt verbindlich buchen', 
                class: 'btn-primary',
                description: 'Sofortiger Projektstart',
                icon: '💳'
            },
            { 
                value: 'test', 
                text: '1 kostenlose Bewertung anfordern', 
                class: 'btn-secondary',
                description: 'Risikofrei testen',
                icon: '🎁'
            }
        ]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeSmoothScrolling();
});

// Smooth scrolling for navigation links
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

// Scroll to section function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize scroll animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const elementsToAnimate = document.querySelectorAll('.step, .benefit-card, .testimonial-card, .trust-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Initialize animations
function initializeAnimations() {
    // Add any additional animations here
    console.log('Animations initialized');
}

// Start the funnel
function startFunnel() {
    currentStep = 0;
    funnelData = {};
    showFunnelModal();
    renderFunnelStep();
}

// Show funnel modal
function showFunnelModal() {
    const modal = document.getElementById('funnelModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close funnel modal
function closeFunnel() {
    const modal = document.getElementById('funnelModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Render current funnel step
function renderFunnelStep() {
    const step = funnelSteps[currentStep];
    const content = document.getElementById('funnelContent');
    
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
    
    let html = `
        <div class="funnel-progress">
            <div class="funnel-progress-bar" style="width: ${progressPercentage}%"></div>
            <div class="funnel-progress-text">Schritt ${currentStep + 1} von ${totalSteps}</div>
        </div>
        <div class="funnel-step active">
            <div class="funnel-header">
                <div class="funnel-icon">${step.icon}</div>
                <h3>${step.title}</h3>
                ${step.subtitle ? `<p class="funnel-subtitle">${step.subtitle}</p>` : ''}
            </div>
    `;

    if (step.type === 'options') {
        html += '<div class="funnel-options premium-options">';
        step.options.forEach((option, index) => {
            const isSelected = funnelData[step.id] === option.value;
            const popularBadge = option.popular ? '<div class="popular-badge">Beliebt</div>' : '';
            const savingsBadge = option.savings ? `<div class="savings-badge">${option.savings}</div>` : '';
            
            html += `
                <div class="funnel-option premium-option ${isSelected ? 'selected' : ''} ${option.popular ? 'popular' : ''}" 
                     onclick="selectOption('${step.id}', '${option.value}')">
                    ${popularBadge}
                    ${savingsBadge}
                    <div class="option-content">
                        <div class="option-header">
                            <strong class="option-title">${option.text}</strong>
                            <span class="option-price">${option.price}</span>
                        </div>
                        <p class="option-description">${option.description}</p>
                    </div>
                    <div class="option-check">✓</div>
                </div>
            `;
        });
        html += '</div>';
    } else if (step.type === 'form') {
        html += '<div class="funnel-form premium-form">';
        step.fields.forEach(field => {
            if (field.type === 'select') {
                html += `
                    <div class="form-group">
                        <label class="form-label">
                            <span class="form-icon">${field.icon}</span>
                            ${field.placeholder}
                        </label>
                        <select class="funnel-input premium-input" name="${field.name}" ${field.required ? 'required' : ''}>
                            <option value="">Bitte auswählen...</option>
                            ${field.options.map(opt => `<option value="${opt}" ${funnelData[field.name] === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (field.type === 'textarea') {
                html += `
                    <div class="form-group">
                        <label class="form-label">
                            <span class="form-icon">${field.icon}</span>
                            ${field.placeholder}
                        </label>
                        <textarea class="funnel-input premium-input" name="${field.name}" 
                                  ${field.required ? 'required' : ''} rows="4">${funnelData[field.name] || ''}</textarea>
                    </div>
                `;
            } else {
                html += `
                    <div class="form-group">
                        <label class="form-label">
                            <span class="form-icon">${field.icon}</span>
                            ${field.placeholder}
                        </label>
                        <input type="${field.type}" class="funnel-input premium-input" name="${field.name}" 
                               ${field.required ? 'required' : ''} 
                               value="${funnelData[field.name] || ''}">
                    </div>
                `;
            }
        });
        html += '</div>';
    } else if (step.type === 'final') {
        html += '<div class="funnel-options final-options">';
        step.options.forEach(option => {
            html += `
                <button class="btn ${option.class} btn-large premium-final-btn" 
                        onclick="completeFunnel('${option.value}')">
                    <span class="btn-icon">${option.icon}</span>
                    <span class="btn-content">
                        <strong>${option.text}</strong>
                        <small>${option.description}</small>
                    </span>
                </button>
            `;
        });
        html += '</div>';
        html += `
            <div class="order-summary-container">
                <div class="order-summary-header">
                    <h4>📋 Ihre Auswahl im Überblick</h4>
                </div>
                <div id="orderSummary" class="order-summary-content"></div>
                <div class="trust-indicators-mini">
                    <div class="trust-item-mini">
                        <span class="trust-icon">🔒</span>
                        <span>100% DSGVO-konform</span>
                    </div>
                    <div class="trust-item-mini">
                        <span class="trust-icon">⚡</span>
                        <span>Schnelle Umsetzung</span>
                    </div>
                    <div class="trust-item-mini">
                        <span class="trust-icon">🎯</span>
                        <span>Garantierte Ergebnisse</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Navigation buttons
    html += `
        <div class="funnel-navigation">
            ${currentStep > 0 ? '<button class="btn btn-secondary nav-btn" onclick="previousStep()"><span>←</span> Zurück</button>' : '<div></div>'}
            ${step.type !== 'final' ? '<button class="btn btn-primary nav-btn" onclick="nextStep()">Weiter <span>→</span></button>' : ''}
        </div>
    `;

    html += '</div>';
    content.innerHTML = html;

    // Show order summary on final step
    if (step.type === 'final') {
        showOrderSummary();
    }

    // Add entrance animation
    setTimeout(() => {
        const stepElement = document.querySelector('.funnel-step.active');
        stepElement.classList.add('step-entered');
    }, 100);
}

// Select option in funnel
function selectOption(stepId, value) {
    funnelData[stepId] = value;
    
    // Update visual selection
    document.querySelectorAll('.funnel-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.funnel-option').classList.add('selected');
    
    // Add selection animation
    event.target.closest('.funnel-option').classList.add('option-selected');
    setTimeout(() => {
        event.target.closest('.funnel-option').classList.remove('option-selected');
    }, 300);
}

// Go to next step
function nextStep() {
    if (validateCurrentStep()) {
        currentStep++;
        if (currentStep < funnelSteps.length) {
            renderFunnelStep();
        }
    }
}

// Go to previous step
function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        renderFunnelStep();
    }
}

// Validate current step
function validateCurrentStep() {
    const step = funnelSteps[currentStep];
    
    if (step.type === 'options') {
        if (!funnelData[step.id]) {
            showValidationError('Bitte wählen Sie eine Option aus.');
            return false;
        }
    } else if (step.type === 'form') {
        const form = document.querySelector('.funnel-form');
        const inputs = form.querySelectorAll('input, select, textarea');
        
        for (let input of inputs) {
            if (input.required && !input.value.trim()) {
                showValidationError(`Bitte füllen Sie das Feld "${input.previousElementSibling.textContent.replace(/[^\w\s]/gi, '').trim()}" aus.`);
                input.focus();
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 3000);
                return false;
            }
            
            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    showValidationError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                    input.focus();
                    input.classList.add('error');
                    setTimeout(() => input.classList.remove('error'), 3000);
                    return false;
                }
            }
            
            // Phone validation
            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(input.value)) {
                    showValidationError('Bitte geben Sie eine gültige Telefonnummer ein.');
                    input.focus();
                    input.classList.add('error');
                    setTimeout(() => input.classList.remove('error'), 3000);
                    return false;
                }
            }
            
            // URL validation
            if (input.type === 'url' && input.value) {
                try {
                    new URL(input.value);
                } catch {
                    showValidationError('Bitte geben Sie eine gültige URL ein.');
                    input.focus();
                    input.classList.add('error');
                    setTimeout(() => input.classList.remove('error'), 3000);
                    return false;
                }
            }
            
            funnelData[input.name] = input.value;
        }
    }
    
    return true;
}

// Show validation error
function showValidationError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.innerHTML = `
        <span class="error-icon">⚠️</span>
        <span>${message}</span>
    `;
    
    // Insert error message
    const funnelStep = document.querySelector('.funnel-step.active');
    funnelStep.insertBefore(errorDiv, funnelStep.querySelector('.funnel-navigation'));
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Show order summary
function showOrderSummary() {
    const summary = document.getElementById('orderSummary');
    let html = '<div class="summary-items">';
    
    // Reviews count
    if (funnelData['reviews-count']) {
        const reviewsOption = funnelSteps[0].options.find(opt => opt.value === funnelData['reviews-count']);
        html += `
            <div class="summary-item">
                <span class="summary-icon">⭐</span>
                <div class="summary-details">
                    <strong>Bewertungen:</strong>
                    <span>${reviewsOption.text}</span>
                </div>
                <span class="summary-price">${reviewsOption.price}</span>
            </div>
        `;
    }
    
    // Campaign speed
    if (funnelData['campaign-speed']) {
        const speedOption = funnelSteps[1].options.find(opt => opt.value === funnelData['campaign-speed']);
        html += `
            <div class="summary-item">
                <span class="summary-icon">🚀</span>
                <div class="summary-details">
                    <strong>Geschwindigkeit:</strong>
                    <span>${speedOption.text}</span>
                </div>
                <span class="summary-price">${speedOption.price}</span>
            </div>
        `;
    }
    
    // Profiles count
    if (funnelData['profiles-count']) {
        const profilesOption = funnelSteps[2].options.find(opt => opt.value === funnelData['profiles-count']);
        html += `
            <div class="summary-item">
                <span class="summary-icon">📍</span>
                <div class="summary-details">
                    <strong>Profile:</strong>
                    <span>${profilesOption.text}</span>
                </div>
                <span class="summary-price">${profilesOption.price}</span>
            </div>
        `;
    }
    
    // Company info
    if (funnelData.company) {
        html += `
            <div class="summary-item">
                <span class="summary-icon">🏢</span>
                <div class="summary-details">
                    <strong>Unternehmen:</strong>
                    <span>${funnelData.company}</span>
                </div>
            </div>
        `;
    }
    
    if (funnelData.industry) {
        html += `
            <div class="summary-item">
                <span class="summary-icon">🎯</span>
                <div class="summary-details">
                    <strong>Branche:</strong>
                    <span>${funnelData.industry}</span>
                </div>
            </div>
        `;
    }
    
    // Team size
    if (funnelData['team-size']) {
        const teamOption = funnelSteps[4].options.find(opt => opt.value === funnelData['team-size']);
        html += `
            <div class="summary-item">
                <span class="summary-icon">👥</span>
                <div class="summary-details">
                    <strong>Teamgröße:</strong>
                    <span>${teamOption.text}</span>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    summary.innerHTML = html;
}

// Complete funnel
function completeFunnel(action) {
    // Add action to funnel data
    funnelData.action = action;
    funnelData.timestamp = new Date().toISOString();
    
    // Show loading state
    const modal = document.querySelector('.modal-content');
    modal.classList.add('loading');
    
    // Submit data to backend
    submitFunnelData(funnelData)
        .then(response => {
            modal.classList.remove('loading');
            showSuccessMessage(action);
        })
        .catch(error => {
            modal.classList.remove('loading');
            showErrorMessage();
            console.error('Error submitting funnel data:', error);
        });
}

// Submit funnel data to backend
async function submitFunnelData(data) {
    // This would be your actual endpoint
    const endpoint = '/api/submit-lead';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        // For demo purposes, simulate success after 2 seconds
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, id: 'demo-' + Date.now() });
            }, 2000);
        });
    }
}

// Show success message
function showSuccessMessage(action) {
    const content = document.getElementById('funnelContent');
    const actionText = action === 'book' ? 'Buchung' : 'kostenlose Testbewertung';
    
    content.innerHTML = `
        <div class="success-message">
            <div class="success-icon">🎉</div>
            <h3>Vielen Dank für Ihre ${actionText}!</h3>
            <p>Wir haben Ihre Anfrage erhalten und werden uns innerhalb der nächsten 24 Stunden bei Ihnen melden.</p>
            
            <div class="success-steps">
                <h4>Was passiert als nächstes?</h4>
                <div class="success-step">
                    <span class="step-icon">📞</span>
                    <span>Persönliche Beratung durch unseren Experten</span>
                </div>
                <div class="success-step">
                    <span class="step-icon">📋</span>
                    <span>Individuelle Strategie für Ihr Unternehmen</span>
                </div>
                <div class="success-step">
                    <span class="step-icon">🔍</span>
                    <span>Transparente Aufklärung über den Prozess</span>
                </div>
                ${action === 'test' ? 
                    '<div class="success-step"><span class="step-icon">🎁</span><span>Kostenlose Testbewertung innerhalb von 48h</span></div>' : 
                    '<div class="success-step"><span class="step-icon">🚀</span><span>Schneller Start Ihrer Kampagne</span></div>'
                }
            </div>
            
            <button class="btn btn-primary btn-large" onclick="closeFunnel()">
                <span class="btn-icon">✓</span>
                Verstanden
            </button>
        </div>
    `;
}

// Show error message
function showErrorMessage() {
    const content = document.getElementById('funnelContent');
    
    content.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <h3>Entschuldigung, es ist ein Fehler aufgetreten</h3>
            <p>Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt:</p>
            
            <div class="contact-options">
                <div class="contact-option">
                    <span class="contact-icon">📧</span>
                    <span><strong>E-Mail:</strong> info@ratinghero.de</span>
                </div>
                <div class="contact-option">
                    <span class="contact-icon">📱</span>
                    <span><strong>Telefon:</strong> +49 (0) 123 456789</span>
                </div>
            </div>
            
            <div class="error-actions">
                <button class="btn btn-primary" onclick="startFunnel()">
                    <span class="btn-icon">🔄</span>
                    Erneut versuchen
                </button>
                <button class="btn btn-secondary" onclick="closeFunnel()">
                    Schließen
                </button>
            </div>
        </div>
    `;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('funnelModal');
    if (event.target === modal) {
        closeFunnel();
    }
}

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeFunnel();
    }
});

// Analytics tracking (Google Analytics, Facebook Pixel, etc.)
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
    
    // Console log for debugging
    console.log('Event tracked:', eventName, eventData);
}

// Track funnel events
function trackFunnelStep(stepName) {
    trackEvent('funnel_step_completed', {
        step_name: stepName,
        step_number: currentStep + 1
    });
}

// Track funnel completion
function trackFunnelCompletion(action) {
    trackEvent('funnel_completed', {
        action: action,
        total_steps: totalSteps
    });
}

// Performance optimization
function preloadImages() {
    // Preload critical images
    const imagesToPreload = [
        // Add your image URLs here
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload on page load
document.addEventListener('DOMContentLoaded', preloadImages);

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
} 