const slides = document.querySelectorAll('.slider__slide');
const images = Array.from(document.querySelectorAll('.slider__slide img'));
// Preload an image by src
function preloadImage(src) {
  if (!src) return;
  const img = new window.Image();
  img.src = src;
}

// Lazy-load offscreen images, preload next/prev
function updateImageLoading() {
  images.forEach((img, idx) => {
    // Only load current, next, prev eagerly
    if (
      idx === currentIndex ||
      idx === (currentIndex + 1) % images.length ||
      idx === (currentIndex - 1 + images.length) % images.length
    ) {
      img.loading = 'eager';
      if (!img.src)
        img.src = img.dataset.src || img.getAttribute('data-src') || img.src;
      preloadImage(img.src);
    } else {
      img.loading = 'lazy';
    }
  });
}
let currentIndex = 0;
let startX = 0;
let isDragging = false;
let dragOffset = 0;

export function updateSlider(offset = 0) {
  slides.forEach((slide, index) => {
    const slideOffset = index - currentIndex;
    // If dragging, add offset for real-time movement
    let dragX = offset ? offset : 0;
    let transform = `
      translate(-50%, -50%)
      translateX(${Math.round(slideOffset * 95 + dragX)}%)
      rotateY(${slideOffset * -5}deg)
      scale(${slideOffset === 0 ? 1 : 0.8})
    `;
    slide.style.transform = transform;
    slide.style.opacity = Math.abs(slideOffset) > 0 ? '0.8' : '1';
    slide.style.zIndex = slides.length - Math.abs(slideOffset);
  });
  updateImageLoading();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
}

/* ===== Touch & Mouse Events ===== */
const slider = document.querySelector('.slider');

// Initial image loading state
updateImageLoading();

// Touch events
slider.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
  dragOffset = 0;
});

slider.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const currentX = e.touches[0].clientX;
  dragOffset = ((currentX - startX) / slider.offsetWidth) * 100; // percent
  updateSlider(dragOffset);
});

slider.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  // Snap to next/prev if enough drag
  if (diff > slider.offsetWidth * 0.15) {
    nextSlide();
  } else if (diff < -slider.offsetWidth * 0.15) {
    prevSlide();
  } else {
    updateSlider(); // Snap back
  }
  isDragging = false;
  dragOffset = 0;
});

// Mouse events
slider.addEventListener('mousedown', (e) => {
  startX = e.clientX;
  isDragging = true;
  dragOffset = 0;
});

slider.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const currentX = e.clientX;
  dragOffset = ((currentX - startX) / slider.offsetWidth) * 100;
  updateSlider(dragOffset);
});

slider.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  const diff = startX - e.clientX;
  if (diff > slider.offsetWidth * 0.15) {
    nextSlide();
  } else if (diff < -slider.offsetWidth * 0.15) {
    prevSlide();
  } else {
    updateSlider();
  }
  isDragging = false;
  dragOffset = 0;
});

slider.addEventListener('mouseleave', () => {
  if (isDragging) {
    updateSlider();
    isDragging = false;
    dragOffset = 0;
  }
});
