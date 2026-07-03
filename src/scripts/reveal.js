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
    const delay = (i % 4) * 70;
    el.classList.add('reveal-init');
    el.style.transitionDelay = `${delay}ms`;
    io.observe(el);
    // After the entrance finishes, drop all reveal styling so it can't
    // interfere with other transitions (e.g. .tilt-card) on the element.
    // transitionend bubbles from children, so match element + property.
    const onEnd = (e) => {
      if (e.target !== el || e.propertyName !== 'opacity') return;
      el.classList.remove('reveal-init', 'reveal-in');
      el.style.transitionDelay = '';
      el.removeEventListener('transitionend', onEnd);
    };
    el.addEventListener('transitionend', onEnd);
  });
}
