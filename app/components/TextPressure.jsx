// TextPressure by David Haz / React Bits. See TechText.LICENSE.md.
// Original study: https://codepen.io/JuanFuentes/full/rgXKGQ
'use client';

import { useEffect, useRef } from 'react';
import './TextPressure.css';

const RIPPLE_LIFE = 1.3;
const MAX_RIPPLES = 6;
const WAVE_PERIOD = 3.2;
const PULSE_PERIOD = 2.8;
const PULSE_DEPTH = 1;
const clamp01 = value => Math.min(1, Math.max(0, value));
const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

const getIdlePressure = (mode, position, clock, spread) => {
  if (mode === 'wave') {
    const crest = 0.5 + 0.5 * Math.cos(Math.PI * 2 * (position / spread - clock / WAVE_PERIOD));
    return crest * crest;
  }
  if (mode === 'pulse') {
    const lag = Math.abs(position - 0.5) * 0.4;
    const breath = 0.5 - 0.5 * Math.cos(Math.PI * 2 * (clock / PULSE_PERIOD - lag));
    return PULSE_DEPTH * breath * breath * (3 - 2 * breath);
  }
  return 0;
};

const getRipplePressure = (ripples, point, now, span) => {
  const band = Math.max(span * 0.14, 32);
  let total = 0;
  for (const ripple of ripples) {
    const age = (now - ripple.start) / 1000;
    if (age <= 0 || age >= RIPPLE_LIFE) continue;
    const offset = (distance(ripple, point) - age * span * 1.25) / band;
    if (offset <= -1 || offset >= 1) continue;
    const fade = 1 - age / RIPPLE_LIFE;
    const swell = (1 - offset * offset) ** 2 * fade * fade * Math.min(1, age / 0.06);
    total = 1 - (1 - total) * (1 - swell);
  }
  return total;
};

const TextPressure = ({
  text = 'Selected Works',
  fontFamily = 'Montserrat',
  width = true,
  weight = true,
  minWeight = 100,
  maxWeight = 900,
  idleMaxWeight = maxWeight,
  peakHold = 0,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  radius = 0.5,
  smoothing = 0.5,
  idle = 'none',
  idleSpeed = 1,
  clickRipple = true,
  textColor = 'currentColor',
  pressureColor = '',
  strokeColor = '#ff0000',
  strokeWidth = 3,
  className = '',
  minFontSize = 24,
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const chars = Array.from(text);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    if (!container || !title) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cursor = { x: 0, y: 0, seen: false };
    const mouse = { x: 0, y: 0 };
    const ripples = [];
    const applied = [];
    const peaks = [];
    let visible = false;
    let live = true;
    let rafId = 0;
    let last = 0;
    let clock = 0;
    let engage = idle === 'none' ? 1 : 0;

    const paintStatic = () => {
      spansRef.current.forEach(span => {
        if (!span) return;
        span.style.fontVariationSettings = "'wght' 700";
        span.style.opacity = '1';
        span.style.transform = '';
        span.style.color = '';
      });
      applied.length = 0;
    };

    const tick = now => {
      rafId = 0;
      if (!visible || document.hidden || motionQuery.matches) {
        last = 0;
        return;
      }
      const elapsed = last ? Math.min(now - last, 64) : 1000 / 60;
      last = now;
      const lag = 1000 * smoothing * smoothing;
      const follow = lag > 1 ? 1 - Math.exp(-elapsed / lag) : 1;
      mouse.x += (cursor.x - mouse.x) * follow;
      mouse.y += (cursor.y - mouse.y) * follow;

      const box = container.getBoundingClientRect();
      const inside = cursor.x >= box.left && cursor.x <= box.right && cursor.y >= box.top && cursor.y <= box.bottom;
      const idleMode = idle === 'wave' || idle === 'pulse' ? idle : 'none';
      const present = cursor.seen && inside ? 1 : 0;
      engage += (present - engage) * (1 - Math.exp(-elapsed / 320));
      if (Math.abs(present - engage) < 0.002) engage = present;
      const idling = idleMode !== 'none' && engage < 1;
      if (idling) clock += (elapsed / 1000) * idleSpeed;
      while (ripples.length && now - ripples[0].start > RIPPLE_LIFE * 1000) ripples.shift();

      const titleRect = title.getBoundingClientRect();
      const maxDist = Math.max(titleRect.width * radius, 1);
      const spread = Math.max(radius * 2, 0.2);
      // Batch geometry reads before style writes to avoid per-letter layout thrashing.
      const centers = spansRef.current.map(span => {
        if (!span) return null;
        const rect = span.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });

      spansRef.current.forEach((span, i) => {
        const center = centers[i];
        if (!span || !center) return;
        let pressure = cursor.seen ? clamp01(1 - distance(mouse, center) / maxDist) : 0;
        if (idling) {
          const position = (center.x - titleRect.left) / Math.max(titleRect.width, 1);
          const resting = getIdlePressure(idleMode, position, clock, spread);
          pressure = resting + (pressure - resting) * engage;
        }
        if (ripples.length) {
          const swell = getRipplePressure(ripples, center, now, titleRect.width);
          pressure = 1 - (1 - pressure) * (1 - swell);
        }

        // Latch each letter at its maximum once per peak, then ease back to the
        // live pressure. Re-arm after the underlying pulse has receded.
        if (weight && peakHold > 0) {
          const peak = peaks[i] ?? (peaks[i] = { until: 0, armed: true, releasing: false });
          if (pressure >= 0.995 && peak.armed) {
            peak.until = now + peakHold;
            peak.armed = false;
            peak.releasing = true;
          }
          if (now < peak.until) {
            pressure = 1;
          } else {
            if (pressure < 0.9) peak.armed = true;
            if (peak.releasing) {
              const release = clamp01((now - peak.until) / 320);
              const ease = release * release * (3 - 2 * release);
              pressure = 1 + (pressure - 1) * ease;
              if (release === 1) peak.releasing = false;
            }
          }
        }

        const wdth = width ? Math.floor(5 + 200 * pressure) : 100;
        const peakWeight = idleMode === 'none' ? maxWeight : idleMaxWeight + (maxWeight - idleMaxWeight) * engage;
        const wght = weight ? Math.round(minWeight + (peakWeight - minWeight) * pressure) : 700;
        const alphaPressure = weight ? clamp01((wght - minWeight) / Math.max(1, peakWeight - minWeight)) : pressure;
        const opacity = alpha ? alphaPressure.toFixed(3) : '';
        // Montserrat's local font has a weight axis only. Shear supplies the
        // requested italic motion while keeping the established typeface.
        const transform = italic ? `skewX(${(-12 * pressure).toFixed(2)}deg)` : '';
        const tint = Math.round((1 - (1 - pressure) * (1 - pressure)) * 100);
        const color = pressureColor ? `color-mix(in oklab, ${pressureColor} ${tint}%, ${textColor})` : '';
        const settings = `'wght' ${wght}, 'wdth' ${wdth}`;
        const key = `${settings}|${opacity}|${transform}|${color}`;
        if (applied[i] === key) return;
        span.style.fontVariationSettings = settings;
        span.style.opacity = opacity;
        span.style.transform = transform;
        span.style.color = color;
        applied[i] = key;
      });

      const moving = Math.abs(cursor.x - mouse.x) > 0.1 || Math.abs(cursor.y - mouse.y) > 0.1;
      const holdingPeak = peaks.some(peak => now < peak.until || peak.releasing);
      if (moving || idling || engage !== present || ripples.length > 0 || holdingPeak) rafId = requestAnimationFrame(tick);
      else last = 0;
    };

    const wake = () => {
      if (live && visible && !document.hidden && !motionQuery.matches && !rafId) rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      last = 0;
    };
    const track = event => {
      if (motionQuery.matches || !visible) return;
      cursor.x = event.clientX;
      cursor.y = event.clientY;
      if (!cursor.seen) {
        mouse.x = cursor.x;
        mouse.y = cursor.y;
      }
      cursor.seen = true;
      wake();
    };
    const leave = () => {
      cursor.seen = false;
      wake();
    };
    const release = event => {
      if (event.pointerType !== 'mouse') leave();
    };
    const press = event => {
      track(event);
      if (!clickRipple || motionQuery.matches) return;
      ripples.push({ x: event.clientX, y: event.clientY, start: performance.now() });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
      wake();
    };
    const visibility = () => {
      if (document.hidden) {
        cursor.seen = false;
        stop();
      } else wake();
    };
    const motionChange = () => {
      stop();
      ripples.length = 0;
      peaks.length = 0;
      cursor.seen = false;
      paintStatic();
      wake();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else stop();
    });
    const resizeObserver = new ResizeObserver(wake);
    observer.observe(container);
    resizeObserver.observe(container);
    window.addEventListener('pointermove', track, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', leave, { passive: true });
    window.addEventListener('scroll', wake, { passive: true, capture: true });
    window.addEventListener('blur', leave);
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    document.fonts?.addEventListener('loadingdone', wake);
    container.addEventListener('pointerdown', press);
    motionQuery.addEventListener('change', motionChange);
    if (motionQuery.matches) paintStatic();

    return () => {
      live = false;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', track);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', leave);
      window.removeEventListener('scroll', wake, { capture: true });
      window.removeEventListener('blur', leave);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
      document.fonts?.removeEventListener('loadingdone', wake);
      container.removeEventListener('pointerdown', press);
      motionQuery.removeEventListener('change', motionChange);
    };
  }, [text, fontFamily, width, weight, minWeight, maxWeight, idleMaxWeight, peakHold, italic, alpha, flex, radius, smoothing, idle, idleSpeed, clickRipple, textColor, pressureColor]);

  return (
    <div ref={containerRef} className="text-pressure" style={{ '--text-pressure-min-size': `${minFontSize}px` }}>
      <h2
        ref={titleRef}
        aria-label={text}
        className={`text-pressure-title${flex ? ' is-flex' : ''}${stroke ? ' is-stroke' : ''} ${className}`.trim()}
        style={{ fontFamily, color: textColor, '--text-pressure-stroke-width': `${strokeWidth}px`, '--text-pressure-stroke-color': strokeColor }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={el => { spansRef.current[i] = el; }}
            data-char={char}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </h2>
    </div>
  );
};

export default TextPressure;
