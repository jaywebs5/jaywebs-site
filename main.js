document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }

  // Initialize Swiper for Portfolio with autoplay
  let portfolioSwiper;
  try {
    portfolioSwiper = new Swiper('.portfolio-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: '.portfolio-next',
        prevEl: '.portfolio-prev',
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      loop: true,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  } catch (e) {
    console.warn('Portfolio swiper init failed:', e);
  }

  // Initialize Swiper for Testimonials with autoplay
  let testimonialsSwiper;
  try {
    testimonialsSwiper = new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: {
        el: '.testimonials-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      loop: true,
      breakpoints: {
        768: {
          slidesPerView: 2,
        }
      }
    });
  } catch (e) {
    console.warn('Testimonials swiper init failed:', e);
  }

  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = mobileMenuToggle.querySelector('i');
      if (mainNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isActive = question.classList.contains('active');

      // Close all answers
      document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.style.display = 'none';
      });
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
      });

      // Open clicked answer if it wasn't active
      if (!isActive) {
        answer.style.display = 'block';
        question.classList.add('active');
      }
    });
  });

  // Quote Calculator
  const quoteForm = document.getElementById('quote-form');
  const typeSelect = document.getElementById('type');
  const featureCheckboxes = document.querySelectorAll('.features input[type="checkbox"]');
  const resultDiv = document.getElementById('result');

  function calculateQuote() {
    let total = parseInt(typeSelect.value) || 0;

    featureCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        total += parseInt(checkbox.value) || 0;
      }
    });

    resultDiv.textContent = `Estimated Quote: R${total}`;
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', calculateQuote);
  }
  featureCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateQuote);
  });

  // Initialize with default value
  calculateQuote();

  // Stats Counter Animation
  const stats = document.querySelectorAll('.stat-number');

  function animateStats() {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target')) || 0;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current);
      }, 16);
    });
  }

  // Intersection Observer for stats animation
  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
  } else {
    // Fallback
    animateStats();
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          mobileMenuToggle.querySelector('i').classList.remove('fa-times');
          mobileMenuToggle.querySelector('i').classList.add('fa-bars');
        }
      }
    });
  });

  // Download Quote as PDF
  const downloadBtn = document.getElementById('downloadQuote');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const quote = resultDiv ? resultDiv.textContent : 'Estimated Quote: R0';
        const name = "JayWebs Quote";

        doc.setFontSize(20);
        doc.text(name, 20, 30);
        doc.setFontSize(16);
        doc.text(quote, 20, 50);
        doc.text("Thank you for your interest in JayWebs!", 20, 70);
        doc.text("We'll contact you shortly to discuss your project.", 20, 85);

        doc.save('jaywebs-quote.pdf');
      } catch (err) {
        console.error('PDF generation failed', err);
        alert('Unable to generate PDF in this browser.');
      }
    });
  }

  // Pause autoplay on hover for better UX
  document.querySelectorAll('.portfolio-swiper, .testimonials-swiper').forEach(swiperContainer => {
    swiperContainer.addEventListener('mouseenter', function() {
      // stop the matching swiper instance if present
      if (this.classList.contains('portfolio-swiper') && portfolioSwiper && portfolioSwiper.autoplay) {
        portfolioSwiper.autoplay.stop();
      }
      if (this.classList.contains('testimonials-swiper') && testimonialsSwiper && testimonialsSwiper.autoplay) {
        testimonialsSwiper.autoplay.stop();
      }
    });

    swiperContainer.addEventListener('mouseleave', function() {
      if (this.classList.contains('portfolio-swiper') && portfolioSwiper && portfolioSwiper.autoplay) {
        portfolioSwiper.autoplay.start();
      }
      if (this.classList.contains('testimonials-swiper') && testimonialsSwiper && testimonialsSwiper.autoplay) {
        testimonialsSwiper.autoplay.start();
      }
    });
  });

  // Booking Form Functionality with Validation
  const bookingForm = document.getElementById('booking-form');
  const dateInput = document.getElementById('date');
  const bookingSpinner = document.getElementById('booking-spinner');
  const bookingSuccess = document.getElementById('booking-success');
  const bookingSubmit = document.getElementById('booking-submit');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', formattedDate);
  }

  // Form validation functions
  function validateName() {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (nameInput.value.trim() === '') {
      nameInput.classList.add('error');
      nameError.style.display = 'block';
      return false;
    } else {
      nameInput.classList.remove('error');
      nameError.style.display = 'none';
      return true;
    }
  }

  function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('error');
      emailError.style.display = 'block';
      return false;
    } else {
      emailInput.classList.remove('error');
      emailError.style.display = 'none';
      return true;
    }
  }

  function validatePhone() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    // Basic phone validation - can be enhanced for specific formats
    if (phoneInput.value.trim() === '' || phoneInput.value.trim().length < 8) {
      phoneInput.classList.add('error');
      phoneError.style.display = 'block';
      return false;
    } else {
      phoneInput.classList.remove('error');
      phoneError.style.display = 'none';
      return true;
    }
  }

  function validateService() {
    const serviceInput = document.getElementById('service');
    const serviceError = document.getElementById('service-error');
    if (serviceInput.value === '') {
      serviceInput.classList.add('error');
      serviceError.style.display = 'block';
      return false;
    } else {
      serviceInput.classList.remove('error');
      serviceError.style.display = 'none';
      return true;
    }
  }

  function validateDate() {
    const dateInput = document.getElementById('date');
    const dateError = document.getElementById('date-error');
    if (dateInput.value === '') {
      dateInput.classList.add('error');
      dateError.style.display = 'block';
      return false;
    } else {
      dateInput.classList.remove('error');
      dateError.style.display = 'none';
      return true;
    }
  }

  function validateTime() {
    const timeInput = document.getElementById('time');
    const timeError = document.getElementById('time-error');
    if (timeInput.value === '') {
      timeInput.classList.add('error');
      timeError.style.display = 'block';
      return false;
    } else {
      timeInput.classList.remove('error');
      timeError.style.display = 'none';
      return true;
    }
  }

  // Add event listeners for real-time validation
  document.getElementById('name').addEventListener('blur', validateName);
  document.getElementById('email').addEventListener('blur', validateEmail);
  document.getElementById('phone').addEventListener('blur', validatePhone);
  document.getElementById('service').addEventListener('change', validateService);
  document.getElementById('date').addEventListener('change', validateDate);
  document.getElementById('time').addEventListener('change', validateTime);

  // Handle form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validate all fields
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isServiceValid = validateService();
      const isDateValid = validateDate();
      const isTimeValid = validateTime();

      // If all valid, submit the form
      if (isNameValid && isEmailValid && isPhoneValid && isServiceValid && isDateValid && isTimeValid) {
        // Show loading spinner
        bookingSpinner.style.display = 'block';
        bookingSubmit.disabled = true;

        // Simulate form submission (replace with actual submission)
        setTimeout(() => {
          // Hide spinner and show success message
          bookingSpinner.style.display = 'none';
          bookingSuccess.style.display = 'block';
          
          // Reset form
          bookingForm.reset();
          
          // Reset date min attribute
          if (dateInput) {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            dateInput.setAttribute('min', formattedDate);
          }
          
          // Re-enable submit button
          bookingSubmit.disabled = false;
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            bookingSuccess.style.display = 'none';
          }, 5000);
        }, 1500);
      }
    });
  }

  // Scroll-aware header functionality
  const header = document.getElementById('mainHeader');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    // Don't hide header on mobile when menu is open
    if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
      return;
    }

    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      // Scrolling down - hide header
      header.classList.add('hidden');
    } else {
      // Scrolling up - show header
      header.classList.remove('hidden');
    }

    lastScrollY = window.scrollY;
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target) && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      mobileMenuToggle.querySelector('i').classList.remove('fa-times');
      mobileMenuToggle.querySelector('i').classList.add('fa-bars');
    }
  });
});
