// Loading Spinner
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    loader.classList.add('hidden');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
    
    // Initialize lazy loading
    initLazyLoad();
    
    // Register service worker
    registerServiceWorker();
});

// Lazy loading initialization
function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers without native lazy loading
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        observer.unobserve(lazyImage);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img.lazyload');
        lazyImages.forEach(img => {
            lazyLoadObserver.observe(img);
        });
    }
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker registration successful');
            }).catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Update URL without jumping
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }
        }
    });
});

// Portfolio Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.body.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-hidden', 'true');
}

// Close modal when clicking outside content
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        document.body.style.overflow = 'auto';
        document.body.setAttribute('aria-hidden', 'false');
        event.target.setAttribute('aria-hidden', 'true');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// Service Details Toggle
function toggleDetails(detailsId, button) {
    const details = document.getElementById(detailsId);
    const isExpanded = details.classList.toggle('show');
    button.classList.toggle('active');
    button.setAttribute('aria-expanded', isExpanded);
}

// Form Validation and Submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validateForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    // Reset error states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    // Validate name
    if (!name.value.trim()) {
        document.getElementById('name-error').style.display = 'block';
        name.parentElement.classList.add('error');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim() || !validateEmail(email.value)) {
        document.getElementById('email-error').style.display = 'block';
        email.parentElement.classList.add('error');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        document.getElementById('message-error').style.display = 'block';
        message.parentElement.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const formData = new FormData(this);
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Replace with your actual form submission endpoint
        fetch('https://formspree.io/f/your-actual-form-id', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                formMessage.textContent = 'Thank you! Your message has been sent.';
                formMessage.style.display = 'block';
                formMessage.style.color = 'var(--primary)';
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            formMessage.textContent = 'Oops! There was a problem sending your message. Please try again later or contact me directly.';
            formMessage.style.display = 'block';
            formMessage.style.color = '#ff3333';
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    });
    
    // Real-time validation
    document.getElementById('name').addEventListener('input', function() {
        if (this.value.trim()) {
            this.parentElement.classList.remove('error');
            document.getElementById('name-error').style.display = 'none';
        }
    });
    
    document.getElementById('email').addEventListener('input', function() {
        if (this.value.trim() && validateEmail(this.value)) {
            this.parentElement.classList.remove('error');
            document.getElementById('email-error').style.display = 'none';
        }
    });
    
    document.getElementById('message').addEventListener('input', function() {
        if (this.value.trim()) {
            this.parentElement.classList.remove('error');
            document.getElementById('message-error').style.display = 'none';
        }
    });
}

// Animate elements when they come into view
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.portfolio-item, .pricing-card, .testimonial-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animation
window.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.portfolio-item, .pricing-card, .testimonial-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger once immediately
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);
