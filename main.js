// Smooth scrolling for nav links
document.querySelectorAll('.nav-links a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Scroll animations
const animatedElements = document.querySelectorAll('[data-animate]');

function animateOnScroll() {
  animatedElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
// Testimonial Slider
const slides = document.querySelector(".testimonial-slider .slides");
const prevBtn = document.querySelector(".testimonial-slider .prev");
const nextBtn = document.querySelector(".testimonial-slider .next");
let index = 0;

function showSlide(i) {
  const totalSlides = document.querySelectorAll(".testimonial").length;
  index = (i + totalSlides) % totalSlides; // wrap around
  slides.style.transform = `translateX(${-index * 100}%)`;
}

// Auto slide every 5s
setInterval(() => {
  showSlide(index + 1);
}, 5000);

// Manual controls
prevBtn.addEventListener("click", () => showSlide(index - 1));
nextBtn.addEventListener("click", () => showSlide(index + 1));
