const EMOJIS = [
  '🇫🇷','🇬🇧','🇩🇪','🇮🇹','🇪🇸','🇺🇸','🇯🇵','🇧🇷','🇨🇦','🇦🇺','🇰🇷','🇨🇳','🇮🇳','🇷🇺','🇿🇦','🇲🇽',
  '🍕','🍔','🍟','🍦','🍩','🍪','🍫','🍬','🍭','🍰','🍧','🧁','🥑','🍆','🥕','🌽',
  '🌸','🌺','🌻','🌷','🌹','💐','🌺','🌺','🌻','🌷','🌹','💐','🎋','🎍','🎏','🎐',
  '🏀','⚽','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍',
  '🎨','🎭','🎪','🎬','🎤','🎧','🎼','🎹','🥁','🎷','🎺','🎸','🎻','🎲','🎯','🎳',
  '🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚜','🚁','🛸','🚀','⛵','🚤','🛥',
  '🏰','🗼','🗽','🗿','⛪','🕌','🕍','⛩','🕋','⛲','⛺','🌁','🌃','🏙','🌄','🌅',
  '🌈','☀️','🌙','⭐','🔥','💧','⚡','🌊','❄️','☁️','💨','🌪️','🌋','🗻','🏔'
];

const levels = { 4: 'Easy', 8: 'Medium', 12: 'Hard', 16: 'Expert', 20: 'Master' };

let currentSize = 8;
let targetSize = 4;
let currentPatternName = '';
let targetData = [];
let playerData = [];
let selectedPixel = null;
let currentLevelName = 'Easy';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DISTINCT_COLORS = [
  '#e63946', '#f1faee', '#a8dadc', '#457b9d',
  '#1d3557', '#2a9d8f', '#e9c46a', '#f4a261',
  '#e76f51', '#8ecae6', '#219ebc', '#ffb703',
  '#fb8500', '#6a4c93', '#1982c4', '#8ac926',
  '#ff0000', '#00ff00', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#ff8800', '#8800ff',
  '#ffffff', '#000000', '#ff8888', '#88ff88',
  '#8888ff', '#ffff88', '#ff88ff', '#88ffff'
];

function quantizeColor(r, g, b) {
  let closest = DISTINCT_COLORS[0];
  let minDist = Infinity;
  
  for (const color of DISTINCT_COLORS) {
    const cr = parseInt(color.slice(1, 3), 16);
    const cg = parseInt(color.slice(3, 5), 16);
    const cb = parseInt(color.slice(5, 7), 16);
    const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = color;
    }
  }
  return closest;
}

function pixelateEmoji(emoji, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, size, size);
  
  const fontSize = Math.floor(size * 0.85);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2);
  
  const imageData = ctx.getImageData(0, 0, size, size);
  const colors = [];
  
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    
    if (a > 50) {
      const q = quantizeColor(r, g, b);
      colors.push(q);
    } else {
      colors.push(null);
    }
  }
  
  return colors;
}

function generatePattern(size) {
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  currentPatternName = emoji;
  
  const colors = pixelateEmoji(emoji, size);
  
  const pattern = colors.map(c => c || '#1a1a2e');
  
  return pattern;
}

function initGame(size) {
  currentSize = size;
  targetSize = size;
  currentLevelName = levels[size];
  document.getElementById('currentLevel').textContent = currentLevelName;

  targetData = generatePattern(size);
  playerData = shuffleArray([...targetData]);

  document.getElementById('patternName').textContent = currentPatternName;

  renderGrid('targetGrid', targetData, false, size);
  renderGrid('playerGrid', playerData, true, size);
  updateProgress();
}

function renderGrid(containerId, data, isInteractive, gridSize) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${gridSize}, var(--pixel-size))`;

  data.forEach((color, index) => {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.style.backgroundColor = color;
    pixel.dataset.index = index;

    if (isInteractive) {
      pixel.addEventListener('click', () => handlePixelClick(index));
    }

    container.appendChild(pixel);
  });
}

function handlePixelClick(index) {
  const pixels = document.querySelectorAll('#playerGrid .pixel');

  if (selectedPixel === null) {
    selectedPixel = index;
    pixels[index].classList.add('selected');
  } else if (selectedPixel === index) {
    pixels[index].classList.remove('selected');
    selectedPixel = null;
  } else {
    [playerData[selectedPixel], playerData[index]] = [playerData[index], playerData[selectedPixel]];
    
    pixels[selectedPixel].classList.remove('selected');
    
    renderGrid('playerGrid', playerData, true, currentSize);
    updateProgress();
    
    selectedPixel = null;
  }
}

function updateProgress() {
  let correct = 0;
  for (let i = 0; i < targetData.length; i++) {
    if (playerData[i] === targetData[i]) {
      correct++;
    }
  }
  const percent = Math.round((correct / targetData.length) * 100);
  
  document.getElementById('progressText').textContent = `${percent}%`;
  document.getElementById('progressFill').style.width = `${percent}%`;

  if (percent === 100) {
    setTimeout(showWinModal, 300);
  }
}

function showWinModal() {
  const modal = document.getElementById('winModal');
  const message = document.getElementById('winMessage');
  const nextBtn = document.getElementById('nextLevelBtn');

  if (currentSize === 20) {
    message.textContent = '🏆 Tu es un Champion Pixel Cool ! 🏆';
    nextBtn.textContent = 'Recommencer';
  } else {
    message.textContent = `Tu as complété le niveau ${currentLevelName} !`;
    nextBtn.textContent = 'Continuer';
  }

  modal.classList.add('visible');
}

function hideWinModal() {
  document.getElementById('winModal').classList.remove('visible');
}

document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    hideWinModal();
    initGame(parseInt(btn.dataset.size));
  });
});

document.getElementById('nextLevelBtn').addEventListener('click', () => {
  hideWinModal();
  const sizeOrder = [4, 8, 12, 16, 20];
  const currentIndex = sizeOrder.indexOf(currentSize);
  
  if (currentIndex < sizeOrder.length - 1) {
    const nextSize = sizeOrder[currentIndex + 1];
    initGame(nextSize);
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.size) === nextSize);
    });
  } else {
    initGame(4);
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === '4');
    });
  }
});

initGame(4);