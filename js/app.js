/**
 * Vibe Coding Tutorial - 主应用逻辑
 * 功能：滚动动画、导航增强、交互效果
 * 注：幻灯片导航逻辑在 slides.js 中
 */

// ===== DOM 元素 =====
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// ===== 滚动显示动画 =====
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -50px 0px',
  threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===== 移动端菜单切换 =====
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    const expanded = menuToggle.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', String(expanded));
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ===== 代码块双击复制 =====
document.querySelectorAll('.code-block').forEach(block => {
  block.addEventListener('dblclick', () => {
    const code = block.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.textContent)
        .then(() => {
          const originalBg = block.style.borderColor;
          block.style.borderColor = 'rgba(99, 102, 241, 0.5)';
          setTimeout(() => { block.style.borderColor = originalBg; }, 1000);
        })
        .catch(() => {});
    }
  });
});

// ===== 卡片悬停光效 =====
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

// ===== 页面加载动画 =====
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  setTimeout(() => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.style.opacity = '1';
  }, 100);
});

// ===== 键盘导航 =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuToggle && navLinks) {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// ===== 触摸设备优化 =====
if ('ontouchstart' in window) {
  document.body.classList.add('touch-device');
}

// ===== 控制台输出 =====
console.log(
  '%c⚡ Vibe Coding 速通教程%c\n5 分钟理解总体，10 分钟深入细节。',
  'color: #6366f1; font-size: 20px; font-weight: bold;',
  'color: #a0a0b0; font-size: 13px;'
);