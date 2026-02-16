import WaveSurfer from 'wavesurfer.js';

export const cards = document.querySelectorAll('.audio-card');

// Track all WaveSurfer instances and their play buttons
const waveInstances = [];

cards.forEach((card) => {
  const audio = card.querySelector('audio');
  const waveContainer = card.querySelector('.audio-wave');
  const playBtn = card.querySelector('.audio-play-btn');
  const currentTime = card.querySelector('.audio-current-time');
  const totalTime = card.querySelector('.audio-duration');

  const wavesurfer = WaveSurfer.create({
    container: waveContainer,
    waveColor: '#555',
    progressColor: 'white',
    cursorColor: 'transparent',
    barWidth: 2,
    barRadius: 40,
    barGap: 2,
    height: 45,
    responsive: true,
  });

  wavesurfer.load(audio.src);
  waveInstances.push({ wavesurfer, playBtn });

  // Format time
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  wavesurfer.on('ready', () => {
    totalTime.textContent = formatTime(wavesurfer.getDuration());
  });

  wavesurfer.on('audioprocess', () => {
    currentTime.textContent = formatTime(wavesurfer.getCurrentTime());
  });

  playBtn.addEventListener('click', () => {
    // Pause all other audios and update their icons
    waveInstances.forEach((obj) => {
      if (obj.wavesurfer !== wavesurfer && obj.wavesurfer.isPlaying()) {
        obj.wavesurfer.pause();
        if (obj.playBtn && obj.playBtn.firstElementChild) {
          obj.playBtn.firstElementChild.textContent = 'play_circle';
        }
        // Remove playing class from other cards
        if (obj.playBtn.closest('.audio-card')) {
          obj.playBtn.closest('.audio-card').classList.remove('is-playing');
        }
      }
    });
    wavesurfer.playPause();

    if (wavesurfer.isPlaying()) {
      playBtn.firstElementChild.textContent = 'pause_circle';
      card.classList.add('is-playing');
    } else {
      playBtn.firstElementChild.textContent = 'play_circle';
      card.classList.remove('is-playing');
    }
  });

  wavesurfer.on('finish', () => {
    playBtn.firstElementChild.textContent = 'play_circle';
    card.classList.remove('is-playing');
  });
});
