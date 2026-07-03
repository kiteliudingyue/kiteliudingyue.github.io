// Scroll-into-view reveals. Progressive enhancement: elements are fully
// visible unless this script runs and reduced motion is off.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce && 'IntersectionObserver' in window) {
  const els = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  els.forEach((el, i) => {
    el.classList.add('reveal-init');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
}
