/**
 * スクロールアニメーション IntersectionObserver API
 */
document.addEventListener('DOMContentLoaded', () => {
  const fadeinItems = document.querySelectorAll('[data-fadein]');

  const fadeinObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const fadeinElement = entry.target;
      const delay = Number(fadeinElement.getAttribute('data-fadein')) || 0;

      // 遅延は inline-style で付与（CSSの transition-delay を上書き）
      // fadeinElement.style.transitionDelay = `${delay}ms`;
      fadeinElement.classList.add('is-show');

      // 一度表示したら監視解除（再アニメ不要なら）
      observer.unobserve(fadeinElement);
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // 少し早めに発火したいときは正の値に
  });

  fadeinItems.forEach(fadeinElement => fadeinObserver.observe(fadeinElement));
});