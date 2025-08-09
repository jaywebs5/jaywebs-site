// main.js

document.addEventListener('DOMContentLoaded', () => {

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = darkModeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });

  // FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      // Toggle active class on clicked question
      question.classList.toggle('active');

      // Toggle the corresponding answer visibility
      const answer = question.nextElementSibling;
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
      } else {
        answer.style.display = 'block';
      }
    });
  });

  // Stats Counter Animation
  const stats = document.querySelectorAll('.stat-number');
  let statsStarted = false;

  function animateStats() {
    stats.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      let count = 0;
      const speed = 30; // smaller is faster

      const updateCount = () => {
        count += Math.ceil(target / speed);
        if (count > target) count = target;
        stat.textContent = count;
        if (count < target) {
          setTimeout(updateCount, 40);
        }
      };
      updateCount();
    });
  }

  window.addEventListener('scroll', () => {
    const statsSection = document.getElementById('stats');
    if (!statsStarted && statsSection.getBoundingClientRect().top < window.innerHeight) {
      animateStats();
      statsStarted = true;
    }
  });

  // Quote Calculator Logic
  const quoteForm = document.getElementById('quote-form');
  const typeSelect = document.getElementById('type');
  const featuresDiv = document.getElementById('features');
  const resultDiv = document.getElementById('result');
  const downloadBtn = document.getElementById('downloadQuote');

  function calculateQuote() {
    let basePrice = 0;
    const type = typeSelect.value;
    if (type === 'basic') basePrice = 2099;
    else if (type === 'business') basePrice = 3499;
    else if (type === 'ecommerce') basePrice = 6999;

    let featuresPrice = 0;
    const checkboxes = featuresDiv.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        if (checkbox.value === 'seo') featuresPrice += 500;
        else if (checkbox.value === 'chat') featuresPrice += 200;
        else if (checkbox.value === 'blog') featuresPrice += 400;
        else if (checkbox.value === 'booking') featuresPrice += 700;
      }
    });

    const total = basePrice + featuresPrice;
    resultDiv.textContent = `Estimated Quote: R${total.toLocaleString()}`;
    return total;
  }

  // Calculate quote on change
  typeSelect.addEventListener('change', calculateQuote);
  featuresDiv.addEventListener('change', calculateQuote);

  // Initial quote calculation
  calculateQuote();

  // Download Quote as PDF
  downloadBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const typeText = typeSelect.options[typeSelect.selectedIndex].text;
    let featuresSelected = [];
    featuresDiv.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      const label = cb.parentElement.textContent.trim();
      featuresSelected.push(label);
    });
    const featuresText = featuresSelected.length > 0 ? featuresSelected.join(', ') : 'None';

    const totalPrice = calculateQuote();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('JayWebs - Instant Quote', 20, 20);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Website Type: ${typeText}`, 20, 40);
    doc.text(`Additional Features: ${featuresText}`, 20, 50);
    doc.text(`Total Estimated Price: R${totalPrice.toLocaleString()}`, 20, 60);

    doc.save('JayWebs_Quote.pdf');
  });

  // Initialize Swiper sliders (Portfolio & Testimonials)
  const portfolioSwiper = new Swiper('.portfolio-swiper', {
    loop: true,
    navigation: {
      nextEl: '.portfolio-next',
      prevEl: '.portfolio-prev',
    },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      }
    }
  });

  const testimonialsSwiper = new Swiper('.testimonials-swiper', {
    loop: true,
    pagination: {
      el: '.testimonials-pagination',
      clickable: true,
    },
    slidesPerView: 1,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    }
  });

  // Smooth scrolling for nav links
  document.querySelectorAll('nav a, .sticky-contact-btn').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});