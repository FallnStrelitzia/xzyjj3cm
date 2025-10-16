document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const currentPage = path.split("/").pop() || "index.html";

  if (typeof pageStickers === 'undefined' || !pageStickers[currentPage]) {
    return; // 如果没有定义或找不到当前页面的表情包，则不执行任何操作
  }

  const stickerUrl = pageStickers[currentPage];
  const stickerImg = document.createElement('img');
  stickerImg.src = stickerUrl;
  stickerImg.alt = 'Sticker';
  stickerImg.style.position = 'absolute'; // 使用绝对定位
  stickerImg.style.maxWidth = '120px';
  stickerImg.style.borderRadius = '8px';
  stickerImg.style.opacity = '0.8';
  stickerImg.style.transition = 'opacity 0.3s';
  stickerImg.onmouseover = () => stickerImg.style.opacity = '1';
  stickerImg.onmouseout = () => stickerImg.style.opacity = '0.8';

  // --- 页面专属定位逻辑 ---
  let targetContainer = null;

  switch (currentPage) {
    case 'index.html':
      targetContainer = document.querySelector('.quote-container');
      if (targetContainer) {
        targetContainer.style.position = 'relative'; // 确保父容器可以定位
        stickerImg.style.right = '-140px'; // 放在容器右侧
        stickerImg.style.top = '0';
      }
      break;
    
    case 'gallery.html':
      targetContainer = document.querySelector('.page-title');
      if (targetContainer) {
        targetContainer.style.position = 'relative';
        stickerImg.style.left = '-140px'; // 放在标题左侧
        stickerImg.style.top = '-20px';
      }
      break;

    case 'quiz.html':
      targetContainer = document.getElementById('quiz-container');
      if (targetContainer) {
        targetContainer.style.position = 'relative';
        stickerImg.style.right = '-20px';
        stickerImg.style.bottom = '-40px';
        stickerImg.style.transform = 'rotate(15deg)'; // 倾斜一点更有趣
      }
      break;

    case 'game.html':
      targetContainer = document.querySelector('.game-info');
      if (targetContainer) {
        targetContainer.style.position = 'relative';
        stickerImg.style.left = '-140px';
        stickerImg.style.bottom = '0';
      }
      break;

    case 'simulator.html':
      targetContainer = document.querySelector('.page-intro');
      if (targetContainer) {
        targetContainer.style.position = 'relative';
        stickerImg.style.right = '0';
        stickerImg.style.bottom = '-130px'; // 放在介绍文字下方
      }
      break;

    case 'whack.html':
      targetContainer = document.getElementById('whack-game-container');
      if (targetContainer) {
        targetContainer.style.position = 'relative';
        stickerImg.style.right = '10px';
        stickerImg.style.top = '-100px'; // 放在容器上方
      }
      break;

    case 'flappy.html':
      targetContainer = document.getElementById('flappy-game-container');
      if (targetContainer) {
        targetContainer.style.position = 'relative';
        stickerImg.style.right = '-140px';
        stickerImg.style.bottom = '20px';
      }
      break;

    case 'memory.html':
      targetContainer = document.querySelector('.game-info-bar');
      if (targetContainer) {
        targetContainer.style.position = 'relative';
        stickerImg.style.left = '-140px';
        stickerImg.style.top = '-20px';
      }
      break;

    case 'adventure.html':
      targetContainer = document.getElementById('story-text');
      if (targetContainer) {
        targetContainer.style.position = 'relative';
        stickerImg.style.left = '-100px';
        stickerImg.style.top = '-20px';
        stickerImg.style.transform = 'rotate(-15deg)';
      }
      break;

  }

  if (targetContainer) {
    targetContainer.appendChild(stickerImg);
  }
});