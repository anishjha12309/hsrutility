/**
 * Motion layer: Lenis smooth scroll + GSAP ScrollTrigger reveals.
 *
 * Three rules shape this file:
 *
 *  1. It is entirely optional. Nothing here is required to see or use the site —
 *     `.motion-ok` (set by the inline head script) is what puts elements into their
 *     hidden start state, and it is only set when JS runs AND the visitor has not
 *     asked for reduced motion. If this module never loads, the page is simply
 *     already in its final state.
 *
 *  2. It is off the critical path. Both libraries are dynamically imported, so they
 *     land in a separate chunk that never blocks first paint or the LCP.
 *
 *  3. Lenis is desktop-pointer only. Touch platforms keep native scrolling —
 *     hijacking momentum scroll on a phone is worse than doing nothing.
 */

type Lenis = import('lenis').default;

let lenis: Lenis | null = null;
let gsapRef: typeof import('gsap').gsap | null = null;
let ScrollTriggerRef: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;

const motionOk = () => document.documentElement.classList.contains('motion-ok');

/** Lenis on desktop pointer devices; native scroll on touch (brief). */
const wantsLenis = () =>
  window.matchMedia('(pointer: fine)').matches && window.matchMedia('(min-width: 860px)').matches;

async function startLenis() {
  if (lenis || !wantsLenis()) return;

  const { default: LenisCtor } = await import('lenis');

  lenis = new LenisCtor({
    // Close to native. The brief is explicit: smoothing, not scroll-jacking.
    duration: 0.9,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
    smoothWheel: true,
  });

  // Drive Lenis from GSAP's ticker rather than its own rAF, so scroll position and
  // ScrollTrigger are read in the same frame — otherwise pinned/parallax elements
  // lag the scroll by one frame and visibly judder.
  if (gsapRef) {
    gsapRef.ticker.add(lenisTick);
    gsapRef.ticker.lagSmoothing(0);
  } else {
    requestAnimationFrame(function raf(time) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    });
  }

  lenis.on('scroll', () => ScrollTriggerRef?.update());
}

function lenisTick(time: number) {
  // GSAP's ticker reports seconds; Lenis expects milliseconds.
  lenis?.raf(time * 1000);
}

/** Anchor links ease through Lenis instead of jumping. */
function wireAnchors(signal: AbortSignal) {
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;

      event.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, { offset: -96 });
      } else {
        // Native path (touch, or reduced motion) — still respect the fixed navbar.
        const top = target.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top, behavior: motionOk() ? 'smooth' : 'auto' });
      }

      // Moving focus is what makes an in-page jump work for keyboard and screen
      // reader users; scrolling alone leaves the focus ring behind.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.pushState(null, '', id);
    },
    { signal }
  );
}

/*
 * There is deliberately no hero animation here.
 *
 * The hero is the LCP region, so its entrance is pure CSS keyframes (see the
 * "Hero entrance" block in global.css) and begins on the first painted frame.
 * Routing it through GSAP put a 46kB network dependency in front of the largest
 * element on the page and cost ~2.6s of LCP render delay on throttled mobile.
 */

/** Sections fade and rise once as they enter. */
function scrollReveals(
  gsap: typeof import('gsap').gsap,
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
) {
  /*
   * ScrollTrigger.batch, not a trigger per element.
   *
   * The home page has ~30 .reveal elements. One tween-with-scrollTrigger each means
   * ~30 independent triggers, each measuring its own element on every refresh —
   * which showed up as 700ms of Style & Layout on throttled mobile. batch() shares
   * one observer across the set and hands back groups, so elements that enter
   * together also animate together (a better stagger, incidentally).
   */
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power2.out',
        overwrite: true,
      }),
  });

  ScrollTrigger.batch('.reveal-fade:not([data-hero] *)', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out', overwrite: true }),
  });

  // Media cards drift a few percent against the scroll. A few — not a carnival.
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: 4 },
      {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      }
    );
  });

  // App icons breathe.
  gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el, i) => {
    gsap.to(el, {
      y: -9,
      duration: 2.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.35,
    });
  });

  // No ScrollTrigger.refresh() here on purpose: ScrollTrigger already refreshes on
  // load and on resize, and calling it immediately after creating every trigger
  // forces a second full re-measure of the page for no benefit.
}

let pageController: AbortController | null = null;

async function setupPage() {
  if (!motionOk()) return;

  pageController?.abort();
  pageController = new AbortController();
  const { signal } = pageController;

  if (!gsapRef || !ScrollTriggerRef) {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);
    gsapRef = gsap;
    ScrollTriggerRef = ScrollTrigger;
  }

  await startLenis();

  scrollReveals(gsapRef, ScrollTriggerRef);
  wireAnchors(signal);
}

export function initMotion() {
  // Reduced motion / JS-disabled: `.motion-ok` is absent, everything is already in
  // its final position, and neither library is ever fetched.
  if (!motionOk()) return;

  // The mobile sheet locks the page; Lenis has to be told, or it keeps scrolling
  // the body underneath the overlay.
  document.addEventListener('hsr:scroll-lock', () => lenis?.stop());
  document.addEventListener('hsr:scroll-unlock', () => lenis?.start());

  document.addEventListener('astro:before-swap', () => {
    ScrollTriggerRef?.getAll().forEach((trigger) => trigger.kill());
    gsapRef?.globalTimeline.clear();
  });

  document.addEventListener('astro:after-swap', () => {
    lenis?.scrollTo(0, { immediate: true });
    void setupPage();
  });

  void setupPage();
}
