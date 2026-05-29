document.addEventListener('DOMContentLoaded', () => {

  // Nav scroll effect
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
    if (window.scrollY > 50) nav.classList.add('scrolled');
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Intersection Observer for fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });

  // Counter animation for stats
  const counters = document.querySelectorAll('.count-up');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(current) {
          const elapsed = current - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // Active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) link.classList.add('active');
  });

  // Dashboard slider
  const slider = document.getElementById('dashSlider');
  if (slider) {
    const slides = slider.querySelectorAll('.dash-slide');
    const dotsContainer = slider.querySelector('.dash-dots');
    let current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dash-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      slides[current].classList.remove('active');
      dotsContainer.children[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dotsContainer.children[current].classList.add('active');
    }

    setInterval(() => goTo((current + 1) % slides.length), 4000);
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.dash-img, .eco-preview, .lb-trigger').forEach(img => {
    img.addEventListener('click', function() {
      lightboxImg.src = this.src;
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
  });

});
