// FlowingMenu by David Haz / React Bits. See TechText.LICENSE.md.
// Adapted for non-navigating member rows with a carried marquee band.
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './FlowingMenu.css';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
/** @type {Array<{ text: string, marquee?: string, image?: string }>} */
const EMPTY_ITEMS = [];

export default function FlowingMenu({
  items = EMPTY_ITEMS, speed = 60, direction = 'left', followCursor = 0.4,
  duration = 0.5, stretch = 0.6, magnet = 0.25,
  bandInset = 0, bandRadius = 0,
  textColor = '#ffffff', bgColor = '#120F17',
  marqueeBgColor = '#ffffff', marqueeTextColor = '#120F17',
  borderColor = 'rgba(255,255,255,.14)',
  dividers = true, dimInactive = false, align = 'center',
  imageShape = 'pill', ariaLabel = 'Menu', className = '', style = {},
}) {
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const rowsRef = useRef([]);
  const measureTracks = useRef([]);
  const floatRef = useRef(null);
  const layersRef = useRef([]);
  const tracksRef = useRef([]);
  const controlsRef = useRef(null);
  const [copies, setCopies] = useState([]);
  const [slots, setSlots] = useState([-1, -1]);
  const [current, setCurrent] = useState(-1);
  const [imagesReady, setImagesReady] = useState(false);
  const settings = { speed: Math.max(0, speed), direction, followCursor: clamp(followCursor, 0, 1),
    duration: Math.max(0.1, duration), stretch: clamp(stretch, 0, 1), magnet: clamp(magnet, 0, 1),
    bandInset: Math.max(0, bandInset), bandRadius: Math.max(0, bandRadius) };
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
    controlsRef.current?.measure();
  });

  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const metrics = [];
    const marquees = items.map(() => ({ x: 0, part: 0, spin: 0, covered: false }));
    const band = { top: 0, bottom: 0, vTop: 0, vBottom: 0, toTop: 0, toBottom: 0, lead: 1, shown: false, index: -1, rest: 0, exitAt: 0 };
    const roll = { current: 0, p: 1, dir: 1, slots: [-1, -1], fromOpacity: 0, fromOffset: 0 };
    const cursor = { x: 0, y: null, clientY: null, t: 0, vx: 0 };
    let raf = 0;
    let last = 0;
    let visible = false;
    let live = true;
    let touch = null;

    const insetFor = height => Math.min(settingsRef.current.bandInset, Math.max(0, height / 2 - 2));
    const markRows = () => setCurrent(previous => previous === band.index ? previous : band.index);
    const paint = () => {
      const el = floatRef.current;
      if (!el) return;
      marquees.forEach(state => { state.covered = false; });
      if (!band.shown || band.bottom - band.top < 0.25) {
        delete el.dataset.visible;
        el.style.visibility = 'hidden';
        el.style.clipPath = 'inset(50% 0 50% 0)';
        layersRef.current.forEach(layer => {
          if (!layer) return;
          layer.style.visibility = 'hidden';
          layer.style.opacity = '0';
        });
        return;
      }
      const height = metrics[band.index]?.height ?? metrics[0]?.height ?? 0;
      const side = insetFor(height);
      const radius = Math.min(settingsRef.current.bandRadius, (band.bottom - band.top) / 2, Math.max(0, list.clientWidth / 2 - side));
      el.dataset.visible = '';
      el.style.visibility = 'visible';
      el.style.clipPath = `inset(${band.top.toFixed(2)}px ${side}px ${(list.clientHeight - band.bottom).toFixed(2)}px ${side}px round ${radius.toFixed(2)}px)`;
      const center = (band.top + band.bottom) / 2;
      const eased = 1 - (1 - roll.p) ** 3;
      const travel = height * 0.8 * roll.dir;
      [0, 1].forEach(slot => {
        const layer = layersRef.current[slot];
        const index = roll.slots[slot];
        if (!layer) return;
        const isCurrent = slot === roll.current;
        const shown = index >= 0 && (isCurrent || roll.p < 1);
        layer.style.visibility = shown ? 'visible' : 'hidden';
        if (!shown) return;
        const offset = isCurrent ? (1 - eased) * travel : roll.fromOffset - eased * travel;
        layer.style.height = `${height}px`;
        layer.style.opacity = (isCurrent ? eased : roll.fromOpacity * (1 - eased)).toFixed(3);
        layer.style.transform = `translate3d(0, ${(center - height / 2 + offset).toFixed(2)}px, 0)`;
        marquees[index].covered = true;
        const track = tracksRef.current[slot];
        if (track) track.style.transform = `translate3d(${marquees[index].x.toFixed(2)}px, 0, 0)`;
      });
    };

    const frame = now => {
      raf = 0;
      if (!live || !visible || document.hidden) return;
      if (band.shown && band.index < 0 && band.exitAt && now >= band.exitAt) { resetBand(); return; }
      const s = settingsRef.current;
      const reduced = motion.matches;
      const elapsed = clamp((now - last) / 1000, 0, 1 / 20);
      last = now;
      let busy = false;
      if (band.shown) {
        const m = band.index >= 0 ? metrics[band.index] : null;
        if (m) {
          const inset = insetFor(m.height);
          const lean = cursor.y === null || reduced ? 0 : clamp((cursor.y - (m.top + m.height / 2)) * s.magnet, -m.height * 0.3, m.height * 0.3);
          band.toTop = m.top + inset + lean;
          band.toBottom = m.top + m.height - inset + lean;
        } else band.toTop = band.toBottom = band.rest;
        const gap = (band.toTop + band.toBottom - band.top - band.bottom) / 2;
        if (Math.abs(gap) > 2) band.lead = gap > 0 ? 1 : -1;
        if (reduced) {
          band.top = band.toTop;
          band.bottom = band.toBottom;
          band.vTop = band.vBottom = 0;
        } else {
          const omega = Math.PI * 2 / s.duration;
          const fast = omega * (1 + 1.1 * s.stretch);
          const slow = omega * (1 - 0.4 * s.stretch);
          const zeta = 1 - 0.3 * s.stretch;
          const wTop = band.lead > 0 ? slow : fast;
          const wBottom = band.lead > 0 ? fast : slow;
          const steps = Math.max(1, Math.ceil(elapsed / (1 / 240)));
          const dt = elapsed / steps;
          for (let i = 0; i < steps; i++) {
            band.vTop += (-wTop * wTop * (band.top - band.toTop) - 2 * zeta * wTop * band.vTop) * dt;
            band.vBottom += (-wBottom * wBottom * (band.bottom - band.toBottom) - 2 * zeta * wBottom * band.vBottom) * dt;
            band.top += band.vTop * dt;
            band.bottom += band.vBottom * dt;
            if (band.bottom < band.top) {
              band.top = band.bottom = (band.top + band.bottom) / 2;
              band.vTop = band.vBottom = (band.vTop + band.vBottom) / 2;
            }
          }
        }
        const resting = Math.abs(band.top - band.toTop) < 0.1 && Math.abs(band.bottom - band.toBottom) < 0.1 && Math.abs(band.vTop) < 2 && Math.abs(band.vBottom) < 2;
        if (resting) {
          band.top = band.toTop;
          band.bottom = band.toBottom;
          band.vTop = band.vBottom = 0;
          if (band.index < 0 && band.bottom - band.top < 0.5) band.shown = false;
        } else busy = true;
      }
      if (roll.p < 1) {
        roll.p = reduced ? 1 : Math.min(1, roll.p + elapsed / (s.duration * 0.8));
        busy = !reduced;
      }
      cursor.vx *= Math.exp(-elapsed / 0.3);
      const push = clamp(cursor.vx * s.followCursor * 0.55, -1600, 1600);
      marquees.forEach((state, index) => {
        const goal = state.covered ? 1 : 0;
        state.spin = reduced ? goal : state.spin + (goal - state.spin) * (1 - Math.exp(-elapsed / 0.35));
        if (Math.abs(goal - state.spin) < 0.002) state.spin = goal;
        if ((!state.covered && state.spin === 0) || state.part <= 0 || reduced) return;
        busy = true;
        const flow = s.direction === 'alternate' ? (index % 2 ? 1 : -1) : s.direction === 'right' ? 1 : -1;
        state.x += (flow * s.speed + push) * state.spin * elapsed;
        state.x = (((state.x % state.part) + state.part) % state.part) - state.part;
      });
      paint();
      if (busy) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (raf || !live || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const resetBand = () => {
      stop();
      Object.assign(band, { top: 0, bottom: 0, toTop: 0, toBottom: 0, vTop: 0, vBottom: 0, shown: false, index: -1, rest: 0, exitAt: 0 });
      cursor.y = cursor.clientY = null;
      cursor.vx = 0;
      touch = null;
      roll.p = 1;
      marquees.forEach(state => { state.spin = 0; state.covered = false; });
      markRows();
      paint();
    };
    const goTo = (index, from = 'top') => {
      const m = metrics[index];
      if (!m) return;
      const inset = insetFor(m.height);
      const top = m.top + inset;
      const bottom = m.top + m.height - inset;
      const previous = roll.slots[roll.current];
      if (previous !== index) {
        if (!band.shown || previous < 0) { roll.slots[roll.current] = index; roll.p = 1; }
        else {
          const eased = 1 - (1 - roll.p) ** 3;
          roll.fromOpacity = eased;
          roll.fromOffset = (1 - eased) * m.height * 0.8 * roll.dir;
          roll.dir = index > previous ? 1 : -1;
          roll.current = 1 - roll.current;
          roll.slots[roll.current] = index;
          roll.p = 0;
        }
        setSlots([...roll.slots]);
      }
      if (!band.shown) {
        band.top = band.bottom = from === 'bottom' ? bottom : top;
        band.vTop = band.vBottom = 0;
        band.shown = true;
      }
      band.lead = (top + bottom - band.top - band.bottom) > 0 ? 1 : -1;
      band.toTop = top;
      band.toBottom = bottom;
      band.index = index;
      band.exitAt = 0;
      markRows();
      kick();
    };
    const release = toward => {
      if (!band.shown) return;
      band.rest = toward === 'top' ? band.toTop : toward === 'bottom' ? band.toBottom : (band.toTop + band.toBottom) / 2;
      band.toTop = band.toBottom = band.rest;
      band.index = -1;
      band.exitAt = performance.now() + settingsRef.current.duration * 1000;
      cursor.y = null;
      markRows();
      kick();
    };
    const measure = () => {
      const next = rowsRef.current.map((row, index) => {
        if (!row) return 3;
        metrics[index] = { top: row.offsetTop, height: row.offsetHeight };
        const width = measureTracks.current[index]?.firstElementChild?.getBoundingClientRect().width ?? 0;
        if (width > 0) {
          marquees[index].part = width;
          marquees[index].x = (((marquees[index].x % width) + width) % width) - width;
        }
        return width > 0 ? Math.max(2, Math.ceil(row.clientWidth / width) + 1) : 3;
      });
      const height = metrics[0]?.height ?? 0;
      root.style.setProperty('--flowing-menu-band', String(height ? (height - insetFor(height) * 2) / height : 1));
      setCopies(previous => previous.length === next.length && previous.every((n, i) => n === next[i]) ? previous : next);
      paint();
      kick();
    };
    const move = event => {
      if (event.pointerType === 'touch') return;
      const now = performance.now();
      const dt = (now - cursor.t) / 1000;
      if (dt > 0 && dt < 0.1) cursor.vx += ((event.clientX - cursor.x) / dt - cursor.vx) * (1 - Math.exp(-dt / 0.08));
      cursor.x = event.clientX;
      cursor.clientY = event.clientY;
      cursor.t = now;
      cursor.y = event.clientY - list.getBoundingClientRect().top;
      const index = metrics.findIndex(m => m && cursor.y >= m.top && cursor.y < m.top + m.height);
      if (index >= 0 && index !== band.index) goTo(index, cursor.y - metrics[index].top < metrics[index].height / 2 ? 'top' : 'bottom');
      else kick();
    };
    const leave = event => {
      if (event.pointerType === 'touch' || root.querySelector(':focus-visible')) return;
      cursor.x = event.clientX;
      cursor.clientY = event.clientY;
      const rect = list.getBoundingClientRect();
      release(event.clientY <= rect.top ? 'top' : event.clientY >= rect.bottom ? 'bottom' : 'center');
    };
    const syncPointer = () => {
      // Scrolling can move the menu away without delivering pointerleave.
      // Viewport hit-testing also accounts for the fixed navigation over it.
      if (!band.shown || cursor.clientY === null) return;
      const hit = document.elementFromPoint(cursor.x, cursor.clientY);
      if (!hit || !list.contains(hit)) { resetBand(); return; }
      cursor.y = cursor.clientY - list.getBoundingClientRect().top;
      const index = metrics.findIndex(m => m && cursor.y >= m.top && cursor.y < m.top + m.height);
      if (index < 0) resetBand();
      else if (index !== band.index) goTo(index, cursor.y - metrics[index].top < metrics[index].height / 2 ? 'top' : 'bottom');
      else kick();
    };
    const press = (event, index) => {
      if (event.pointerType !== 'touch') return;
      touch = { index, close: band.index === index };
      cursor.y = cursor.clientY = null;
      goTo(index);
    };
    const click = (event, index) => {
      if (touch?.index === index) {
        if (touch.close) release('center');
        touch = null;
      } else if (event.detail === 0) {
        if (band.index === index) release('center');
        else goTo(index);
      }
    };
    controlsRef.current = { measure, move, leave, press, click, focus: index => { cursor.y = cursor.clientY = null; goTo(index); }, blur: event => { if (!root.contains(event.relatedTarget)) release('bottom'); } };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { setImagesReady(true); measure(); }
      else resetBand();
    });
    const resize = new ResizeObserver(() => { measure(); syncPointer(); });
    observer.observe(root);
    resize.observe(root);
    measureTracks.current.forEach(track => { if (track?.firstElementChild) resize.observe(track.firstElementChild); });
    const visibility = () => { if (document.hidden) resetBand(); else kick(); };
    const fontReady = () => { if (live) measure(); };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('scroll', syncPointer, { passive: true, capture: true });
    window.addEventListener('blur', resetBand);
    document.fonts?.addEventListener('loadingdone', fontReady);
    document.fonts?.ready.then(fontReady);
    motion.addEventListener('change', kick);
    measure();
    return () => {
      live = false;
      stop();
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('scroll', syncPointer, { capture: true });
      window.removeEventListener('blur', resetBand);
      document.fonts?.removeEventListener('loadingdone', fontReady);
      motion.removeEventListener('change', kick);
      controlsRef.current = null;
    };
  }, [items]);

  useIsoLayoutEffect(() => { controlsRef.current?.measure(); }, [slots, imagesReady]);
  const part = (item, key) => (
    <div className="flowing-menu__part" key={key}>
      <span className="flowing-menu__part-text">{item.marquee ?? item.text}</span>
      {item.image && <span className="flowing-menu__image" style={{ backgroundImage: imagesReady ? `url("${item.image}")` : undefined }} />}
    </div>
  );
  return (
    <div ref={rootRef} className={`flowing-menu ${className}`.trim()} role="group" aria-label={ariaLabel}
      data-align={align} data-shape={imageShape}
      style={{ backgroundColor: bgColor, color: textColor, '--flowing-menu-border': borderColor, ...style }}>
      <ul ref={listRef} className="flowing-menu__list" onPointerMove={event => controlsRef.current?.move(event)} onPointerLeave={event => controlsRef.current?.leave(event)}>
        {items.map((item, index) => (
          <li key={item.text} ref={node => { rowsRef.current[index] = node; }} className="flowing-menu__item"
            data-current={current === index ? '' : undefined} data-dimmed={dimInactive && current >= 0 && current !== index ? '' : undefined}>
            {dividers && index > 0 && <span className="flowing-menu__divider" aria-hidden="true" />}
            <button type="button" className="flowing-menu__link" aria-label={`${item.text} — ${item.marquee ?? item.text}`} aria-pressed={current === index}
              onPointerDown={event => controlsRef.current?.press(event, index)}
              onFocus={event => { if (event.currentTarget.matches(':focus-visible')) controlsRef.current?.focus(index); }}
              onBlur={event => controlsRef.current?.blur(event)} onClick={event => controlsRef.current?.click(event, index)}>
              <span className="flowing-menu__label"><span className="flowing-menu__label-text">{item.text}</span></span>
            </button>
            <div className="flowing-menu__measure" aria-hidden="true"><div className="flowing-menu__track" ref={node => { measureTracks.current[index] = node; }}>{part(item, index)}</div></div>
          </li>
        ))}
      </ul>
      <div ref={floatRef} className="flowing-menu__float" aria-hidden="true" style={{ backgroundColor: marqueeBgColor, color: marqueeTextColor }}>
        {[0, 1].map(slot => {
          const item = slots[slot] >= 0 ? items[slots[slot]] : null;
          return <div key={slot} className="flowing-menu__float-layer" ref={node => { layersRef.current[slot] = node; }}>
            <div className="flowing-menu__track" ref={node => { tracksRef.current[slot] = node; }}>
              {item && Array.from({ length: copies[slots[slot]] ?? 3 }, (_, copy) => part(item, copy))}
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}
