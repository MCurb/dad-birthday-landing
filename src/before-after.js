// Support multiple before-after sliders independently
export const containers = document.querySelectorAll('.comparison-slider');

containers.forEach((container) => {
  const range = container.querySelector('input.slider-range');
  if (!range) return;
  range.addEventListener('input', (e) => {
    container.style.setProperty('--position', `${e.target.value}%`);
  });
  // Initialize position on load
  container.style.setProperty('--position', `${range.value}%`);
});
