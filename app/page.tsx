"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { featuredProjects, homeCategoryPanels, heroSlogans } from "./content/home";
import { mountainScenes } from "./content/mountains";
import AboutPoster from "./components/AboutPoster";
import LanguageDecryptedText from "./components/LanguageDecryptedText";
import StudioMeta from "./components/StudioMeta";
import TechText from "./components/TechText";
import VariableProximity from "./components/VariableProximity";

const GenerativeCanvas = lazy(() => import("./components/GenerativeCanvas"));
const heroWordmark = "/brand-logo-en-orange.svg";
const defaultCategoryCaseCount = 18;

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [graphicVariation, setGraphicVariation] = useState(0);
  const [mountainButtonActive, setMountainButtonActive] = useState(false);
  const [previewedCategory, setPreviewedCategory] = useState<string | null>(null);
  const mountainButtonTimer = useRef<number | null>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const worksHeadingRef = useRef<HTMLHeadingElement>(null);
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

        <div className="hero-stage" ref={heroStageRef}>
          <div className="hero-graphic" aria-hidden="true">
            <Suspense fallback={<div className="hero-canvas" aria-hidden="true" />}>
              <GenerativeCanvas
                key={graphicVariation}
                variation={currentSceneIndex}
                profile={currentScene.profile}
              />
            </Suspense>
          </div>
          <div className="hero-en-logo">
            <TechText
              artwork={heroWordmark}
              drawingAreaRef={heroStageRef}
              text="STUDIO ALMOST,"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              intro="none"
              clickKick
              sweep={false}
              guides={false}
            />
            <img src={heroWordmark} alt="Studio Almost" width={856} height={120} />
          </div>
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
          <StudioMeta />
          <a href="#works" className="round-link" aria-label="向下查看精选作品">
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="works" id="works">
        <div className="featured-projects" aria-label="主推项目">
          <div className="featured-track">
            {[0, 1].map(group => (
              <div className="featured-set" key={group} aria-hidden={group === 1}>
                {featuredProjects.map(project => (
                  <article
                    className="featured-card"
                    key={`${group}-${project.no}`}
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

        <div className="works-heading">
          <h2 ref={worksHeadingRef}>
            <VariableProximity
              label="Selected Works"
              fromFontVariationSettings="'wght' 500"
              toFontVariationSettings="'wght' 900"
              containerRef={worksHeadingRef}
              radius={100}
              style={{ whiteSpace: "nowrap" }}
            />
          </h2>
        </div>

        <nav className="category-grid" aria-label="十二类作品面板">
          {homeCategoryPanels.map(panel => (
            <article className="category-panel" key={panel.label}>
              <button
                className="category-preview"
                type="button"
                aria-label={`${panel.label} ${panel.title}，${defaultCategoryCaseCount} 个案例，预览图像`}
                aria-pressed={previewedCategory === panel.label}
                onClick={event => {
                  const desktopHover = window.matchMedia("(width > 800px) and (hover: hover) and (pointer: fine)");
                  const pointerType = (event.nativeEvent as PointerEvent).pointerType;
                  if (event.detail > 0 && pointerType !== "touch" && desktopHover.matches) return;
                  setPreviewedCategory(current => current === panel.label ? null : panel.label);
                }}
              >
                <span className={`category-panel-art ${panel.art}`} aria-hidden="true" />
                <span className="category-panel-title">{panel.label}</span>
                <span className="category-panel-badges">
                  <span className="category-panel-label">{panel.title}</span>
                  <span className="category-panel-count">{defaultCategoryCaseCount}</span>
                </span>
              </button>
              <a className="category-enter" href={`/works/${panel.slug}`} aria-label={`查看${panel.title}所属分类页`}>→</a>
            </article>
          ))}
        </nav>
      </section>

      <section className="about" id="about">
        <div className="shell">
          <AboutPoster src="/about-poster-placeholder.svg" />
          <h2 className="about-slogan">不完整，才是事情<br />开始变好的地方</h2>
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
