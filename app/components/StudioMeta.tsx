"use client";

import { useEffect, useRef } from "react";

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const restingFrame = { transform: "none", textShadow: "none", backgroundColor: "transparent" };

function jitterFrame(direction: number, strength: number, backgroundColor = "transparent"): Keyframe {
  const shift = direction * strength * randomBetween(4, 8);
  const rise = randomBetween(-3, 3) * strength;
  return {
    transform: `translate(${shift}px, ${rise}px) skewX(${direction * strength * 12}deg)`,
    textShadow: `${-shift}px -1px var(--brand-orange), ${shift * 0.65}px 1px #7864bc`,
    backgroundColor,
    easing: "step-end",
  };
}

export default function StudioMeta() {
  const copyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy || typeof copy.animate !== "function") return;

    const words = Array.from(copy.querySelectorAll<HTMLElement>(".studio-meta-glitch"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = typeof IntersectionObserver === "undefined";
    let remaining: HTMLElement[] = [];
    let previousWord: HTMLElement | undefined;
    let timer: number | undefined;
    let active: Animation | undefined;

    function play() {
      if (!remaining.length) remaining = [...words];
      const choices = remaining.length > 1 ? remaining.filter(word => word !== previousWord) : remaining;
      const word = choices[Math.floor(Math.random() * choices.length)];
      remaining.splice(remaining.indexOf(word), 1);
      previousWord = word;

      const direction = Math.random() < 0.5 ? -1 : 1;
      const strength = randomBetween(0.85, 1.3);
      const duration = randomBetween(300, 470);
      active = word.animate([
        jitterFrame(direction, strength, "#ffe4d2"),
        jitterFrame(-direction, strength * 0.75),
        { ...restingFrame, easing: "step-end" },
        jitterFrame(direction, strength * 0.85, "#eee8ff"),
        jitterFrame(-direction, strength * 0.45),
        restingFrame,
      ], { duration });

      const pause = remaining.length ? randomBetween(120, 480) : randomBetween(450, 900);
      timer = window.setTimeout(play, duration + pause);
    }

    function stop() {
      window.clearTimeout(timer);
      timer = undefined;
      active?.cancel();
      active = undefined;
    }

    function update() {
      if (visible && !document.hidden && !reducedMotion.matches) {
        timer ??= window.setTimeout(play, randomBetween(100, 300));
      } else {
        stop();
      }
    }

    const observer = visible ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer?.observe(copy);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);
    update();

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
      stop();
    };
  }, []);

  return (
    <p ref={copyRef} className="studio-meta" lang="en">
      <strong className="studio-meta-glitch">Since 2014</strong>,{" "}
      <span className="studio-meta-glitch">Visual Design</span> Studio Founded By{" "}
      <span className="studio-meta-glitch">leVel</span>, Based in{" "}
      <span className="studio-meta-glitch">FuZhou</span>.{" "}
      <span className="studio-meta-glitch">Scroll</span> To{" "}
      <span className="studio-meta-glitch">Explore More</span>...
    </p>
  );
}
