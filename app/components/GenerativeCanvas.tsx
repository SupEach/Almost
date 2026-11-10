"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";
import type { MountainProfile } from "../content/mountains";

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export default function GenerativeCanvas({ variation, profile }: { variation: number; profile: MountainProfile }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 40, 160);
    const camera = new THREE.PerspectiveCamera(75, 1, .1, 1000);
    camera.position.set(0, 10, 75);
    camera.lookAt(0, 15, 0);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      // Keep portfolio navigation available when this browser cannot create WebGL.
      console.warn("Mountain preview could not initialize WebGL.", error);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0xffffff, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(160, 160, 38, 38);
    const material = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true });
    const simplex = new SimplexNoise(createSeededRandom((variation + 1) * 2654435761));
    const seed = (variation + 1) * 17.31;
    const cos = Math.cos(profile.ridgeAngle);
    const sin = Math.sin(profile.ridgeAngle);
    const position = geometry.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    for (let i = 0; i < position.count; i++) {
      let x = position.getX(i);
      let y = position.getY(i);
      x += simplex.noise2D(x * .03 + seed, y * .03 - seed) * 3.2;
      y += simplex.noise2D(y * .03 + 100 - seed, x * .03 + 100 + seed) * 3.2;
      position.setXY(i, x, y);

      const offsetX = x - profile.peakX;
      const offsetY = y - profile.peakY;
      const rotatedX = offsetX * cos - offsetY * sin;
      const rotatedY = offsetX * sin + offsetY * cos;
      const mainRadius = Math.sqrt(
        Math.pow(rotatedX / profile.widthX, 2)
        + Math.pow((rotatedY - profile.skew * rotatedX) / profile.widthY, 2),
      );
      const mainMask = Math.max(0, 1 - mainRadius);
      let terrainMask = mainMask;
      let z = profile.height * Math.pow(mainMask, profile.steepness);

      profile.secondaryPeaks.forEach(peak => {
        const radius = Math.sqrt(
          Math.pow((x - peak.x) / peak.widthX, 2)
          + Math.pow((y - peak.y) / peak.widthY, 2),
        );
        const mask = Math.max(0, 1 - radius);
        terrainMask = Math.max(terrainMask, mask);
        z = Math.max(z, peak.height * Math.pow(mask, 1.08));
      });

      const ridgeBand = Math.max(0, 1 - Math.abs(rotatedY - profile.skew * rotatedX) / (profile.widthY * .2));
      const broadDetail = simplex.noise2D(x * .064 + seed, y * .064 - seed);
      const sharpDetail = Math.abs(simplex.noise2D(x * .145 - seed, y * .145 + seed));
      z += ridgeBand * mainMask * profile.roughness * .58;
      z += (broadDetail * .7 + sharpDetail * .58) * profile.roughness * Math.pow(terrainMask, .6);

      const dist = Math.sqrt(x * x + y * y);
      if (dist > 68) z -= Math.pow((dist - 68) / 10, 2) * 12;
      z = Math.min(52.5, z);
      position.setZ(i, z);
      const c = Math.max(0, Math.min(1, 1 - z / 20 - .01));
      colors.push(c, c, c);
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    const mountain = new THREE.Mesh(geometry, material);
    mountain.rotation.x = -Math.PI / 2;
    scene.add(mountain);

    let raf = 0;
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const animate = () => {
      mountain.rotation.z += .0005;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    resize(); animate();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [profile, variation]);
  return <div ref={containerRef} className="hero-canvas" aria-hidden="true" />;
}
