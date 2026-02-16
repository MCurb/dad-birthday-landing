const audio = document.getElementById('audio');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('playBtn');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

export function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];

    ctx.fillStyle = 'lime';
    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  }
}

playBtn.addEventListener('click', async () => {
  await audioContext.resume();
  audio.play();
  draw();
});
