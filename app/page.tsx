"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";

const categories = [
  { label: "Branding & Logos", type: "品牌及徽标", slug: "branding-logos", art: "identity", note: "IDENTITY / SYSTEM / SYMBOL" },
  { label: "Events & Exhibitions", type: "活动和展览", slug: "events-exhibitions", art: "events", note: "SPACE / CULTURE / EXPERIENCE" },
  { label: "Posters & Graphics", type: "海报和图形", slug: "posters-graphics", art: "posters", note: "IMAGE / TYPE / MESSAGE" },
  { label: "Editorial & Music", type: "书籍和音乐装帧", slug: "editorial-music", art: "editorial", note: "BOOK / ALBUM / NARRATIVE" },
  { label: "Packaging & Products", type: "包装和产品", slug: "packaging-products", art: "packaging", note: "OBJECT / MATERIAL / SHELF" },
  { label: "Commercial & Web", type: "商业和网站", slug: "commercial-web", art: "digital", note: "CAMPAIGN / SCREEN / WEB" },
];

const projects = [
  { no: "01", title: "放假公园", en: "HOLIDAY PARK", type: "品牌及徽标", year: "2023", art: "park" },
  { no: "02", title: "连马讨海音乐节", en: "SEA CALLS", type: "活动和展览", year: "2023", art: "sea" },
  { no: "03", title: "李健 · 门", en: "THE DOOR", type: "书籍和音乐装帧", year: "2021", art: "door" },
  { no: "04", title: "猎毒人", en: "THE DRUG HUNTER", type: "海报和图形", year: "2018", art: "poster" },
  { no: "05", title: "国岚茶", en: "GUOLAN TEA", type: "包装和产品", year: "2023", art: "tea" },
  { no: "06", title: "野小兽", en: "YESOUL", type: "商业和网站", year: "2022", art: "ui" },
];

const featuredProjects = [
  { no: "01", title: "放假公园", en: "HOLIDAY PARK", art: "park", type: "品牌及徽标" },
  { no: "02", title: "漂浮公园", en: "FLOATING PARK", art: "sea", type: "品牌及徽标" },
  { no: "03", title: "MAKERLIVE", en: "MAKER LIVE", art: "poster", type: "品牌及徽标" },
  { no: "04", title: "连马讨海音乐节", en: "SEA CALLS", art: "poster", type: "活动和展览" },
  { no: "05", title: "为爱麦跑", en: "RUN FOR LOVE", art: "ui", type: "活动和展览" },
  { no: "06", title: "周末实验室", en: "WEEKEND LAB", art: "ui", type: "活动和展览" },
  { no: "07", title: "猎毒人", en: "THE DRUG HUNTER", art: "poster", type: "海报和图形" },
  { no: "08", title: "中国式关系", en: "CHINESE STYLE", art: "door", type: "海报和图形" },
  { no: "09", title: "次声波", en: "INFRASOUND", art: "sea", type: "海报和图形" },
  { no: "10", title: "李健 · 门", en: "THE DOOR", art: "door", type: "书籍和音乐装帧" },
  { no: "11", title: "美若黎明", en: "DAWN", art: "tea", type: "书籍和音乐装帧" },
  { no: "12", title: "罗小黑战记", en: "THE LEGEND OF HEI", art: "park", type: "书籍和音乐装帧" },
  { no: "13", title: "国岚茶", en: "GUOLAN TEA", art: "tea", type: "包装和产品" },
  { no: "14", title: "春夏秋冬", en: "FOUR SEASONS", art: "sea", type: "包装和产品" },
  { no: "15", title: "苏姗酵室", en: "SUSAN FERMENTS", art: "tea", type: "包装和产品" },
  { no: "16", title: "野小兽", en: "YESOUL", art: "ui", type: "商业和网站" },
  { no: "17", title: "康姆士", en: "COM'Z", art: "park", type: "商业和网站" },
  { no: "18", title: "零重力健身", en: "ZERO GRAVITY", art: "door", type: "商业和网站" },
];

const capabilityPeaks = [
  { label: "项目阅读", height: 52 },
  { label: "趋势感知", height: 43 },
  { label: "审美判断", height: 58 },
  { label: "设计执行", height: 47 },
  { label: "团队管理", height: 54 },
];

const heroSlogans = [
  { lang: "en", text: "We’re almost there." },
  { lang: "zh-CN", text: "直到下一座山" },
  { lang: "ja", text: "もう少しでたどり着く。" },
  { lang: "fr", text: "Nous y sommes presque." },
  { lang: "es", text: "Ya casi estamos." },
  { lang: "ru", text: "Мы почти у цели." },
];

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function GenerativeCanvas({ variation }: { variation: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const randomSeed = new Uint32Array(1);
    window.crypto.getRandomValues(randomSeed);
    const seed = (randomSeed[0] ^ Math.imul(variation + 1, 0x9e3779b1)) >>> 0;
    const random = createSeededRandom(seed);
    const noiseRandom = createSeededRandom(seed ^ 0xa511e9b3);
    const simplex = new SimplexNoise(noiseRandom);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 58, 190);
    const camera = new THREE.PerspectiveCamera(68 + random() * 4, 1, .1, 1000);
    const cameraX = (random() - .5) * 12;
    const cameraY = 12 + random() * 4;
    const cameraZ = 92 + random() * 6;
    const lookAtX = (random() - .5) * 7;
    const lookAtY = 8 + random() * 3;
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(lookAtX, lookAtY, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0xffffff, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(178, 154, 46, 42);
    const material = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true, transparent: true, opacity: .88 });
    const position = geometry.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    const rawHeights: number[] = [];
    let rawMin = Number.POSITIVE_INFINITY;
    let rawMax = Number.NEGATIVE_INFINITY;
    const peakCount = 2 + Math.floor(random() * 4);
    const peaks = Array.from({ length: peakCount }, () => ({
      x: (random() - .5) * 92,
      y: (random() - .5) * 72,
      height: 26 + random() * 52,
      widthX: 150 + random() * 720,
      widthY: 130 + random() * 620,
      angle: random() * Math.PI,
    }));
    const topology = variation % 4;
    const warpStrength = 2 + random() * 8;
    const noiseFrequency = .025 + random() * .07;
    const noiseAmplitude = 5 + random() * 16;
    const ridgeAngle = random() * Math.PI;
    const ridgeOffset = (random() - .5) * 38;
    const ridgeWidth = 8 + random() * 22;
    const wavePhase = random() * Math.PI * 2;

    for (let i = 0; i < position.count; i++) {
      let x = position.getX(i);
      let y = position.getY(i);
      x += simplex.noise2D(x * .026, y * .026) * warpStrength;
      y += simplex.noise2D(y * .026 + 80, x * .026 - 80) * warpStrength;
      position.setXY(i, x, y);

      let z = -10;
      for (const peak of peaks) {
        const dx = x - peak.x;
        const dy = y - peak.y;
        const cos = Math.cos(peak.angle);
        const sin = Math.sin(peak.angle);
        const rx = dx * cos - dy * sin;
        const ry = dx * sin + dy * cos;
        z += peak.height * Math.exp(-(rx * rx / peak.widthX + ry * ry / peak.widthY));
      }

      const ridgeDistance = Math.abs(x * Math.cos(ridgeAngle) + y * Math.sin(ridgeAngle) - ridgeOffset);
      if (topology === 0) z += 24 * Math.exp(-(ridgeDistance * ridgeDistance) / (ridgeWidth * ridgeWidth));
      if (topology === 1) z -= 32 * Math.exp(-(x * x + y * y) / 260);
      if (topology === 2) z += (x * Math.cos(ridgeAngle) + y * Math.sin(ridgeAngle)) * .2;
      if (topology === 3) z += 12 * Math.sin((x + y) * .045 + wavePhase);

      z += simplex.noise2D(x * noiseFrequency + 20, y * noiseFrequency - 20) * noiseAmplitude;
      z += simplex.noise2D(x * noiseFrequency * 2.4 - 40, y * noiseFrequency * 2.4 + 40) * noiseAmplitude * .28;
      const edge = Math.max(0, Math.sqrt(x * x + y * y) - 62);
      z -= Math.pow(edge, 1.55) * .24;
      rawHeights.push(z);
      rawMin = Math.min(rawMin, z);
      rawMax = Math.max(rawMax, z);
    }

    const framedBase = -21 - random() * 3;
    const framedPeak = 58 + random() * 6;
    const rawRange = Math.max(1, rawMax - rawMin);
    for (let i = 0; i < position.count; i++) {
      const normalizedHeight = Math.max(0, Math.min(1, (rawHeights[i] - rawMin) / rawRange));
      const framedHeight = framedBase + Math.pow(normalizedHeight, .92) * (framedPeak - framedBase);
      position.setZ(i, framedHeight);
      const c = .16 + (1 - normalizedHeight) * .62;
      colors.push(c, c, c);
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.rotateZ((random() - .5) * .52);
    geometry.computeVertexNormals();
    const mountain = new THREE.Mesh(geometry, material);
    mountain.rotation.x = -Math.PI / 2;
    mountain.position.y = -7 + random() * 2;
    scene.add(mountain);
    container.dataset.mountainSignature = `${seed}-${peakCount}-${topology}-${framedPeak.toFixed(1)}`;

    let raf = 0;
    const animationStart = performance.now();
    const driftDirection = random() > .5 ? 1 : -1;
    const projectedVertex = new THREE.Vector3();
    const fitsSafeFrame = (heightScale: number) => {
      mountain.scale.z = heightScale;
      mountain.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      let highestNdc = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < position.count; i++) {
        projectedVertex.fromBufferAttribute(position, i).applyMatrix4(mountain.matrixWorld).project(camera);
        highestNdc = Math.max(highestNdc, projectedVertex.y);
      }
      return highestNdc <= .72;
    };
    const fitMountainToViewport = () => {
      let safeScale = 1;
      if (!fitsSafeFrame(safeScale)) {
        let low = .18;
        let high = 1;
        for (let i = 0; i < 14; i++) {
          const candidate = (low + high) / 2;
          if (fitsSafeFrame(candidate)) low = candidate;
          else high = candidate;
        }
        safeScale = low;
      }
      mountain.scale.z = safeScale;
      mountain.updateMatrixWorld(true);
      container.dataset.mountainFrameScale = safeScale.toFixed(3);
    };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      fitMountainToViewport();
    };
    const animate = () => {
      const elapsed = (performance.now() - animationStart) * .00012 * driftDirection;
      camera.position.x = cameraX + Math.sin(elapsed) * .8;
      camera.lookAt(lookAtX, lookAtY, 0);
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
      delete container.dataset.mountainSignature;
      delete container.dataset.mountainFrameScale;
      renderer.domElement.remove();
    };
  }, [variation]);
  return <div ref={containerRef} className="hero-canvas" aria-hidden="true" />;
}

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [graphicVariation, setGraphicVariation] = useState(0);
  const [mountainButtonActive, setMountainButtonActive] = useState(false);
  const [hoveredFeaturedCategory, setHoveredFeaturedCategory] = useState<string | null>(null);
  const [hoveredFilterCategory, setHoveredFilterCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState(0);
  const mountainButtonTimer = useRef<number | null>(null);
  const currentSlogan = heroSlogans[graphicVariation % heroSlogans.length];

  const showNextMountain = () => {
    setGraphicVariation(value => value + 1);
    setMountainButtonActive(true);
    if (mountainButtonTimer.current) window.clearTimeout(mountainButtonTimer.current);
    mountainButtonTimer.current = window.setTimeout(() => setMountainButtonActive(false), 650);
  };

  return (
    <main>
      <section className="hero" id="home">
        <nav className="nav shell">
          <a href="#home" className="brand" aria-label="薛譞杰作品集首页">
            <img src="/brand-logo-cn.svg" alt="" />
          </a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="打开导航">{menuOpen ? "关闭" : "菜单"}</button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#works" onClick={() => setMenuOpen(false)}>Works</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
          <button
            type="button"
            className={`contact-pill ${mountainButtonActive ? "is-selected" : ""}`}
            onClick={showNextMountain}
            aria-label="刷新可变图形背景"
          >下一座山</button>
        </nav>

        <div className="hero-stage">
          <div className="hero-graphic" aria-hidden="true">
            <GenerativeCanvas key={graphicVariation} variation={graphicVariation} />
          </div>
          <img className="hero-en-logo" src="/brand-logo-en-orange.svg" alt="Studio Almost" />
          <h1
            key={graphicVariation}
            className="hero-slogan"
            lang={currentSlogan.lang}
            aria-live="polite"
          >{currentSlogan.text}</h1>
        </div>

        <div className="hero-footer shell">
          <div className="studio-meta">
            <strong>SINCE 2014</strong>
            <span>VISUAL DESIGN STUDIO · BASE FUZHOU</span>
          </div>
          <a href="#works" className="round-link" aria-label="向下查看精选作品">
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="works" id="works">
        <div className="works-heading shell">
          <h2>SELECTED WORKS</h2>
        </div>

        <div className="featured-projects" aria-label="主推项目">
          <div className="featured-track">
            {[0, 1].map(group => (
              <div className="featured-set" key={group} aria-hidden={group === 1}>
                {featuredProjects.map(project => (
                  <article
                    className="featured-card"
                    key={`${group}-${project.no}`}
                    onMouseEnter={() => setHoveredFeaturedCategory(project.type)}
                    onMouseLeave={() => setHoveredFeaturedCategory(null)}
                  >
                    <div className={`featured-visual art-${project.art}`}>
                      <span>{project.no}</span>
                      <strong>{project.en}</strong>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        <nav className="filters shell" aria-label="作品分类入口">
          {categories.map(category => {
            const isActive = hoveredFeaturedCategory === category.type
              || hoveredFilterCategory === category.type;

            return (
              <a
                key={category.type}
                className={isActive ? "active" : ""}
                href={`/works/${category.slug}`}
                onMouseEnter={() => setHoveredFilterCategory(category.type)}
                onMouseLeave={() => setHoveredFilterCategory(null)}
                onFocus={() => setHoveredFilterCategory(category.type)}
                onBlur={() => setHoveredFilterCategory(null)}
              >{isActive ? category.type : category.label.toUpperCase()}</a>
            );
          })}
        </nav>

        <nav
          className="category-grid shell"
          aria-label="六大作品分类"
        >
          {categories.map((category, index) => (
            <a
              className={`category-panel category-art-${category.art} ${expandedCategory === index ? "is-expanded" : ""}`}
              href={`/works/${category.slug}`}
              key={category.slug}
              onMouseEnter={() => setExpandedCategory(index)}
              onFocus={() => setExpandedCategory(index)}
            >
              <span className="category-number">0{index + 1}</span>
              <span className="category-note">{category.note}</span>
              <div className="category-copy">
                <p>{category.type}</p>
                <h3>{category.label}</h3>
              </div>
              <span className="category-enter">点击进入</span>
            </a>
          ))}
        </nav>
      </section>

      <section className="about" id="about">
        <div className="shell">
          <header className="about-heading">
            <p>ABOUT / 关于</p>
            <h2>不完整，才是事情<br />开始变好的地方</h2>
          </header>

          <div className="experience-stats" aria-label="经验数字">
            <div><span>DESIGN EXPERIENCE</span><strong>14<sup>年</sup></strong><p>设计经验</p></div>
            <div><span>TEAM MANAGEMENT</span><strong>10<sup>年</sup></strong><p>团队管理</p></div>
            <div><span>BRANDS SERVED</span><strong>50<sup>+</sup></strong><p>服务品牌</p></div>
            <div><span>PROJECT DELIVERY</span><strong>300<sup>+</sup></strong><p>完整项目落地</p></div>
          </div>

          <div className="about-grid">
            <div className="portrait" role="img" aria-label="薛譞杰人物肖像占位图">
              <div className="portrait-mark">XJ</div>
              <div className="portrait-caption"><span>PORTRAIT / 2026</span><span>FUZHOU, CN</span></div>
            </div>
            <div className="bio">
              <p className="bio-label">BIOGRAPHY / 个人介绍</p>
              <p className="lead">关于我和不周山</p>
              <p>14 年设计经验、10 年以上项目与团队管理经验。我的工作横跨品牌、文化、商业与数字产品：从策略定义、创意提案，到供应商协同与最终落地，提供完整而稳定的视觉解决方案。</p>
            </div>
          </div>

          <div className="capabilities">
            <p className="sub-label">CAPABILITIES / 能力图谱</p>
            <div className="mountain-chart" aria-label="项目阅读、趋势感知、审美判断、设计执行与团队管理能力山形图">
              <i className="mountain-line" aria-hidden="true" />
              <div className="mountain-points">
                {capabilityPeaks.map((peak, index) => (
                  <div className="mountain-point" key={peak.label} style={{"--height": `${peak.height}%`} as React.CSSProperties}>
                    <b><span>0{index + 1}</span></b>
                    <strong>{peak.label}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="clients">
            <p className="sub-label">SELECTED COLLABORATIONS / 合作项目</p>
            <div className="client-list"><span>李健</span><span>McDonald&apos;s</span><span>罗小黑战记</span><span>YESOUL</span><span>康姆士</span><span>福建省艺术馆</span><span>MAKERLIVE</span><span>王祖蓝工作室</span><span>GUOLAN</span><span>SEA CALLS</span></div>
          </div>
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="shell contact-inner">
          <p className="index">03 — CONTACT</p>
          <div>
            <p className="availability"><i /> AVAILABLE FOR SELECTED PROJECTS</p>
            <h2>让我们创造<br /><span>值得被记住的作品。</span></h2>
          </div>
          <a className="mail-link" href="mailto:levelfoto@gmail.com"><span>levelfoto@gmail.com</span><Arrow /></a>
          <div className="footer-row">
            <span>© 2026 XUE XUANJIE</span>
            <div><a href="tel:+8613605953828">+86 136 0595 3828</a><a href="#home">回到顶部 ↑</a></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
