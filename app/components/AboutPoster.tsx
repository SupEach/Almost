"use client";

import { useEffect, useRef } from "react";
import type { createPaperScene, PaperPose } from "./aboutPosterScene";

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export default function AboutPoster({ src }: { src: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const elements = { stage: stageRef.current, canvas: canvasRef.current, sheet: sheetRef.current };
    if (!elements.stage || !elements.canvas || !elements.sheet) return;
    const { stage, canvas, sheet } = elements;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pose: PaperPose = { x: 0, y: 0, curl: 0, axisX: 1, axisY: 0 };
    const target = { x: 0, y: 0, curl: 0 };
    let scene: Awaited<ReturnType<typeof createPaperScene>> | undefined;
    let loading = false;
    let disposed = false;
    let frame = 0;
    let previousTime = 0;
    let previewTimer = 0;
    let sheetWidth = 1;
    let limitX = 0;
    let limitY = 0;
    let grab: { id: number; x: number; y: number; centered: boolean } | undefined;

    function draw() {
      const tilt = clamp(pose.x / sheetWidth, 0.75);
      sheet.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) rotate(${tilt * 18}deg)`;
      sheet.style.setProperty("--paper-tilt", `${pose.axisX * pose.curl * -38}deg`);
      scene?.render(pose);
    }

    function tick(now: number) {
      frame = 0;
      const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 1 / 60;
      const ease = motion.matches ? 1 : 1 - Math.exp(-(grab ? 21 : 10) * delta);
      let settling = false;
      for (const key of ["x", "y", "curl"] as const) {
        const distance = target[key] - pose[key];
        const remaining = Math.abs(distance) * (1 - ease);
        if (remaining < (key === "curl" ? 0.002 : 0.15)) pose[key] = target[key];
        else {
          pose[key] += distance * ease;
          settling = true;
        }
      }
      draw();
      previousTime = settling ? now : 0;
      if (settling) requestDraw();
    }

    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function resize() {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      sheetWidth = sheet.offsetWidth;
      const sheetHeight = sheet.offsetHeight;
      limitX = Math.max(0, (width - sheetWidth) / 2 - 12 - sheetHeight * 0.12);
      limitY = Math.max(0, (height - sheetHeight) / 2 - 12 - sheetWidth * 0.11);
      for (const position of [pose, target]) {
        position.x = clamp(position.x, limitX);
        position.y = clamp(position.y, limitY);
      }
      scene?.resize(width, height, sheetWidth, sheetHeight);
      draw();
    }

    async function loadScene() {
      if (loading || motion.matches || disposed) return;
      loading = true;
      try {
        const { createPaperScene } = await import("./aboutPosterScene");
        if (disposed) return;
        const next = await createPaperScene(canvas, src);
        if (disposed) {
          next.dispose();
          return;
        }
        scene = next;
        resize();
        stage.dataset.paperRendered = "true";
      } catch {
        // The same artwork remains draggable when WebGL is unavailable.
      }
    }

    function recenter() {
      window.clearTimeout(previewTimer);
      target.x = target.y = target.curl = 0;
      requestDraw();
    }

    function begin(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0 || grab) return;
      window.clearTimeout(previewTimer);
      const rect = sheet.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = (rect.top + rect.height / 2) - event.clientY;
      const distance = Math.hypot(x, y);
      const centered = distance < sheetWidth * 0.1;
      pose.axisX = centered ? 1 : x / distance;
      pose.axisY = centered ? 0 : y / distance;
      grab = { id: event.pointerId, x: event.clientX - pose.x, y: event.clientY - pose.y, centered };
      target.curl = motion.matches ? 0 : 0.22;
      sheet.dataset.dragging = "true";
      sheet.setPointerCapture(event.pointerId);
      void loadScene();
      requestDraw();
    }

    function move(event: PointerEvent) {
      if (!grab || event.pointerId !== grab.id) return;
      const x = event.clientX - grab.x;
      const y = event.clientY - grab.y;
      const distance = Math.hypot(x, y);
      if (grab.centered && distance > 5) {
        pose.axisX = -x / distance;
        pose.axisY = y / distance;
        grab.centered = false;
      }
      target.x = clamp(x, limitX);
      target.y = clamp(y, limitY);
      target.curl = motion.matches ? 0 : Math.min(1, 0.22 + distance / (sheetWidth * 0.9));
      requestDraw();
    }

    function end(event: PointerEvent) {
      if (event.pointerId !== grab?.id) return;
      grab = undefined;
      delete sheet.dataset.dragging;
      recenter();
    }

    function keyboardPreview(event: MouseEvent) {
      if (event.detail !== 0 || grab || motion.matches) return;
      window.clearTimeout(previewTimer);
      pose.axisX = 0.8;
      pose.axisY = -0.6;
      target.curl = 0.72;
      requestDraw();
      previewTimer = window.setTimeout(recenter, 450);
    }

    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void loadScene();
    }, { rootMargin: "240px" });
    const sizeObserver = new ResizeObserver(resize);
    observer?.observe(stage);
    sizeObserver.observe(stage);
    sizeObserver.observe(sheet);
    resize();
    sheet.addEventListener("pointerdown", begin);
    sheet.addEventListener("pointermove", move);
    sheet.addEventListener("pointerup", end);
    sheet.addEventListener("pointercancel", end);
    sheet.addEventListener("lostpointercapture", end);
    sheet.addEventListener("click", keyboardPreview);
    motion.addEventListener("change", recenter);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(previewTimer);
      observer?.disconnect();
      sizeObserver.disconnect();
      sheet.removeEventListener("pointerdown", begin);
      sheet.removeEventListener("pointermove", move);
      sheet.removeEventListener("pointerup", end);
      sheet.removeEventListener("pointercancel", end);
      sheet.removeEventListener("lostpointercapture", end);
      sheet.removeEventListener("click", keyboardPreview);
      motion.removeEventListener("change", recenter);
      delete stage.dataset.paperRendered;
      scene?.dispose();
    };
  }, [src]);

  return (
    <div className="about-poster-stage" ref={stageRef}>
      <canvas className="about-poster-canvas" ref={canvasRef} aria-hidden="true" />
      <button className="about-poster" type="button" ref={sheetRef} aria-label="可拖动的纸质海报，按回车或空格可掀起">
        <span className="about-poster-print" style={{ backgroundImage: `url("${src}")` }} aria-hidden="true" />
      </button>
    </div>
  );
}
