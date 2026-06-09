/**
 * Vibe Coding Tutorial - 幻灯片导航
 * 功能：左右滑动切换、键盘导航、触摸支持
 * 使用 IIFE 避免与 app.js 全局变量冲突
 */
(function() {
  'use strict';

  // ===== DOM 元素 =====
  var container = document.getElementById('slidesContainer');
  var prevBtn = document.getElementById('slidePrev');
  var nextBtn = document.getElementById('slideNext');
  var indicatorsEl = document.getElementById('slideIndicators');
  var allSlides = document.querySelectorAll('.slide');
  var total = allSlides.length;

  if (!container || !prevBtn || !nextBtn || !indicatorsEl || total === 0) return;

  var current = 0;

  // ===== 创建页码指示器 =====
  function createIndicators() {
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'slide-indicator' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', '跳转到第 ' + (i + 1) + ' 页');
      (function(idx) {
        dot.addEventListener('click', function() { goTo(idx); });
      })(i);
      indicatorsEl.appendChild(dot);
    }
  }

  // ===== 更新指示器 =====
  function updateIndicators() {
    var dots = indicatorsEl.querySelectorAll('.slide-indicator');
    dots.forEach(function(dot, idx) {
      dot.classList.toggle('active', idx === current);
    });
  }

  // ===== 更新按钮状态 =====
  function updateButtons() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  // ===== 更新进度条 =====
  function updateProgress() {
    var fill = document.getElementById('progressFill');
    var bar = document.getElementById('progressBar');
    var pct = Math.round((current / (total - 1)) * 100);
    if (fill) fill.style.width = pct + '%';
    if (bar) bar.setAttribute('aria-valuenow', pct);
  }

  // ===== 跳转到指定幻灯片 =====
  function goTo(index) {
    if (index < 0 || index >= total) return;
    current = index;
    var w = container.clientWidth;
    container.scrollTo({ left: w * index, behavior: 'smooth' });
    updateIndicators();
    updateButtons();
    updateProgress();
  }

  // 暴露到全局供 HTML onclick 使用
  window.goToSlide = goTo;

  // ===== 上一页 / 下一页 =====
  function prev() { if (current > 0) goTo(current - 1); }
  function next() { if (current < total - 1) goTo(current + 1); }

  // ===== 按钮点击 =====
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // ===== 键盘导航 =====
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); prev();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault(); next();
    } else if (e.key === 'Home' && e.ctrlKey) {
      e.preventDefault(); goTo(0);
    } else if (e.key === 'End' && e.ctrlKey) {
      e.preventDefault(); goTo(total - 1);
    }
  });

  // ===== 触摸滑动 =====
  var touchX0 = 0;
  container.addEventListener('touchstart', function(e) {
    touchX0 = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', function(e) {
    var dx = touchX0 - e.changedTouches[0].screenX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) next(); else prev();
    }
  }, { passive: true });

  // ===== 滚动检测（用户拖动滚动条时同步状态） =====
  var scrollTimer;
  container.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      var w = container.clientWidth;
      var idx = Math.round(container.scrollLeft / w);
      if (idx !== current && idx >= 0 && idx < total) {
        current = idx;
        updateIndicators();
        updateButtons();
        updateProgress();
      }
    }, 100);
  });

  // ===== 导航栏滚动效果 =====
  var nav = document.getElementById('navbar');
  container.addEventListener('scroll', function() {
    if (nav) {
      if (container.scrollTop > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
  });

  // ===== 回到顶部 =====
  var topBtn = document.getElementById('backToTop');
  if (topBtn) {
    topBtn.addEventListener('click', function() {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== 初始化 =====
  createIndicators();
  updateButtons();
  updateProgress();

})();