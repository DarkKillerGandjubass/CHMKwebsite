const menuSwiper = new Swiper('.menu-swiper', {
  direction: 'vertical',
  slidesPerView: 'auto',
  freeMode: true,
  watchSlidesProgress: true,
  slideToClickedSlide: true, // Позволяет переключать слайды при клике
});

const contentSwiper = new Swiper('.content-swiper', {
  direction: 'horizontal',
  slidesPerView: 1,
  spaceBetween: 10,
  thumbs: {
    swiper: menuSwiper,
  },
});

// Toggle visibility: show initial blocks (hero/products/stats) and hide slider by default
document.addEventListener('DOMContentLoaded', () => {
  const sliderSection = document.querySelector('.slider__catalog');
  const hero = document.getElementById('hero');
  const products = document.getElementById('products');
  const stats = document.getElementById('stats');
  const navLinks = document.querySelectorAll('.nav a');

  // hide slider initially
  if (sliderSection) sliderSection.classList.add('hidden');

  function showInitial() {
    if (sliderSection) sliderSection.classList.add('hidden');
    if (hero) hero.classList.remove('hidden');
    if (products) products.classList.remove('hidden');
    if (stats) stats.classList.remove('hidden');
  }

  function showSlider() {
    if (sliderSection) sliderSection.classList.remove('hidden');
    if (hero) hero.classList.add('hidden');
    if (products) products.classList.add('hidden');
    if (stats) stats.classList.add('hidden');
  }

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const text = (a.textContent || '').trim().toLowerCase();
      if (text === 'каталог') {
        e.preventDefault();
        showSlider();
      } else {
        // allow normal navigation for other links but also show initial blocks
        showInitial();
      }
    });
  });

  // logo — кнопка "главная страница": скрываем свайпер и показываем начальные блоки
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      showInitial();
      // прокрутить наверх для наглядности
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});