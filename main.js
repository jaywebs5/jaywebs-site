// ====================
// Particles.js (Gold Theme)
// ====================
particlesJS("particles-js", {
  particles: {
    number: { value: 70, density: { enable: true, value_area: 800 } },
    color: { value: "#FFD700" },
    shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
    opacity: { value: 0.7, random: true },
    size: { value: 4, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#FFD700",
      opacity: 0.3,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true
    }
  }
});

// ====================
// Sticky Header
// ====================
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ====================
// Mobile Menu Toggle
// ====================
const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.querySelector(".nav-links");

mobileToggle.addEventListener("click", function () {
  navLinks.classList.toggle("active");
  const icon = mobileToggle.querySelector("i");
  if (navLinks.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

// ====================
// Smooth Scrolling
// ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth"
      });

      // Close mobile menu if open
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        const icon = mobileToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    }
  });
});

// ====================
// Portfolio Filtering
// ====================
const filterBtns = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    filterBtns.forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    const filter = this.getAttribute("data-filter");

    portfolioItems.forEach(item => {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// ====================
// Testimonials Slider
// ====================
const testimonialSlides = document.querySelectorAll(".testimonial-slide");
const prevBtn = document.getElementById("prevTestimonial");
const nextBtn = document.getElementById("nextTestimonial");
let currentSlide = 0;

function showSlide(index) {
  testimonialSlides.forEach(slide => slide.classList.remove("active"));
  testimonialSlides[index].classList.add("active");
  currentSlide = index;
}

prevBtn.addEventListener("click", function () {
  let newIndex = currentSlide - 1;
  if (newIndex < 0) newIndex = testimonialSlides.length - 1;
  showSlide(newIndex);
});

nextBtn.addEventListener("click", function () {
  let newIndex = currentSlide + 1;
  if (newIndex >= testimonialSlides.length) newIndex = 0;
  showSlide(newIndex);
});

// Auto rotate
setInterval(() => {
  let newIndex = currentSlide + 1;
  if (newIndex >= testimonialSlides.length) newIndex = 0;
  showSlide(newIndex);
}, 8000);

// ====================
// Quote Calculator (Improved with data-step)
// ====================
const optionBtns = document.querySelectorAll(".option-btn");
const totalPrice = document.querySelector(".total-price");

let basePrice = 0;
let pagesPrice = 0;
let featuresPrice = 0;

optionBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    // Remove selected from siblings
    const parent = this.parentElement;
    const siblings = parent.querySelectorAll(".option-btn");
    siblings.forEach(sib => sib.classList.remove("selected"));

    // Add selected class
    this.classList.add("selected");

    const value = parseInt(this.getAttribute("data-value"));
    const step = this.closest(".calculator-step").dataset.step;

    if (step === "type") {
      basePrice = value;
    } else if (step === "pages") {
      pagesPrice = value;
    } else if (step === "features") {
      featuresPrice = value;
    }

    const total = basePrice + pagesPrice + featuresPrice;
    totalPrice.textContent = "R" + total.toLocaleString();
  });
});

// ====================
// Form Validation
// ====================
const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const projectType = document.getElementById("projectType").value;
  const budget = document.getElementById("budget").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !projectType || !budget || !message) {
    alert("Please fill in all required fields");
    return;
  }

  alert("Thank you for your premium project request! We will contact you shortly.");
  bookingForm.reset();
});

// ====================
// Book Consultation Button
// ====================
document.getElementById("bookConsultation").addEventListener("click", function () {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});
