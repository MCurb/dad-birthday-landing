const items = document.querySelectorAll('.timeline-item');

export const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target.querySelector('video');

      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        if (video) {
          video.pause();
        }
      }
    });
  },
  {
    threshold: 0.2,
  },
);

items.forEach((item) => observer.observe(item));

const videos = document.querySelectorAll('.timeline-video');

videos.forEach((video) => {
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
});
