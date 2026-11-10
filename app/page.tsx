"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { categories } from "./content/categories";
import { featuredProjects, capabilityPeaks, heroSlogans } from "./content/home";
import { mountainScenes } from "./content/mountains";
import LanguageDecryptedText from "./components/LanguageDecryptedText";

const GenerativeCanvas = lazy(() => import("./components/GenerativeCanvas"));

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [graphicVariation, setGraphicVariation] = useState(0);
  const [mountainButtonActive, setMountainButtonActive] = useState(false);
  const [hoveredFeaturedCategory, setHoveredFeaturedCategory] = useState<string | null>(null);
  const [hoveredFilterCategory, setHoveredFilterCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState(0);
  const mountainButtonTimer = useRef<number | null>(null);
  const currentSceneIndex = graphicVariation % mountainScenes.length;
  const currentScene = mountainScenes[currentSceneIndex];
  const currentSlogan = heroSlogans[graphicVariation % heroSlogans.length];

  const showNextMountain = () => {
    setGraphicVariation(value => value + 1);
    setMountainButtonActive(true);
    if (mountainButtonTimer.current) window.clearTimeout(mountainButtonTimer.current);
    mountainButtonTimer.current = window.setTimeout(() => setMountainButtonActive(false), 650);
  };

  useEffect(() => () => {
    if (mountainButtonTimer.current) window.clearTimeout(mountainButtonTimer.current);
  }, []);

  return (
    <main>
      <nav className="nav shell">
        <a href="#home" className="brand" aria-label="薛譞杰作品集首页">
          <img src="/brand-logo-cn.svg" alt="" />
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "关闭导航" : "打开导航"}>{menuOpen ? "关闭" : "菜单"}</button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#works" onClick={() => setMenuOpen(false)}>Works</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
        <button
          type="button"
          className={`contact-pill ${mountainButtonActive ? "is-selected" : ""}`}
          onClick={showNextMountain}
          aria-label="切换至下一座山"
        >下一座山</button>
      </nav>

      <section className="hero" id="home">

        <div className="hero-context shell">
          <p className="hero-quote" key={currentSceneIndex} aria-live="polite">
            <span>“{currentScene.quote}”</span>
            <cite>——{currentScene.credit}</cite>
          </p>
          <span className="hero-context-brand">STUDIO ALMOST, 不周山设计</span>
        </div>

        <div className="hero-stage">
          <div className="hero-graphic" aria-hidden="true">
            <Suspense fallback={<div className="hero-canvas" aria-hidden="true" />}>
              <GenerativeCanvas
                key={graphicVariation}
                variation={currentSceneIndex}
                profile={currentScene.profile}
              />
            </Suspense>
          </div>
          <img className="hero-en-logo" src="/brand-logo-en-orange.svg" alt="Studio Almost" />
          <div className="hero-message" key={graphicVariation}>
            <h1
              className="hero-slogan"
              lang={currentSlogan.lang}
              aria-live="polite"
              aria-label={currentSlogan.text}
            >
              <LanguageDecryptedText text={currentSlogan.text} lang={currentSlogan.lang} />
            </h1>
            <div
              className="hero-sequence"
              aria-label={`${currentScene.mountain} 坐标：${currentScene.latitude}，${currentScene.longitude}`}
            >
              <span>{currentScene.latitude} · {currentScene.longitude} / {currentScene.mountain}</span>
            </div>
          </div>
        </div>

        <div className="hero-footer shell">
          <div className="studio-meta">
            <strong>SINCE 2014</strong>
            <span>VISUAL DESIGN STUDIO · BASE FUZHOU</span>
          </div>
          <div className="hero-scroll">
            <span aria-hidden="true">SCROLL TO EXPLORE</span>
            <a href="#works" className="round-link" aria-label="向下查看精选作品">
              <span aria-hidden="true">↓</span>
            </a>
          </div>
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
