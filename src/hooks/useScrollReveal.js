import { useEffect } from 'react';

/**
 * Observes all `[data-reveal]` descendants inside `containerRef` using a single
 * IntersectionObserver instance and marks them visible once on viewport entry.
 *
 * Elements stay visible by default in CSS unless `data-reveal-ready="true"` is
 * active on the container, preventing invisible content when JS fails or
 * `prefers-reduced-motion: reduce` is enabled.
 */
export function useScrollReveal(containerRef) {
  useEffect(() => {
    const root = containerRef?.current;
    if (!root) return undefined;

    const targets = Array.from(root.querySelectorAll('[data-reveal]'));
    if (targets.length === 0) return undefined;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.setAttribute('data-reveal-state', 'visible'));
      return undefined;
    }

    root.setAttribute('data-reveal-ready', 'true');

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-reveal-state', 'visible');
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    targets.forEach((el) => {
      if (el.getAttribute('data-reveal-state') !== 'visible') {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);
}

