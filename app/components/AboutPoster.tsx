"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { createPaperScene, PaperPose } from "./aboutPosterScene";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const shapeKeys = ["curl", "pitch", "yaw"] as const;
type PaperPlacement = Pick<PaperPose, "x" | "y" | "roll">;
type PaperShape = Pick<PaperPose, (typeof shapeKeys)[number]>;

export default function AboutPoster({ src, children }: { src: string; children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const elements = { stage: stageRef.current, canvas: canvasRef.current, sheet: sheetRef.current };
    if (!elements.stage || !elements.canvas || !elements.sheet) return;
    const { stage, canvas, sheet } = elements;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target: PaperPlacement & PaperShape = { x: 0, y: 0, roll: 0, curl: 0, pitch: 0, yaw: 0 };
    const pose: PaperPose = { ...target, axisX: 1, axisY: 0 };
    let scene: Awaited<ReturnType<typeof createPaperScene>> | undefined;
    let loading = false;
    let disposed = false;
    let frame = 0;
    let previousTime = 0;
    let previewTimer = 0;
    let stageWidth = 0;
    let stageHeight = 0;
    let sheetWidth = 1;
    let sheetHeight = 1;
    let originX = 0;
    let originY = 0;
    let maxRoll = 0;
    let release: (PaperShape & { elapsed: number }) | undefined;
    let grab: {
      id: number; x: number; y: number; start: PaperPlacement;
      gripX: number; gripY: number; centered: boolean;
    } | undefined;

    function keepInsideStage(position: PaperPlacement) {
      position.roll = clamp(position.roll, -maxRoll, maxRoll);
      const cos = Math.cos(position.roll);
      const sin = Math.abs(Math.sin(position.roll));
      const roomX = Math.max(0, (stageWidth - sheetWidth * cos - sheetHeight * sin) / 2 - 12);
      const roomY = Math.max(0, (stageHeight - sheetHeight * cos - sheetWidth * sin) / 2 - 12);
      position.x = clamp(position.x, -originX - roomX, -originX + roomX);
      position.y = clamp(position.y, -originY - roomY, -originY + roomY);
    }

    function draw() {
      sheet.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) rotate(${pose.roll}rad)`;
      sheet.style.setProperty("--paper-pitch", `${-pose.pitch - pose.axisY * pose.curl * 0.35}rad`);
      sheet.style.setProperty("--paper-yaw", `${pose.yaw - pose.axisX * pose.curl * 0.48}rad`);
      scene?.render({ ...pose, x: pose.x + originX, y: pose.y + originY });
    }

    function tick(now: number) {
      frame = 0;
      const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 1 / 60;
      const ease = motion.matches ? 1 : 1 - Math.exp(-(grab ? 21 : 14) * delta);
      let settling = false;
      for (const key of ["x", "y", "roll"] as const) {
        const next = pose[key] + (target[key] - pose[key]) * ease;
        const reached = Math.abs(target[key] - next) < (key === "roll" ? 0.0005 : 0.15);
        pose[key] = reached ? target[key] : next;
        settling ||= !reached;
      }
      // A critically damped return lets the bend relax without flipping to the reverse side.
      const recoveryTime = release ? (release.elapsed += delta) * 5.2 : 0;
      const recovery = (1 + recoveryTime) * Math.exp(-recoveryTime);
      for (const key of shapeKeys) {
        const next = release && !motion.matches ? release[key] * recovery : pose[key] + (target[key] - pose[key]) * ease;
        const reached = Math.abs(target[key] - next) < 0.0015;
        pose[key] = reached ? target[key] : next;
        settling ||= !reached;
      }
      keepInsideStage(pose);
      draw();
      previousTime = settling ? now : 0;
      if (settling) requestDraw();
      else release = undefined;
    }

    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function resize() {
      stageWidth = stage.clientWidth;
      stageHeight = stage.clientHeight;
      sheetWidth = sheet.offsetWidth;
      sheetHeight = sheet.offsetHeight;
      const left = sheet.offsetLeft;
      const top = sheet.offsetTop;
      originX = left + (sheetWidth - stageWidth) / 2;
      originY = top + (sheetHeight - stageHeight) / 2;
      maxRoll = clamp(Math.min((stageWidth - sheetWidth - 24) / sheetHeight, (stageHeight - sheetHeight - 24) / sheetWidth), 0, 0.44);
      keepInsideStage(pose);
      keepInsideStage(target);
      scene?.resize(stageWidth, stageHeight, sheetWidth, sheetHeight);
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

    function flatten() {
      window.clearTimeout(previewTimer);
      release = grab || motion.matches ? undefined : { elapsed: 0, curl: pose.curl, pitch: pose.pitch, yaw: pose.yaw };
      target.curl = target.pitch = target.yaw = 0;
      if (motion.matches) target.roll = 0;
      keepInsideStage(target);
      requestDraw();
    }

    function begin(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0 || grab) return;
      window.clearTimeout(previewTimer);
      release = undefined;
      const bounds = stage.getBoundingClientRect();
      const gripX = event.clientX - bounds.left - stageWidth / 2 - originX - pose.x;
      const gripY = bounds.top + stageHeight / 2 + originY + pose.y - event.clientY;
      const cos = Math.cos(pose.roll);
      const sin = Math.sin(pose.roll);
      const x = gripX * cos - gripY * sin;
      const y = gripX * sin + gripY * cos;
      const distance = Math.hypot(x, y);
      const centered = distance < sheetWidth * 0.1;
      pose.axisX = centered ? 1 : x / distance;
      pose.axisY = centered ? 0 : y / distance;
      grab = {
        id: event.pointerId,
        x: event.clientX - bounds.left - pose.x,
        y: event.clientY - bounds.top - pose.y,
        start: { x: pose.x, y: pose.y, roll: pose.roll },
        gripX: clamp(gripX * 2 / sheetWidth, -1, 1),
        gripY: clamp(gripY * 2 / sheetHeight, -1, 1),
        centered,
      };
      target.x = pose.x;
      target.y = pose.y;
      target.roll = pose.roll;
      target.pitch = target.yaw = 0;
      target.curl = motion.matches ? 0 : 0.22;
      sheet.dataset.dragging = "true";
      sheet.setPointerCapture(event.pointerId);
      void loadScene();
      requestDraw();
    }

    function move(event: PointerEvent) {
      if (!grab || event.pointerId !== grab.id) return;
      const bounds = stage.getBoundingClientRect();
      target.x = event.clientX - bounds.left - grab.x;
      target.y = event.clientY - bounds.top - grab.y;
      const dx = target.x - grab.start.x;
      const dy = target.y - grab.start.y;
      const distance = Math.hypot(dx, dy);
      if (grab.centered && distance > 5) {
        const cos = Math.cos(grab.start.roll);
        const sin = Math.sin(grab.start.roll);
        pose.axisX = (-dx * cos - dy * sin) / distance;
        pose.axisY = (-dx * sin + dy * cos) / distance;
        grab.centered = false;
      }
      if (motion.matches) {
        target.roll = target.curl = target.pitch = target.yaw = 0;
      } else {
        const torque = (0.55 + grab.gripY) * dx + (0.2 + grab.gripX) * dy;
        target.roll = grab.start.roll + torque * 0.48 / sheetWidth;
        target.pitch = clamp(-dy * 0.5 / sheetHeight, -0.22, 0.22);
        target.yaw = clamp(dx * 0.36 / sheetWidth, -0.24, 0.24);
        target.curl = Math.min(1, 0.22 + distance / (sheetWidth * 0.9));
      }
      keepInsideStage(target);
      requestDraw();
    }

    function end(event: PointerEvent) {
      if (event.pointerId !== grab?.id) return;
      if (event.type === "pointerup") move(event);
      grab = undefined;
      delete sheet.dataset.dragging;
      flatten();
    }

    function keyboardPreview(event: MouseEvent) {
      if (event.detail !== 0 || grab || motion.matches) return;
      window.clearTimeout(previewTimer);
      release = undefined;
      pose.axisX = 0.8;
      pose.axisY = -0.6;
      target.curl = 0.72;
      requestDraw();
      previewTimer = window.setTimeout(flatten, 450);
    }

    function keyboardMove(event: KeyboardEvent) {
      if (grab) return;
      const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const direction = directions[event.key as keyof typeof directions];
      if (!Array.isArray(direction)) return;
      event.preventDefault();
      target.x += direction[0] * 32;
      target.y += direction[1] * 32;
      keepInsideStage(target);
      requestDraw();
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
    sheet.addEventListener("keydown", keyboardMove);
    motion.addEventListener("change", flatten);

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
      sheet.removeEventListener("keydown", keyboardMove);
      motion.removeEventListener("change", flatten);
      delete stage.dataset.paperRendered;
      scene?.dispose();
    };
  }, [src]);

  return (
    <div className="about-poster-stage" ref={stageRef}>
      <canvas className="about-poster-canvas" ref={canvasRef} aria-hidden="true" />
      <button className="about-poster" type="button" ref={sheetRef} aria-label="可拖动的纸质海报，方向键移动，回车或空格掀起">
        <span className="about-poster-print" style={{ backgroundImage: `url("${src}")` }} aria-hidden="true" />
      </button>
      {children}
    </div>
  );
}
