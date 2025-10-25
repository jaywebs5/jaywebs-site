document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  
  // Set minimum date and time for booking form
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  
  if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format date as YYYY-MM-DD
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    
    // Set default value to tomorrow
    dateInput.value = minDate;
  }
  
  // Header scroll effect
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Smooth scrolling for navigation links
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
  
  // Highlight active navigation link based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNavLink);
  
  // Portfolio filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  
  // Enhanced quote calculator functionality
  const quoteForm = document.getElementById('quoteForm');
  const generateQuoteBtn = document.getElementById('generateQuote');
  const estimateValue = document.getElementById('estimateValue');
  const whatsappQuoteBtn = document.getElementById('whatsappQuote');
  
  if (generateQuoteBtn && estimateValue) {
    generateQuoteBtn.addEventListener('click', () => {
      // Show loading state
      generateQuoteBtn.classList.add('btn-loading');
      
      // Validate form first
      const siteType = document.getElementById('siteType');
      const deadline = document.getElementById('deadline');
      
      let isValid = true;
      
      if (!siteType.value) {
        siteType.closest('.form-row').classList.add('error');
        isValid = false;
      } else {
        siteType.closest('.form-row').classList.remove('error');
      }
      
      if (!deadline.value) {
        deadline.closest('.form-row').classList.add('error');
        isValid = false;
      } else {
        deadline.closest('.form-row').classList.remove('error');
      }
      
      if (!isValid) {
        generateQuoteBtn.classList.remove('btn-loading');
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      // Simulate calculation delay
      setTimeout(() => {
        // Base pricing
        const basePrices = {
          landing: 3000,
          business: 5000,
          ecommerce: 20000,
          webapp: 35000
        };
        
        // Get form values
        const numPages = parseInt(document.getElementById('numPages').value) || 1;
        
        // Calculate base cost
        let cost = basePrices[siteType.value] || 0;
        
        // Add cost for pages (beyond base)
        if (siteType.value === 'business' && numPages > 5) {
          cost += (numPages - 5) * 1000;
        } else if (siteType.value === 'ecommerce' && numPages > 10) {
          cost += (numPages - 10) * 800;
        }
        
        // Add rush fee
        if (deadline.value === 'rush') {
          cost *= 1.3; // 30% rush fee
        }
        
        // Add features cost
        const features = document.querySelectorAll('input[name="features"]:checked');
        features.forEach(feature => {
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
          const message = `Hi JayWebs, I got a quote of R${cost.toLocaleString()} from your website. Can we discuss my project?`;
          const encodedMessage = encodeURIComponent(message);
          whatsappQuoteBtn.href = `https://wa.me/27760944650?text=${encodedMessage}`;
        }
        
        // Remove loading state
        generateQuoteBtn.classList.remove('btn-loading');
      }, 800);
    });
  }
  
  // Enhanced value animation
  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = `R${value.toLocaleString()}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };
  
  // Animated stats counter
  const statNumbers = document.querySelectorAll('.stat-number');
  
  // Intersection Observer for stats animation and fade-in effects
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate stats
        if (entry.target.id === 'stats') {
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateValue(stat, 0, target, 2000);
          });
        }
        
        // Add fade-in class to elements as they come into view
        if (entry.target.classList.contains('stagger')) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('fade-in');
            }, index * 150);
          });
        } else {
          entry.target.classList.add('fade-in');
        }
      }
    });
  }, { threshold: 0.1 });
  
  // Observe sections for animations
  document.querySelectorAll('section, .stagger').forEach(section => {
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
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));
      
      // Show current slide
      slides[index].classList.add('active');
      indicators[index].classList.add('active');
      
      currentSlide = index;
    }
    
    // Add click events to indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSlide(index);
      });
    });
    
    // Auto-advance slides
    setInterval(() => {
      let nextSlide = currentSlide + 1;
      if (nextSlide >= slides.length) {
        nextSlide = 0;
      }
      showSlide(nextSlide);
    }, 4000); // Change slide every 4 seconds
  }
  
  // Initialize website showcase slideshow
  initShowcaseSlideshow();
  
  // Enhanced Booking Form Submission
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
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
      
      try {
        // Collect form data
        const formData = {
          name: document.getElementById('fullName').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          service: document.getElementById('service').value,
          date: document.getElementById('date').value,
          time: document.getElementById('time').value,
          notes: document.getElementById('notes').value,
          timestamp: new Date().toISOString()
        };
        
        // Simulate API call
        await simulateBookingSubmission(formData);
        
        // Show success message and confirmation
        showNotification('Booking confirmed! Check your email for details.', 'success');
        
        // Hide form and show confirmation
        bookingForm.style.display = 'none';
        document.getElementById('bookingConfirmation').style.display = 'block';
        
      } catch (error) {
        showNotification('Booking failed. Please try again or contact us directly.', 'error');
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // Enhanced booking validation
  function validateBookingForm() {
    let isValid = true;
    const fields = ['fullName', 'email', 'phone', 'service', 'date', 'time'];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
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
    });
    
    return isValid;
  }

  // Simulate booking submission
  function simulateBookingSubmission(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Booking submitted:', formData);
        // In real implementation, send to backend API
        resolve(true);
      }, 2000);
    });
  }

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Validate form
      let isValid = true;
      const inputs = contactForm.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        // Show loading state
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
          showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
          contactForm.reset();
          submitBtn.classList.remove('btn-loading');
          submitBtn.disabled = false;
        }, 1500);
      } else {
        showNotification('Please fix the errors in the form', 'error');
      }
    });
  }
  
  // Field validation function
  function validateField(field) {
    const formRow = field.closest('.form-row');
    const errorMsg = formRow.querySelector('.error-message') || createErrorMessage(formRow);
    
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
  
  function createErrorMessage(formRow) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    formRow.appendChild(errorMsg);
    return errorMsg;
  }
  
  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
  // Cookie consent functionality
  const cookieConsent = document.getElementById('cookieConsent');
  const acceptCookies = document.getElementById('acceptCookies');
  
  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
      cookieConsent.classList.add('show');
    }, 1000);
  }
  
  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.classList.remove('show');
    });
  }
  
  // PDF generation for quotes
  const downloadQuoteBtn = document.getElementById('downloadQuote');
  if (downloadQuoteBtn) {
    downloadQuoteBtn.addEventListener('click', () => {
      if (estimateValue.textContent === 'R0') {
        showNotification('Please generate a quote first', 'error');
        return;
      }
      
      // Show loading state
      downloadQuoteBtn.classList.add('btn-loading');
      
      // Use jsPDF if available
      if (window.jspdf && window.jspdf.jsPDF) {
        setTimeout(() => {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF();
          
          // Add content to PDF
          doc.setFontSize(20);
          doc.text('JayWebs Project Quote', 20, 30);
          
          doc.setFontSize(12);
          doc.text(`Estimated Cost: ${estimateValue.textContent}`, 20, 50);
          doc.text(`Website Type: ${document.getElementById('siteType').value}`, 20, 60);
          doc.text(`Number of Pages: ${document.getElementById('numPages').value || '1'}`, 20, 70);
          
          // Add features
          const features = Array.from(document.querySelectorAll('input[name="features"]:checked'))
            .map(cb => cb.value);
          doc.text(`Features: ${features.join(', ')}`, 20, 80);
          
          doc.text(`Timeline: ${document.getElementById('deadline').value}`, 20, 90);
          doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 100);
          doc.text(`Contact: jaywebs10@gmail.com`, 20, 110);
          doc.text(`WhatsApp: +27 76 094 4650`, 20, 120);
          
          // Save the PDF
          doc.save(`jaywebs-quote-${new Date().toISOString().slice(0,10)}.pdf`);
          
          // Remove loading state
          downloadQuoteBtn.classList.remove('btn-loading');
          
          showNotification('PDF quote downloaded successfully', 'success');
        }, 1000);
      } else {
        // Fallback: Open print dialog
        window.print();
        downloadQuoteBtn.classList.remove('btn-loading');
      }
    });
  }
  
  // Live chat button
  const liveChatBtn = document.getElementById('liveChatBtn');
  if (liveChatBtn) {
    liveChatBtn.addEventListener('click', () => {
      showNotification('Live chat would open here. In a real implementation, this would integrate with a service like Intercom or Drift.', 'info');
    });
  }
});
