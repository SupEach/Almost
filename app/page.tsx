"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";

const categories = [
  { label: "Branding & Logos", type: "品牌及徽标" },
  { label: "Events & Exhibitions", type: "活动和展览" },
  { label: "Posters & Graphics", type: "海报和图形" },
  { label: "Editorial & Music", type: "书籍和音乐装帧" },
  { label: "Packaging & Products", type: "包装和产品" },
  { label: "Commercial & Web", type: "商业和网站" },
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

const capabilities = [
  ["品牌策略与视觉系统", "95"], ["创意与美术指导", "93"], ["设计团队与项目管理", "90"],
  ["活动 / 展览落地", "88"], ["包装与出版设计", "86"], ["UI / AI 设计工作流", "82"],
];

const heroSlogans = [
  { lang: "en", text: "We’re almost there." },
  { lang: "zh-CN", text: "直到下一座山" },
  { lang: "ja", text: "もう少しでたどり着く。" },
  { lang: "fr", text: "Nous y sommes presque." },
  { lang: "es", text: "Ya casi estamos." },
  { lang: "ru", text: "Мы почти у цели." },
];

function GenerativeCanvas({ variation }: { variation: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 40, 160);
    const camera = new THREE.PerspectiveCamera(75, 1, .1, 1000);
    camera.position.set(0, 10, 75);
    camera.lookAt(0, 15, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0xffffff, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(160, 160, 38, 38);
    const material = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true });
    const simplex = new SimplexNoise();
    const seed = Math.random() * 100 + variation * 17.31;
    const position = geometry.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    for (let i = 0; i < position.count; i++) {
      let x = position.getX(i);
      let y = position.getY(i);
      x += simplex.noise2D(x * .03 + seed * .01, y * .03) * 4;
      y += simplex.noise2D(y * .03 + 100, x * .03 + 100 + seed * .01) * 4;
      position.setXY(i, x, y);
      const dist = Math.sqrt(x * x + y * y);
      let z = 50 * Math.exp(-(x * x + y * y) / 1200);
      z += Math.abs(simplex.noise2D(x * .06 + seed, y * .06 + seed)) * 6;
      if (dist > 55) z -= Math.pow(dist - 55, 2) * .06;
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
  }, [variation]);
  return <div ref={containerRef} className="hero-canvas" aria-hidden="true" />;
}

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [filter, setFilter] = useState("全部");
  const [menuOpen, setMenuOpen] = useState(false);
  const [graphicVariation, setGraphicVariation] = useState(0);
  const [mountainButtonActive, setMountainButtonActive] = useState(false);
  const [hoveredFeaturedCategory, setHoveredFeaturedCategory] = useState<string | null>(null);
  const mountainButtonTimer = useRef<number | null>(null);
  const visible = filter === "全部" ? projects : projects.filter(p => p.type === filter);
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

        <div className="filters shell" role="group" aria-label="作品分类筛选">
          {categories.map(category => {
            const isActive = hoveredFeaturedCategory === category.type
              || (!hoveredFeaturedCategory && filter === category.type);

            return (
              <button
                key={category.type}
                className={isActive ? "active" : ""}
                onClick={() => setFilter(current => current === category.type ? "全部" : category.type)}
              >{isActive ? category.type : category.label.toUpperCase()}</button>
            );
          })}
        </div>
        <div className="work-grid shell">
          {visible.map((p, i) => (
            <article className={`project ${i % 3 === 0 ? "wide" : ""}`} key={p.title}>
              <div className={`project-art art-${p.art}`}>
                <span className="art-no">{p.no}</span>
                <div className="art-type">{p.en}</div>
                <span className="view">查看项目 <Arrow /></span>
              </div>
              <div className="project-meta">
                <div><h3>{p.title}</h3><p>{p.en}</p></div>
                <div><span>{p.type}</span><span>{p.year}</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="shell">
          <div className="section-intro light">
            <p className="index">02 — ABOUT</p>
            <h2>设计不是装饰，<br />是建立<span>意义与秩序。</span></h2>
          </div>
          <div className="about-grid">
            <div className="portrait" role="img" aria-label="薛譞杰人物肖像占位图">
              <div className="portrait-mark">XJ</div>
              <div className="portrait-caption"><span>PORTRAIT / 2026</span><span>FUZHOU, CN</span></div>
            </div>
            <div className="bio">
              <p className="lead">你好，我是薛譞杰。一名始终保持一线创作的视觉设计总监。</p>
              <p>14 年设计经验、10 年以上项目与团队管理经验。我的工作横跨品牌、文化、商业与数字产品：从策略定义、创意提案，到供应商协同与最终落地，提供完整而稳定的视觉解决方案。</p>
              <div className="stats">
                <div><strong>14<sup>+</sup></strong><span>年设计经验</span></div>
                <div><strong>10<sup>+</sup></strong><span>年团队管理</span></div>
                <div><strong>100<sup>+</sup></strong><span>完整项目交付</span></div>
              </div>
            </div>
          </div>
          <div className="capabilities">
            <p className="sub-label">CAPABILITIES / 能力图谱</p>
            <div className="cap-list">
              {capabilities.map(([name, value], i) => <div className="cap" key={name} style={{"--score": `${value}%`} as React.CSSProperties}><span>0{i+1}</span><strong>{name}</strong><i><b /></i><em>{value}</em></div>)}
            </div>
          </div>
          <div className="clients">
            <p className="sub-label">SELECTED COLLABORATIONS / 合作项目</p>
            <div className="client-list"><span>李健</span><span>McDonald&apos;s</span><span>罗小黑战记</span><span>YESOUL</span><span>康姆士</span><span>福建省艺术馆</span><span>MAKERLIVE</span><span>王祖蓝工作室</span></div>
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
