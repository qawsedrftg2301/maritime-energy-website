/**
 * GreenHome Energy Solutions
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initFAQ();
    initTabs();
    initContactForm();
    initSmoothScroll();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Scroll-based animations and effects
 */
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.service-card, .testimonial-card, .comparison-card, .expertise-card, .team-card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * FAQ accordion functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

/**
 * Tab functionality for rebates page
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (isValid) {
                // Simulate form submission
                // In production, replace with actual API call
                const formData = new FormData(form);
                
                console.log('Form submitted with data:');
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }

                // Show success message
                form.style.display = 'none';
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                }

                // In production, you would send data to server:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     body: formData
                // }).then(response => {
                //     // Handle response
                // });
            }
        });

        // Remove error class on input
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Energy Savings Calculator
 */
function calculateSavings() {
    const homeSize = parseFloat(document.getElementById('homeSize').value) || 2000;
    const heatingType = document.getElementById('heatingType').value;
    const monthlyBill = parseFloat(document.getElementById('monthlyBill').value) || 200;
    const province = document.getElementById('province').value;

    // Efficiency multipliers by heating type
    const efficiencyMultipliers = {
        'gas': 0.40,      // 40% savings when switching from gas
        'oil': 0.55,      // 55% savings when switching from oil
        'electric': 0.60, // 60% savings when switching from electric baseboard
        'propane': 0.50   // 50% savings when switching from propane
    };

    // Calculate savings
    const savingsMultiplier = efficiencyMultipliers[heatingType] || 0.45;
    const annualBill = monthlyBill * 12;
    const annualSavings = Math.round(annualBill * savingsMultiplier);
    const monthlySavings = Math.round(annualSavings / 12);
    
    // Estimate installation cost based on home size
    const estimatedCost = Math.round(6000 + (homeSize - 1500) * 1.5);
    
    // Calculate payback period
    const paybackYears = (estimatedCost / annualSavings).toFixed(1);
    
    // Calculate 10-year savings
    const tenYearSavings = (annualSavings * 10) - estimatedCost;

    // CO2 reduction estimate (tonnes per year)
    const co2Reduction = {
        'gas': 4.5,
        'oil': 6.2,
        'electric': 0.5,
        'propane': 5.0
    };
    const co2Saved = co2Reduction[heatingType] || 3.0;

    // Display results
    const resultsContainer = document.getElementById('calculatorResults');
    resultsContainer.innerHTML = `
        <div class="results-content">
            <h3>Your Estimated Savings</h3>
            <div class="result-item">
                <span class="result-label">Annual Savings</span>
                <span class="result-value">$${annualSavings.toLocaleString()}</span>
                <span class="result-note">$${monthlySavings}/month</span>
            </div>
            <div class="result-item">
                <span class="result-label">Estimated Investment</span>
                <span class="result-value">$${estimatedCost.toLocaleString()}</span>
                <span class="result-note">Based on home size</span>
            </div>
            <div class="result-item">
                <span class="result-label">Payback Period</span>
                <span class="result-value">${paybackYears} years</span>
            </div>
            <div class="result-item">
                <span class="result-label">10-Year Net Savings</span>
                <span class="result-value">$${tenYearSavings.toLocaleString()}</span>
            </div>
            <div class="result-item">
                <span class="result-label">CO₂ Reduction</span>
                <span class="result-value">${co2Saved} tonnes/year</span>
            </div>
            <a href="contact.html?service=audit" class="btn btn-white btn-block" style="margin-top: 1rem;">
                Get Accurate Quote
            </a>
        </div>
    `;
}

/**
 * Utility function to format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Number counter animation
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

/**
 * Lazy load images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Form field auto-formatting
 */
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 10) {
        value = value.substring(0, 10);
        input.value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
    }
}

function formatPostalCode(input) {
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 3) {
        input.value = `${value.substring(0, 3)} ${value.substring(3, 6)}`;
    } else {
        input.value = value;
    }
}

// Make calculateSavings available globally
window.calculateSavings = calculateSavings;
