"use client";

import { useEffect, useRef, useState } from "react";

const categories = ["全部", "品牌及徽标", "活动和展览", "海报和图形", "书籍和音乐装帧", "包装和产品", "UI和界面"];

const projects = [
  { no: "01", title: "放假公园", en: "HOLIDAY PARK", type: "品牌及徽标", year: "2023", art: "park" },
  { no: "02", title: "连马讨海音乐节", en: "SEA CALLS", type: "活动和展览", year: "2023", art: "sea" },
  { no: "03", title: "李健 · 门", en: "THE DOOR", type: "书籍和音乐装帧", year: "2021", art: "door" },
  { no: "04", title: "猎毒人", en: "THE DRUG HUNTER", type: "海报和图形", year: "2018", art: "poster" },
  { no: "05", title: "国岚茶", en: "GUOLAN TEA", type: "包装和产品", year: "2023", art: "tea" },
  { no: "06", title: "野小兽", en: "YESOUL", type: "UI和界面", year: "2022", art: "ui" },
];

const capabilities = [
  ["品牌策略与视觉系统", "95"], ["创意与美术指导", "93"], ["设计团队与项目管理", "90"],
  ["活动 / 展览落地", "88"], ["包装与出版设计", "86"], ["UI / AI 设计工作流", "82"],
];

function GenerativeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let raf = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: PointerEvent) => {
      pointer.current = { x: e.clientX / innerWidth, y: e.clientY / innerHeight };
    };
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w * (0.71 + (pointer.current.x - .5) * .06), h * (0.48 + (pointer.current.y - .5) * .06));
      const t = frame * 0.004;
      for (let ring = 0; ring < 15; ring++) {
        ctx.beginPath();
        const points = 130;
        for (let i = 0; i <= points; i++) {
          const a = (i / points) * Math.PI * 2;
          const pulse = Math.sin(a * 3 + t + ring * .22) * 8 + Math.sin(a * 7 - t * .7) * 4;
          const r = 40 + ring * 12 + pulse;
          const x = Math.cos(a) * r * 1.28;
          const y = Math.sin(a) * r * .88;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(245,245,240,${0.58 - ring * .025})`;
        ctx.lineWidth = ring % 5 === 0 ? 1.4 : .55;
        ctx.stroke();
      }
      ctx.restore();
      frame++;
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [filter, setFilter] = useState("全部");
  const [menuOpen, setMenuOpen] = useState(false);
  const visible = filter === "全部" ? projects : projects.filter(p => p.type === filter);

  return (
    <main>
      <section className="hero" id="home">
        <GenerativeCanvas />
        <nav className="nav shell">
          <a href="#home" className="brand" aria-label="薛譞杰作品集首页">XJ<sup>®</sup></a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="打开导航">{menuOpen ? "关闭" : "菜单"}</button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#works" onClick={() => setMenuOpen(false)}>作品</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>关于</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>联系</a>
          </div>
          <a href="mailto:levelfoto@gmail.com" className="contact-pill">开始合作 <Arrow /></a>
        </nav>

        <div className="hero-copy shell">
          <p className="eyebrow">VISUAL DESIGN DIRECTOR · FUZHOU</p>
          <h1><span>视觉，有其</span><span className="outline">引力。</span></h1>
          <div className="hero-bottom">
            <p>以品牌思维驱动设计，<br />在策略与感知之间建立清晰的视觉秩序。</p>
            <a href="#works" className="round-link" aria-label="查看精选作品">↓</a>
          </div>
        </div>
        <span className="side-note">SCROLL TO DISCOVER — 2026</span>
      </section>

      <section className="works shell" id="works">
        <div className="section-intro">
          <p className="index">01 — SELECTED WORKS</p>
          <h2>精选作品<span> / 2013—2026</span></h2>
        </div>
        <div className="filters" role="group" aria-label="作品分类筛选">
          {categories.map(c => <button key={c} className={filter === c ? "active" : ""} onClick={() => setFilter(c)}>{c}</button>)}
        </div>
        <div className="work-grid">
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
