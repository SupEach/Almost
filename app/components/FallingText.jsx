// FallingText by David Haz / React Bits. See TechText.LICENSE.md.
// Inline text variant; the accessible mail link remains its parent.
'use client';

import { Fragment, useEffect, useMemo, useRef } from 'react';
import './FallingText.css';

const STEP = 1000 / 120;
const WALL = 400;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
let physicsModule;
const loadPhysics = () => physicsModule ??= import('matter-js').then(module => module.default ?? module);

export default function FallingText({
  text = '', highlightWords = /** @type {string[]} */ ([]), highlightClass = 'highlighted', trigger = 'auto',
  tokens = /** @type {string[] | null} */ (null), separator = ' ',
  split = 'words', gravity = 1, bounciness = 0.2, scatter = 0.5,
  stagger = 0.03, order = 'random', draggable = true,
  mouseConstraintStiffness = 0.2, cursorPush = 0.5, restoreDelay = 0,
  fontSize = '1rem', accentColor = '#5b8cff', backgroundColor = 'transparent',
  wireframes = false, className = '', style = {}, ...rest
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const settings = { gravity, bounciness, scatter, stagger, order, draggable, mouseConstraintStiffness, cursorPush, restoreDelay };
  const settingsRef = useRef(settings);
  useEffect(() => { settingsRef.current = settings; });
  const highlightKey = highlightWords.join('\0');
  const groups = useMemo(() => {
    const marks = highlightKey.split('\0').filter(Boolean);
    return (tokens ?? text.split(/\s+/)).filter(Boolean).map(word => ({
      word, highlightLength: Math.max(0, ...marks.filter(mark => word.startsWith(mark)).map(mark => mark.length)),
    }));
  }, [text, tokens, highlightKey]);

  useEffect(() => {
    const container = containerRef.current;
    const block = textRef.current;
    if (!container || !block) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let Matter;
    let engine = null;
    let pieces = [];
    let walls = [];
    let drag = null;
    let phase = 'idle';
    let raf = 0;
    let last = 0;
    let clock = 0;
    let accumulator = 0;
    let restoreTimer = 0;
    let inside = false;
    let visible = false;
    let disposed = false;
    let suppressClick = false;
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, time: 0 };
    const clearRestore = () => { window.clearTimeout(restoreTimer); restoreTimer = 0; };
    const local = event => {
      const box = container.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const settled = () => pieces.length > 0 && pieces.every(p => p.released && (p.body.isSleeping || (p.body.speed < 0.05 && p.body.angularSpeed < 0.01)));
    const queueRestore = () => {
      const delay = settingsRef.current.restoreDelay;
      if (delay > 0 && !restoreTimer && !inside && !drag && visible && !document.hidden && phase === 'falling') {
        restoreTimer = window.setTimeout(() => { restoreTimer = 0; restore(); }, delay * 1000);
      }
    };
    const reset = () => {
      clearRestore();
      cancelAnimationFrame(raf);
      raf = 0;
      phase = 'idle';
      if (drag && container.hasPointerCapture?.(drag.id)) container.releasePointerCapture(drag.id);
      if (engine) { Matter.Composite.clear(engine.world, false); Matter.Engine.clear(engine); }
      engine = null;
      pieces.forEach(piece => {
        piece.element.getAnimations().forEach(animation => animation.cancel());
        ['position', 'left', 'top', 'width', 'height', 'margin', 'transform'].forEach(key => { piece.element.style[key] = ''; });
      });
      pieces = [];
      walls = [];
      drag = null;
      suppressClick = false;
      block.style.minHeight = block.style.minWidth = '';
      delete container.dataset.phase;
      delete container.dataset.dragging;
    };
    const restore = () => {
      if (phase !== 'falling') return;
      if (motion.matches) { reset(); return; }
      phase = 'restoring';
      container.dataset.phase = phase;
      cancelAnimationFrame(raf);
      raf = 0;
      if (drag) { Matter.Composite.remove(engine.world, drag.constraint); drag = null; }
      const animations = [...pieces].sort((a, b) => a.body.position.y - b.body.position.y).map((piece, index) => {
        const angle = Math.atan2(Math.sin(piece.body.angle), Math.cos(piece.body.angle));
        const from = `translate3d(${piece.body.position.x - piece.w / 2}px, ${piece.body.position.y - piece.h / 2}px, 0) rotate(${angle}rad)`;
        const to = `translate3d(${piece.x0}px, ${piece.y0}px, 0) rotate(0rad)`;
        piece.element.style.transform = to;
        return piece.element.animate([{ transform: from }, { transform: to }], {
          duration: 760, delay: Math.min(index * 14, 360), easing: 'cubic-bezier(.34,1.4,.64,1)', fill: 'backwards',
        });
      });
      Promise.all(animations.map(animation => animation.finished.catch(() => null))).then(() => {
        if (!disposed && phase === 'restoring') reset();
      });
    };
    const release = piece => {
      piece.released = true;
      Matter.Body.setStatic(piece.body, false);
      Matter.Sleeping.set(piece.body, false);
      const kick = clamp(settingsRef.current.scatter, 0, 1) * (piece.knocked ? 0.65 : 1);
      const range = clamp(container.clientWidth * 0.03, 12, 42);
      const roomLeft = piece.x0;
      const roomRight = container.clientWidth - piece.x0 - piece.w;
      const bias = (roomRight - roomLeft) / Math.max(1, container.clientWidth) * 0.12;
      Matter.Body.setVelocity(piece.body, { x: (Math.random() - 0.5 + bias) * range * kick, y: -Math.random() * 3.5 * kick });
      Matter.Body.setAngularVelocity(piece.body, (Math.random() - 0.5) * 0.16 * kick);
    };
    const frame = now => {
      raf = 0;
      if (!engine || !visible || document.hidden || phase !== 'falling') return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      clock += dt;
      engine.gravity.y = clamp(settingsRef.current.gravity, -3, 4) * 1.4;
      pieces.forEach(piece => { if (!piece.released && (clock >= piece.at || piece.knocked)) release(piece); });
      accumulator += dt * 1000;
      while (accumulator >= STEP) { Matter.Engine.update(engine, STEP); accumulator -= STEP; }
      pieces.forEach(({ body, element, w, h }) => {
        element.style.transform = `translate3d(${(body.position.x - w / 2).toFixed(2)}px, ${(body.position.y - h / 2).toFixed(2)}px, 0) rotate(${body.angle.toFixed(4)}rad)`;
      });
      if (settled() && !drag) queueRestore();
      else raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      clearRestore();
      if (!raf && engine && phase === 'falling' && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const fall = async () => {
      if (phase !== 'idle' || motion.matches || !visible) return;
      phase = 'loading';
      try {
        Matter = await loadPhysics();
        await document.fonts.ready;
        if (disposed || phase !== 'loading' || motion.matches) return;
        if (!visible || document.hidden) { reset(); return; }
        const elements = [...block.querySelectorAll('[data-piece]')];
        const box = container.getBoundingClientRect();
        const rects = elements.map(element => {
          const r = element.getBoundingClientRect();
          return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
        });
        block.style.minHeight = `${block.offsetHeight}px`;
        block.style.minWidth = `${block.offsetWidth}px`;
        engine = Matter.Engine.create({ enableSleeping: true, positionIterations: 10, velocityIterations: 8 });
        engine.gravity.y = clamp(settingsRef.current.gravity, -3, 4) * 1.4;
        const width = container.clientWidth;
        const height = container.clientHeight;
        walls = [
          Matter.Bodies.rectangle(width / 2, height + WALL / 2, 10000, WALL, { isStatic: true, friction: 0.8 }),
          Matter.Bodies.rectangle(-WALL / 2, height / 2, WALL, 10000, { isStatic: true }),
          Matter.Bodies.rectangle(width + WALL / 2, height / 2, WALL, 10000, { isStatic: true }),
          Matter.Bodies.rectangle(width / 2, -WALL / 2, 10000, WALL, { isStatic: true }),
        ];
        const shuffled = rects.map((_, index) => ({ index, key: Math.random() })).sort((a, b) => a.key - b.key).map(entry => entry.index);
        const center = rects.reduce((sum, r) => sum + r.x + r.w / 2, 0) / Math.max(1, rects.length);
        const span = Math.max(1, ...rects.map(r => Math.abs(r.x + r.w / 2 - center)));
        pieces = elements.map((element, index) => {
          const r = rects[index];
          const body = Matter.Bodies.rectangle(r.x + r.w / 2, r.y + r.h / 2, Math.max(2, r.w - 1), Math.max(2, r.h - 1), {
            restitution: clamp(settingsRef.current.bounciness * (0.9 + Math.random() * 0.2), 0, 1), friction: 0.16 + Math.random() * 0.08, frictionStatic: 0.4, frictionAir: 0.008, density: 0.0015, slop: 0.02,
          });
          Matter.Body.setStatic(body, true);
          const rank = settingsRef.current.order === 'random' ? shuffled.indexOf(index) : settingsRef.current.order === 'center' ? Math.abs(r.x + r.w / 2 - center) / span * (rects.length - 1) : index;
          Object.assign(element.style, { position: 'absolute', left: '0', top: '0', width: `${r.w}px`, height: `${r.h}px`, margin: '0', transform: `translate3d(${r.x}px, ${r.y}px, 0)` });
          return { element, body, w: r.w, h: r.h, x0: r.x, y0: r.y, released: false, at: settingsRef.current.order === 'together' ? 0 : (rank + Math.random() * 0.8) * Math.max(0, settingsRef.current.stagger) };
        });
        Matter.Composite.add(engine.world, [...walls, ...pieces.map(p => p.body)]);
        const byBody = new Map(pieces.map(p => [p.body, p]));
        Matter.Events.on(engine, 'collisionStart', event => {
          for (const pair of event.pairs) {
            const a = byBody.get(pair.bodyA), b = byBody.get(pair.bodyB);
            if (!a || !b || a.released === b.released) continue;
            const [moving, still] = a.released ? [a, b] : [b, a];
            if ((still.body.position.y - moving.body.position.y) * (Math.sign(engine.gravity.y) || 1) > still.h * 0.25) still.knocked = true;
          }
        });
        clock = accumulator = 0;
        phase = 'falling';
        container.dataset.phase = phase;
        wake();
      } catch (error) {
        reset();
        console.error('FallingText physics failed to load', error);
      }
    };
    const enter = event => {
      if (event.pointerType === 'touch') return;
      inside = true;
      clearRestore();
      if (trigger === 'hover') void fall();
    };
    const leave = () => { inside = false; if (settled()) queueRestore(); };
    const click = event => {
      if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; return; }
      if (trigger === 'click') void fall();
    };
    const down = event => {
      if (!engine || phase !== 'falling' || !settingsRef.current.draggable || event.button !== 0) return;
      const point = local(event);
      const body = Matter.Query.point(pieces.filter(p => p.released).map(p => p.body), point)[0];
      if (!body) return;
      event.preventDefault();
      clearRestore();
      Matter.Sleeping.set(body, false);
      const constraint = Matter.Constraint.create({ pointA: point, bodyB: body, pointB: { x: point.x - body.position.x, y: point.y - body.position.y }, stiffness: clamp(settingsRef.current.mouseConstraintStiffness, 0.01, 1), damping: 0.08, length: 0 });
      Matter.Composite.add(engine.world, constraint);
      drag = { constraint, id: event.pointerId, start: point };
      container.setPointerCapture(event.pointerId);
      container.dataset.dragging = '';
      wake();
    };
    const move = event => {
      if (event.pointerType === 'touch' && !drag) return;
      const point = local(event);
      const now = performance.now();
      const dt = Math.max(1, now - pointer.time);
      if (pointer.time && dt < 120) {
        const blend = Math.min(1, dt / 40);
        pointer.vx += ((point.x - pointer.x) / dt - pointer.vx) * blend;
        pointer.vy += ((point.y - pointer.y) / dt - pointer.vy) * blend;
      } else pointer.vx = pointer.vy = 0;
      pointer.x = point.x; pointer.y = point.y; pointer.time = now;
      inside = true;
      clearRestore();
      if (phase === 'idle' && trigger === 'hover') void fall();
      if (phase !== 'falling') return;
      if (drag && event.pointerId === drag.id) {
        drag.constraint.pointA = point;
        if (Math.hypot(point.x - drag.start.x, point.y - drag.start.y) > 4) suppressClick = true;
        return;
      }
      const speed = Math.hypot(pointer.vx, pointer.vy);
      const push = clamp(settingsRef.current.cursorPush, 0, 2);
      if (!push || speed < 0.35) return;
      let touched = false;
      for (const piece of pieces) {
        if (!piece.released) continue;
        const body = piece.body;
        const reach = Math.max(piece.w, piece.h) / 2 + 18;
        const distance = Math.hypot(body.position.x - point.x, body.position.y - point.y);
        if (distance > reach || now - (piece.pushed || 0) < 60) continue;
        piece.pushed = now;
        const kick = Math.min(20, speed * push * (1 - (distance / reach) ** 2) * 16);
        Matter.Sleeping.set(body, false);
        Matter.Body.setVelocity(body, { x: body.velocity.x + pointer.vx / speed * kick, y: body.velocity.y + pointer.vy / speed * kick - kick * 0.7 });
        Matter.Body.setAngularVelocity(body, body.angularVelocity + (Math.random() - 0.5) * 0.06 * push);
        touched = true;
      }
      if (touched) wake();
    };
    const up = event => {
      if (!drag || event.pointerId !== drag.id) return;
      Matter.Composite.remove(engine.world, drag.constraint);
      drag = null;
      if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);
      delete container.dataset.dragging;
      window.setTimeout(() => { suppressClick = false; }, 0);
      wake();
    };
    const pause = () => { cancelAnimationFrame(raf); raf = 0; clearRestore(); };
    const observer = new IntersectionObserver(entries => {
      const entry = entries[entries.length - 1];
      visible = entry.isIntersecting;
      if (!visible) pause();
      else { if (trigger === 'auto' || trigger === 'scroll' || (trigger === 'hover' && inside)) void fall(); wake(); }
    });
    observer.observe(container);
    const resize = new ResizeObserver(() => { if (phase === 'falling' || phase === 'restoring') reset(); });
    resize.observe(container);
    const preference = () => { if (motion.matches) reset(); else if (trigger === 'hover' && inside) void fall(); };
    const visibility = () => { if (document.hidden) pause(); else wake(); };
    container.addEventListener('pointerenter', enter);
    container.addEventListener('pointerleave', leave);
    container.addEventListener('click', click, true);
    container.addEventListener('pointerdown', down);
    container.addEventListener('pointermove', move);
    container.addEventListener('pointerup', up);
    container.addEventListener('pointercancel', up);
    container.addEventListener('lostpointercapture', up);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', preference);
    return () => {
      disposed = true;
      observer.disconnect(); resize.disconnect(); reset();
      container.removeEventListener('pointerenter', enter);
      container.removeEventListener('pointerleave', leave);
      container.removeEventListener('click', click, true);
      container.removeEventListener('pointerdown', down);
      container.removeEventListener('pointermove', move);
      container.removeEventListener('pointerup', up);
      container.removeEventListener('pointercancel', up);
      container.removeEventListener('lostpointercapture', up);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', preference);
    };
  }, [groups, split, separator, fontSize, trigger]);

  const pieceClass = highlighted => `falling-text__piece${highlighted ? ` ${highlightClass}` : ''}`;
  return (
    <span ref={containerRef} className={`falling-text${wireframes ? ' falling-text--wireframes' : ''} ${className}`.trim()}
      data-trigger={trigger} data-draggable={draggable ? '' : undefined}
      style={{ '--falling-text-accent': accentColor, backgroundColor, fontSize, ...style }} {...rest}>
      <span ref={textRef} className="falling-text__text">
        {groups.map((group, index) => <Fragment key={index}>
          {index > 0 && separator}
          {split === 'letters' ? <span className="falling-text__group">{[...group.word].map((letter, position) =>
            <span key={position} data-piece="" className={pieceClass(position < group.highlightLength)}>{letter}</span>
          )}</span> : <span data-piece="" className={pieceClass(group.highlightLength > 0)}>{group.word}</span>}
        </Fragment>)}
      </span>
    </span>
  );
}
