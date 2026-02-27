// Toggle visibility: show initial blocks (hero/products/stats) and hide sliders by default
document.addEventListener('DOMContentLoaded', () => {
  const sliderCatalog = document.querySelector('.slider__catalog');
  const sliderCompany = document.querySelector('.slider__company');
  const hero = document.getElementById('hero');
  const products = document.getElementById('products');
  const stats = document.getElementById('stats');
  const navLinks = document.querySelectorAll('.nav a');

  // hide sliders initially
  if (sliderCatalog) sliderCatalog.classList.add('hidden');
  if (sliderCompany) sliderCompany.classList.add('hidden');

  // Инициализация свайперов внутри переданных контейнеров
  function initSwipers(container) {
    if (!container) return null;
    const menuEl = container.querySelector('.menu-swiper');
    const contentEl = container.querySelector('.content-swiper');
    if (!menuEl || !contentEl) return null;

    const menu = new Swiper(menuEl, {
      direction: 'vertical',
      slidesPerView: 'auto',
      freeMode: true,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
    });

    const isCompany = container.classList && container.classList.contains('slider__company');
    const content = new Swiper(contentEl, {
      direction: 'horizontal',
      slidesPerView: 1,
      spaceBetween: isCompany ? 0 : 10,
      thumbs: {
        swiper: menu,
      },
    });

    return { menu, content };
  }

  // Инициализируем оба слайдера (каталог + компания), если они есть
  const catalogSwipers = initSwipers(sliderCatalog);
  const companySwipers = initSwipers(sliderCompany);

  // Yandex.Maps for company section
  let companyMap = null;
  function initCompanyMap() {
    if (companyMap) return;
    const mapEl = document.getElementById('company-map');
    if (!mapEl) return;

const createMap = () => {
  try {
    if (companyMap) return;
    
    companyMap = new ymaps.Map('company-map', {
      center: [55.1644, 61.4368],
      zoom: 14,
      controls: []
    });
    
    // Координаты станции "Металлургическая" (уточните точные координаты!)
    const stationCoords = [55.2329, 61.4350];
    
    // Простой маркер со стандартной иконкой станции
    const stationPlacemark = new ymaps.Placemark(
      stationCoords,
      {
        // Минимальный балун — только название станции
        balloonContent: 'станция Металлургическая'
      },
      {
        // Стандартная иконка станции от Яндекса (рекомендуется)
        preset: 'islands#blueRailwayIcon',
        // ИЛИ кастомная иконка поезда:
        // iconLayout: 'default#image',
        // iconImageHref: 'https://img.icons8.com/color/48/000000/subway-station.png',
        // iconImageSize: [32, 32],
        // iconImageOffset: [-16, -32],
        balloonPanelMaxMapArea: 0 // скрывает панель балуна
      }
    );
    
    companyMap.setCenter(stationCoords, 15); // чуть ближе к станции
    companyMap.geoObjects.removeAll();
    companyMap.geoObjects.add(stationPlacemark);
    
    // Не открываем балун автоматически — только при клике
    // stationPlacemark.balloon.open();
    
    console.log('YMaps: карта с маркером станции инициализирована');
  } catch (err) {
    console.warn('YMaps: ошибка инициализации карты', err);
  }
};

    // Poll for ymaps availability (max attempts)
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      attempts++;
      if (window.ymaps && typeof window.ymaps.ready === 'function') {
        clearInterval(interval);
        try { window.ymaps.ready(createMap); } catch (e) { createMap(); }
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn('YMaps: loader not available after retries');
      }
    }, 200);
  }

  // Инициализируем карту при переключении слайдов в секции "О компании"
  if (companySwipers && companySwipers.content) {
    companySwipers.content.on('slideChange', () => {
      if (companySwipers.content.activeIndex === 0) {
        initCompanyMap();
        setTimeout(() => {
          try { if (companyMap && companyMap.container && typeof companyMap.container.fitToViewport === 'function') companyMap.container.fitToViewport(); } catch (e) {}
        }, 200);
      }
    });
  }

  function showInitial() {
    if (sliderCatalog) sliderCatalog.classList.add('hidden');
    if (sliderCompany) sliderCompany.classList.add('hidden');
    if (hero) hero.classList.remove('hidden');
    if (products) products.classList.remove('hidden');
    if (stats) stats.classList.remove('hidden');
  }

  function showCatalog() {
    if (sliderCatalog) sliderCatalog.classList.remove('hidden');
    if (sliderCompany) sliderCompany.classList.add('hidden');
    if (hero) hero.classList.add('hidden');
    if (products) products.classList.add('hidden');
    if (stats) stats.classList.add('hidden');
  }

  function showCompany() {
    if (sliderCompany) sliderCompany.classList.remove('hidden');
    if (sliderCatalog) sliderCatalog.classList.add('hidden');
    if (hero) hero.classList.add('hidden');
    if (products) products.classList.add('hidden');
    if (stats) stats.classList.add('hidden');
    // При показе секции попробуем инициализировать карту, если активен первый слайд
    if (companySwipers && companySwipers.content && companySwipers.content.activeIndex === 0) {
      initCompanyMap();
      setTimeout(() => {
        try { if (companyMap && companyMap.container && typeof companyMap.container.fitToViewport === 'function') companyMap.container.fitToViewport(); } catch (e) {}
      }, 200);
    }
  }

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const text = (a.textContent || '').trim().toLowerCase();
      if (text === 'каталог') {
        e.preventDefault();
        showCatalog();
      } else if (text === 'о компании') {
        e.preventDefault();
        showCompany();
      } else {
        // для других ссылок — показываем начальные блоки
        showInitial();
      }
    });
  });

  // logo — кнопка "главная страница": скрываем все свайперы и показываем начальные блоки
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      showInitial();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});