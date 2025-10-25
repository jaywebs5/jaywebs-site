document.addEventListener('DOMContentLoaded', function() {
  console.log('JayWebs website loaded successfully');
  
  // Set current year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Header scroll effect
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      
      // Toggle hamburger to X
      const bars = navToggle.querySelectorAll('.nav-toggle-bar');
      if (!isExpanded) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
  }
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-menu a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (navMenu) {
        navMenu.classList.remove('active');
      }
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        // Reset hamburger icon
        const bars = navToggle.querySelectorAll('.nav-toggle-bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
  });
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Portfolio filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      portfolioItems.forEach(function(item) {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          setTimeout(function() {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(function() {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Quote Calculator
  const generateQuoteBtn = document.getElementById('generateQuote');
  const estimateValue = document.getElementById('estimateValue');
  const whatsappQuoteBtn = document.getElementById('whatsappQuote');
  
  if (generateQuoteBtn && estimateValue) {
    generateQuoteBtn.addEventListener('click', calculateQuote);
  }
  
  function calculateQuote() {
    // Show loading state
    if (generateQuoteBtn) {
      generateQuoteBtn.classList.add('btn-loading');
    }
    
    // Validate form first
    const siteType = document.getElementById('siteType');
    const deadline = document.getElementById('deadline');
    
    let isValid = true;
    
    if (!siteType || !siteType.value) {
      if (siteType) siteType.closest('.form-row').classList.add('error');
      isValid = false;
    } else {
      siteType.closest('.form-row').classList.remove('error');
    }
    
    if (!deadline || !deadline.value) {
      if (deadline) deadline.closest('.form-row').classList.add('error');
      isValid = false;
    } else {
      deadline.closest('.form-row').classList.remove('error');
    }
    
    if (!isValid) {
      if (generateQuoteBtn) generateQuoteBtn.classList.remove('btn-loading');
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Simulate calculation delay
    setTimeout(function() {
      // Base pricing
      const basePrices = {
        landing: 3000,
        business: 5000,
        ecommerce: 20000,
        webapp: 35000
      };
      
      // Get form values
      const numPages = parseInt(document.getElementById('numPages') ? document.getElementById('numPages').value : 1) || 1;
      const siteTypeValue = siteType.value;
      
      // Calculate base cost
      let cost = basePrices[siteTypeValue] || 0;
      
      // Add cost for pages (beyond base)
      if (siteTypeValue === 'business' && numPages > 5) {
        cost += (numPages - 5) * 1000;
      } else if (siteTypeValue === 'ecommerce' && numPages > 10) {
        cost += (numPages - 10) * 800;
      }
      
      // Add rush fee
      if (deadline.value === 'rush') {
        cost *= 1.3; // 30% rush fee
      }
      
      // Add features cost
      const features = document.querySelectorAll('input[name="features"]:checked');
      features.forEach(function(feature) {
        switch(feature.value) {
          case 'booking':
            cost += 2000;
            break;
          case 'blog':
            cost += 1500;
            break;
          case 'seo':
            cost += 3000;
            break;
          case 'payments':
            cost += 2500;
            break;
          case 'chat':
            cost += 1000;
            break;
          case 'dashboard':
            cost += 4000;
            break;
        }
      });
      
      // Update estimate with animation
      const currentValue = parseInt(estimateValue.textContent.replace('R', '').replace(',', '')) || 0;
      animateValue(estimateValue, currentValue, cost, 1000);
      
      // Update WhatsApp link with the quote
      if (whatsappQuoteBtn) {
        const message = 'Hi JayWebs, I got a quote of R' + cost.toLocaleString() + ' from your website. Can we discuss my project?';
        const encodedMessage = encodeURIComponent(message);
        whatsappQuoteBtn.href = 'https://wa.me/27760944650?text=' + encodedMessage;
      }
      
      // Remove loading state
      if (generateQuoteBtn) generateQuoteBtn.classList.remove('btn-loading');
    }, 800);
  }
  
  // Value animation function
  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = function(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = 'R' + value.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  
  // Animated stats counter
  const statNumbers = document.querySelectorAll('.stat-number');
  
  // Intersection Observer for animations
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Animate stats
        if (entry.target.id === 'stats') {
          statNumbers.forEach(function(stat) {
            const target = parseInt(stat.getAttribute('data-target'));
            animateValue(stat, 0, target, 2000);
          });
        }
        
        // Add fade-in class to elements as they come into view
        if (entry.target.classList.contains('stagger')) {
          const children = entry.target.children;
          Array.from(children).forEach(function(child, index) {
            setTimeout(function() {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 150);
          });
        } else {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      }
    });
  }, { threshold: 0.1 });
  
  // Observe sections for animations
  document.querySelectorAll('section, .stagger').forEach(function(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
  
  // Website Showcase Slideshow
  function initShowcaseSlideshow() {
    const slides = document.querySelectorAll('.showcase-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function showSlide(index) {
      // Hide all slides
      slides.forEach(function(slide) {
        slide.classList.remove('active');
      });
      indicators.forEach(function(indicator) {
        indicator.classList.remove('active');
      });
      
      // Show current slide
      slides[index].classList.add('active');
      indicators[index].classList.add('active');
      
      currentSlide = index;
    }
    
    // Add click events to indicators
    indicators.forEach(function(indicator, index) {
      indicator.addEventListener('click', function() {
        showSlide(index);
      });
    });
    
    // Auto-advance slides
    setInterval(function() {
      let nextSlide = currentSlide + 1;
      if (nextSlide >= slides.length) {
        nextSlide = 0;
      }
      showSlide(nextSlide);
    }, 4000);
  }
  
  // Initialize website showcase slideshow
  initShowcaseSlideshow();
  
  // Form handling
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }
  
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  
  function handleBookingSubmit(e) {
    e.preventDefault();
    
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Validate form
    if (!validateBookingForm()) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }
    
    // Show loading state
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(function() {
      showNotification('Booking confirmed! Check your email for details.', 'success');
      
      // Hide form and show confirmation
      bookingForm.style.display = 'none';
      const confirmation = document.getElementById('bookingConfirmation');
      if (confirmation) {
        confirmation.style.display = 'block';
      }
      
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
    }, 2000);
  }
  
  function handleContactSubmit(e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // Validate form
    let isValid = true;
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(function(input) {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      // Show loading state
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(function() {
        showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
        contactForm.reset();
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
      }, 1500);
    } else {
      showNotification('Please fix the errors in the form', 'error');
    }
  }
  
  function validateBookingForm() {
    let isValid = true;
    const fields = ['fullName', 'email', 'phone', 'service', 'date', 'time'];
    
    fields.forEach(function(fieldId) {
      const field = document.getElementById(fieldId);
      if (field) {
        const formRow = field.closest('.form-row');
        
        if (!field.value.trim()) {
          formRow.classList.add('error');
          isValid = false;
        } else {
          formRow.classList.remove('error');
        }
        
        // Email validation
        if (fieldId === 'email' && field.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            formRow.classList.add('error');
            isValid = false;
          }
        }
      }
    });
    
    return isValid;
  }
  
  function validateField(field) {
    const formRow = field.closest('.form-row');
    let errorMsg = formRow.querySelector('.error-message');
    
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      formRow.appendChild(errorMsg);
    }
    
    // Reset state
    formRow.classList.remove('error');
    errorMsg.textContent = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
      formRow.classList.add('error');
      errorMsg.textContent = 'This field is required';
      return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        formRow.classList.add('error');
        errorMsg.textContent = 'Please enter a valid email address';
        return false;
      }
    }
    
    return true;
  }
  
  // Notification system
  function showNotification(message, type) {
    if (!type) type = 'info';
    
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(function() {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
  
  // Cookie consent
  const cookieConsent = document.getElementById('cookieConsent');
  const acceptCookies = document.getElementById('acceptCookies');
  
  if (cookieConsent && acceptCookies) {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(function() {
        cookieConsent.classList.add('show');
      }, 1000);
    }
    
    acceptCookies.addEventListener('click', function() {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.classList.remove('show');
    });
  }
  
  // Live chat button
  const liveChatBtn = document.getElementById('liveChatBtn');
  if (liveChatBtn) {
    liveChatBtn.addEventListener('click', function() {
      showNotification('Live chat would open here. In a real implementation, this would integrate with a service like Intercom or Drift.', 'info');
    });
  }
  
  // PDF download button
  const downloadQuoteBtn = document.getElementById('downloadQuote');
  if (downloadQuoteBtn) {
    downloadQuoteBtn.addEventListener('click', function() {
      if (estimateValue.textContent === 'R0') {
        showNotification('Please generate a quote first', 'error');
        return;
      }
      
      // Show loading state
      downloadQuoteBtn.classList.add('btn-loading');
      
      // Simulate PDF generation
      setTimeout(function() {
        showNotification('PDF quote would be downloaded here. In a real implementation, this would generate a PDF.', 'info');
        downloadQuoteBtn.classList.remove('btn-loading');
      }, 1000);
    });
  }
  
  console.log('All JavaScript functionality loaded');
});
