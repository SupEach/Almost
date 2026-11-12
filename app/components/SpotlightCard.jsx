// SpotlightCard by David Haz / React Bits. See TechText.LICENSE.md.
'use client';

import { useEffect, useRef } from 'react';
import './SpotlightCard.css';

const THEMES = {
  dark: { surface: '#111111', border: 'rgba(255,255,255,.08)', shadow: '0 24px 48px -24px rgba(0,0,0,.6)', light: '#ffffff', fill: 1, edge: 1 },
  light: { surface: '#ffffff', border: 'rgba(24,24,27,.1)', shadow: '0 1px 2px rgba(24,24,27,.04)', light: '#18181b', fill: 0.28, edge: 0.7 },
};
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const falloff = (color, softness) => {
  const soft = clamp(softness, 0, 1);
  const core = (1 - soft) ** 1.5 * 0.85;
  const stop = (alpha, at) => `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(2)}%, transparent) ${(at * 100).toFixed(2)}%`;
  const stops = [stop(1, 0)];
  for (let i = 0; i <= 14; i++) {
    const t = core + ((1 - core) * i) / 14;
    const g = (t - core) / (1 - core);
    const smooth = 1 - g * g * (3 - 2 * g);
    const glow = Math.exp(-4.6 * g * g) * (1 - g ** 6);
    stops.push(stop(smooth + (glow - smooth) * soft, t));
  }
  return stops.join(', ');
};

const SpotlightCard = ({
  children = null,
  as: Tag = 'div',
  overlay = false,
  className = '',
  style = {},
  spotlightColor,
  intensity = 0.15,
  spotlightSize = 240,
  softness = 0.7,
  shape = 'circle',
  borderGlow = 0.6,
  proximity = 80,
  smoothing = 0.3,
  ambient = false,
  flare = true,
  grain = 0,
  theme = 'dark',
  ...rest
}) => {
  const rootRef = useRef(null);
  const lightRef = useRef(null);
  const grainRef = useRef(null);
  const edgeRef = useRef(null);
  const wakeRef = useRef(null);
  const palette = THEMES[theme] ?? THEMES.dark;
  const color = spotlightColor ?? palette.light;
  const settings = {
    shape: shape === 'beam' ? 'beam' : 'circle',
    fill: falloff(color, softness), edge: falloff(color, 1),
    size: Math.max(20, spotlightSize),
    intensity: clamp(intensity, 0, 1) * palette.fill,
    borderGlow: clamp(borderGlow, 0, 1) * palette.edge,
    proximity: Math.max(0, proximity), smoothing: clamp(smoothing, 0, 1),
    ambient, flare, grain: clamp(grain, 0, 1),
  };
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
    wakeRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    const light = lightRef.current;
    const noise = grainRef.current;
    const edge = edgeRef.current;
    if (!root || !light || !noise || !edge) return;
    // An overlay borrows the existing preview button's pointer/focus events.
    // It contributes no surface, layout, hit target, or extra button of its own.
    const interaction = overlay ? root.closest('button') ?? root : root;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const state = { x: 0, y: 0, presence: 0, flare: 0, time: 0, pressed: false, visible: false };
    const pointer = { x: 0, y: 0, active: false };
    const drawn = { light: '', edge: '', noise: '' };
    let focus = null;
    let raf = 0;
    let last = 0;
    let alive = true;

    const gradient = (s, size, x, y, stops) => {
      if (s.shape === 'beam') {
        const reach = Math.max(size * 0.6, y + size * 0.55);
        return `radial-gradient(${(size * 0.55).toFixed(1)}px ${reach.toFixed(1)}px at ${x.toFixed(1)}px 0px, ${stops})`;
      }
      return `radial-gradient(circle ${size.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, ${stops})`;
    };
    const paint = s => {
      const size = s.size * (1 + 0.2 * state.flare);
      const boost = 1 + 0.7 * state.flare;
      const fill = gradient(s, size, state.x, state.y, s.fill);
      const rim = gradient(s, size * 0.6, state.x, s.shape === 'beam' ? 0 : state.y, s.edge);
      if (fill !== drawn.light) { drawn.light = fill; light.style.background = fill; }
      if (rim !== drawn.edge) { drawn.edge = rim; edge.style.background = rim; }
      light.style.opacity = String(Math.min(1, state.presence * s.intensity * boost));
      edge.style.opacity = String(Math.min(1, state.presence * s.borderGlow * boost));
      const mask = s.grain > 0 ? gradient(s, size, state.x, state.y, '#000 0%, transparent 100%') : 'none';
      if (mask !== drawn.noise) {
        drawn.noise = mask;
        noise.style.webkitMaskImage = mask;
        noise.style.maskImage = mask;
      }
      noise.style.opacity = String(state.presence * s.grain);
    };
    const tick = now => {
      raf = 0;
      if (!alive || !state.visible || document.hidden) return;
      const s = settingsRef.current;
      const reduce = motion.matches;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const rect = root.getBoundingClientRect();
      let tx = state.x;
      let ty = state.y;
      let target = 0;
      if (focus && interaction.contains(focus)) {
        const box = focus.getBoundingClientRect();
        tx = box.left + box.width / 2 - rect.left;
        ty = box.top + box.height / 2 - rect.top;
        target = 1;
      } else if (pointer.active) {
        tx = pointer.x - rect.left;
        ty = pointer.y - rect.top;
        const gap = Math.hypot(Math.max(0, -tx, tx - rect.width), Math.max(0, -ty, ty - rect.height));
        if (gap === 0) target = 1;
        else if (s.proximity > 0) target = Math.max(0, 1 - gap / s.proximity) ** 2;
      }
      if (target < 0.6 && s.ambient) {
        if (!reduce) state.time += dt;
        const drift = (0.6 - target) / 0.6;
        tx += (rect.width * (0.5 + 0.34 * Math.sin(state.time * 0.43)) - tx) * drift;
        ty += (rect.height * (0.5 + 0.3 * Math.sin(state.time * 0.61 + 1.3)) - ty) * drift;
        target = 0.6;
      }
      if (state.presence < 0.02 && target > 0 && !s.ambient) { state.x = tx; state.y = ty; }
      const follow = reduce || s.smoothing === 0 ? 1 : 1 - Math.exp(-dt / (0.015 + s.smoothing * 0.22));
      state.x += (tx - state.x) * follow;
      state.y += (ty - state.y) * follow;
      const fade = reduce ? 1 : 1 - Math.exp(-dt / (target > state.presence ? 0.1 : 0.32));
      state.presence += (target - state.presence) * fade;
      if (Math.abs(target - state.presence) < 0.002) state.presence = target;
      const press = state.pressed && s.flare && !reduce ? 1 : 0;
      state.flare += (press - state.flare) * (1 - Math.exp(-dt / (press ? 0.05 : 0.28)));
      if (Math.abs(press - state.flare) < 0.002) state.flare = press;
      paint(s);
      const moving = Math.abs(tx - state.x) > 0.1 || Math.abs(ty - state.y) > 0.1;
      const settled = !moving && state.presence === target && state.flare === press;
      if (!settled || (s.ambient && !reduce)) raf = requestAnimationFrame(tick);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const wake = () => {
      if (raf || !alive || !state.visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;
    const onMove = event => {
      if (!state.visible) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      if (state.presence > 0 || settingsRef.current.proximity > 0 || interaction.contains(event.target)) wake();
    };
    const onOut = event => {
      if (event.relatedTarget) return;
      pointer.active = false;
      wake();
    };
    const onDown = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      state.pressed = true;
      wake();
    };
    const onUp = event => {
      if (event.pointerType !== 'mouse') pointer.active = false;
      state.pressed = false;
      wake();
    };
    const onFocusIn = event => {
      if (!(event.target instanceof Element) || !event.target.matches(':focus-visible')) return;
      focus = event.target;
      wake();
    };
    const onFocusOut = event => {
      if (interaction.contains(event.relatedTarget)) return;
      focus = null;
      wake();
    };
    const onScroll = () => { if (pointer.active || state.presence > 0) wake(); };
    const onVisibility = () => {
      if (document.hidden) { state.pressed = false; pointer.active = false; stop(); }
      else wake();
    };
    const observer = new IntersectionObserver(entries => {
      state.visible = entries.some(entry => entry.isIntersecting);
      if (state.visible) wake();
      else stop();
    });
    const resizeObserver = new ResizeObserver(onScroll);
    observer.observe(root);
    resizeObserver.observe(root);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    document.addEventListener('pointerout', onOut);
    document.addEventListener('visibilitychange', onVisibility);
    interaction.addEventListener('pointerdown', onDown);
    interaction.addEventListener('focusin', onFocusIn);
    interaction.addEventListener('focusout', onFocusOut);
    motion.addEventListener('change', wake);

    return () => {
      alive = false;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('scroll', onScroll, { capture: true });
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('visibilitychange', onVisibility);
      interaction.removeEventListener('pointerdown', onDown);
      interaction.removeEventListener('focusin', onFocusIn);
      interaction.removeEventListener('focusout', onFocusOut);
      motion.removeEventListener('change', wake);
      wakeRef.current = null;
    };
  }, [overlay]);

  return (
    <Tag
      ref={rootRef}
      className={`spotlight-card${overlay ? ' spotlight-card--overlay' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--spotlight-card-surface': palette.surface, '--spotlight-card-border': palette.border, '--spotlight-card-shadow': palette.shadow, ...style }}
      {...rest}
    >
      <span ref={lightRef} className="spotlight-card__light" aria-hidden="true" />
      <span ref={grainRef} className="spotlight-card__grain" style={{ backgroundImage: NOISE }} aria-hidden="true" />
      {children}
      <span className="spotlight-card__border" aria-hidden="true" />
      <span ref={edgeRef} className="spotlight-card__edge" aria-hidden="true" />
    </Tag>
  );
};

export default SpotlightCard;
