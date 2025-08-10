// Dark Mode Toggle (assuming you have this from before)
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Initialize Swiper instances (if you use them)
const portfolioSwiper = new Swiper('.portfolio-swiper', {
  navigation: {
    nextEl: '.portfolio-next',
    prevEl: '.portfolio-prev',
  },
  loop: true,
});

const testimonialsSwiper = new Swiper('.testimonials-swiper', {
  pagination: {
    el: '.testimonials-pagination',
    clickable: true,
  },
  loop: true,
});

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    question.classList.toggle('active');
    const answer = question.nextElementSibling;
    if (answer.style.display === 'block') {
      answer.style.display = 'none';
    } else {
      answer.style.display = 'block';
    }
  });
});

// Stats counter animation (optional)
const stats = document.querySelectorAll('.stat-number');
const speed = 200; // lower is faster

stats.forEach(stat => {
  const updateCount = () => {
    const target = +stat.getAttribute('data-target');
    let count = +stat.innerText;

    if (count < target) {
      stat.innerText = (count + target / speed).toFixed(2);
      setTimeout(updateCount, 20);
    } else {
      stat.innerText = target;
    }
  };
  updateCount();
});

// Quote Calculator: Update price dynamically
function updateQuote() {
  const typeSelect = document.getElementById('type');
  let price = 0;
  switch(typeSelect.value) {
    case 'basic': price = 2099; break;
    case 'business': price = 3499; break;
    case 'ecommerce': price = 6999; break;
  }

  const features = document.querySelectorAll('#features input[type="checkbox"]:checked');
  let featuresCost = 0;
  features.forEach(feature => {
    switch(feature.value) {
      case 'seo': featuresCost += 500; break;
      case 'chat': featuresCost += 200; break;
      case 'blog': featuresCost += 400; break;
      case 'booking': featuresCost += 700; break;
    }
  });

  const totalCost = price + featuresCost;
  document.getElementById('result').textContent = `Estimated Quote: R${totalCost}`;
}

document.getElementById('type').addEventListener('change', updateQuote);
document.querySelectorAll('#features input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', updateQuote);
});

// Initialize on load
updateQuote();

// PDF Generation and Download
document.getElementById('downloadQuote').addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Get selected website type text
  const typeSelect = document.getElementById('type');
  const typeText = typeSelect.options[typeSelect.selectedIndex].text;

  // Calculate base price
  let price = 0;
  switch(typeSelect.value) {
    case 'basic': price = 2099; break;
    case 'business': price = 3499; break;
    case 'ecommerce': price = 6999; break;
  }

  // Get checked features
  const features = document.querySelectorAll('#features input[type="checkbox"]:checked');
  let featuresList = [];
  let featuresCost = 0;
  features.forEach(feature => {
    featuresList.push(feature.parentElement.textContent.trim());
    switch(feature.value) {
      case 'seo': featuresCost += 500; break;
      case 'chat': featuresCost += 200; break;
      case 'blog': featuresCost += 400; break;
      case 'booking': featuresCost += 700; break;
    }
  });

  const totalCost = price + featuresCost;

  // Compose PDF content
  let y = 10;
  doc.setFontSize(18);
  doc.text('JayWebs Quote', 105, y, null, null, 'center');
  y += 10;
  doc.setFontSize(12);
  doc.text(`Website Type: ${typeText}`, 10, y);
  y += 10;

  if(featuresList.length > 0) {
    doc.text('Additional Features:', 10, y);
    y += 10;
    featuresList.forEach(f => {
      doc.text(`- ${f}`, 15, y);
      y += 8;
    });
  } else {
    doc.text('Additional Features: None', 10, y);
    y += 10;
  }

  doc.text(`Total Estimated Price: R${totalCost}`, 10, y);

  // Save the PDF
  doc.save('JayWebs_Quote.pdf');
});
