// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Initialize Swiper for Portfolio with autoplay
const portfolioSwiper = new Swiper('.portfolio-swiper', {
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

// Initialize Swiper for Testimonials with autoplay
const testimonialsSwiper = new Swiper('.testimonials-swiper', {
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

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

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
  let total = parseInt(typeSelect.value);
  
  featureCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      total += parseInt(checkbox.value);
    }
  });
  
  resultDiv.textContent = `Estimated Quote: R${total}`;
}

typeSelect.addEventListener('change', calculateQuote);
featureCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', calculateQuote);
});

// Initialize with default value
calculateQuote();

// Stats Counter Animation
const stats = document.querySelectorAll('.stat-number');

function animateStats() {
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
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
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

observer.observe(statsSection);

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
document.getElementById('downloadQuote').addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const quote = resultDiv.textContent;
  const name = "JayWebs Quote";
  
  doc.setFontSize(20);
  doc.text(name, 20, 30);
  doc.setFontSize(16);
  doc.text(quote, 20, 50);
  doc.text("Thank you for your interest in JayWebs!", 20, 70);
  doc.text("We'll contact you shortly to discuss your project.", 20, 85);
  
  doc.save('jaywebs-quote.pdf');
});

// Pause autoplay on hover for better UX
document.querySelectorAll('.portfolio-swiper, .testimonials-swiper').forEach(swiperContainer => {
  swiperContainer.addEventListener('mouseenter', function() {
    this.swiper.autoplay.stop();
  });
  
  swiperContainer.addEventListener('mouseleave', function() {
    this.swiper.autoplay.start();
  });
});

// Booking Form Functionality
const bookingForm = document.getElementById('booking-form');
const dateInput = document.getElementById('date');

// Set minimum date to today
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];
dateInput.setAttribute('min', formattedDate);

// Handle form submission
bookingForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(bookingForm);
  const bookingData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    date: formData.get('date'),
    time: formData.get('time'),
    message: formData.get('message')
  };
  
  // In a real implementation, you would send this data to your server
  // For now, we'll simulate sending an email
  console.log('Booking Data:', bookingData);
  
  // Show success message
  alert('Thank you for your booking! We will contact you shortly to confirm your consultation.');
  
  // Reset form
  bookingForm.reset();
  
  // Reset date min attribute
  dateInput.setAttribute('min', formattedDate);
});

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
