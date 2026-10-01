// Mobile nav toggle
const header = document.getElementById('header');
const burger = document.getElementById('burger');

function toggleMenu() {
  const isOpen = header.classList.toggle('nav-open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

burger.addEventListener('click', toggleMenu);

document.querySelectorAll('.nav__link').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    document.body.style.overflow = '';
  });
});

// FAQ accordion
document.querySelectorAll('.accordion__header').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const body = item.querySelector('.accordion__body');
    const isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.accordion__item').forEach((other) => {
      other.classList.remove('is-open');
      other.querySelector('.accordion__body').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('is-open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// Contact form -> opens Telegram with prefilled message
const contactForm = document.getElementById('contactForm');
if(contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const message = contactForm.message.value.trim();
    const text = encodeURIComponent(`Здравствуйте! Меня зовут ${name}.\n${message}`);
    window.open(`https://t.me/pasalidi_od?text=${text}`, '_blank', 'noopener');
  });
}

// Reviews carousel: manual (buttons/dots/drag) + autoplay
const track = document.getElementById('reviewsTrack');
const prevBtn = document.getElementById('reviewsPrev');
const nextBtn = document.getElementById('reviewsNext');
const dotsContainer = document.getElementById('reviewsDots');

if (track) {
  const cards = Array.from(track.children);
  let current = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 5000;

  const dots = cards.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
    dotsContainer.appendChild(dot);
    return dot;
  });

  function updateDots() {
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    
    // Исправлено: скроллим только внутри контейнера карусели, не дергая страницу
    track.scrollTo({
      left: cards[current].offsetLeft - track.offsetLeft,
      behavior: 'smooth'
    });
    
    updateDots();
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); restartAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); restartAutoplay(); });
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);
  track.addEventListener('touchstart', stopAutoplay, { passive: true });
  track.addEventListener('touchend', () => setTimeout(startAutoplay, 3000));

  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const cardWidth = cards[0].offsetWidth + 24;
      current = Math.round(track.scrollLeft / cardWidth);
      updateDots();
      restartAutoplay(); 
    }, 100);
  });

  updateDots();
  startAutoplay();
}