document.addEventListener('DOMContentLoaded', () => {
  const postTitle = document.getElementById('post-title');
  const emoji = postTitle.dataset.emoji;

  if (emoji) {
    const color = getEmojiColor(emoji);
    applyTitleUnderline(postTitle, color);
  }
});

function getEmojiColor(emoji) {
  if (!emoji) return "#f0f0f0";
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 30;
  canvas.height = 30;
  ctx.font = "30px Arial";
  ctx.fillText(emoji, 0, 28);
  const imageData = ctx.getImageData(0, 0, 30, 30).data;

  let totalPixels = 0;
  const colors = { red: 0, green: 0, blue: 0 };

  for (let i = 0; i < imageData.length; i += 4) {
    const [r, g, b, a] = imageData.slice(i, i + 4);
    if (a > 50) {
      totalPixels += 1;
      colors.red += r;
      colors.green += g;
      colors.blue += b;
    }
  }

  if (totalPixels === 0) return "#f0f0f0";

  const r = Math.round(colors.red / totalPixels);
  const g = Math.round(colors.green / totalPixels);
  const b = Math.round(colors.blue / totalPixels);

  return `rgb(${r}, ${g}, ${b})`;
}

function applyGradientBackground(color) {
  const gradientUnderline = document.createElement('div');
  gradientUnderline.classList.add('gradient-underline');
  gradientUnderline.style.backgroundImage = `linear-gradient(to bottom, ${color}, transparent)`;
  document.body.insertBefore(gradientUnderline, document.body.firstChild);
}

function applyTitleUnderline(titleElement, color) {
  const gradientColor = `linear-gradient(to right, ${color}, transparent)`;
  titleElement.style.borderImage = gradientColor;
  titleElement.style.borderImageSlice = 1;
  titleElement.style.borderBottom = '2px solid';
  titleElement.style.paddingBottom = '0.2rem';
}

