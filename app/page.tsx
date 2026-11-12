"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { featuredProjects, homeCategoryPanels, heroSlogans, partnerLogos, teamMembers } from "./content/home";
import { mountainScenes } from "./content/mountains";
import AboutPoster from "./components/AboutPoster";
import FlowingMenu from "./components/FlowingMenu";
import FallingText from "./components/FallingText";
import LanguageDecryptedText from "./components/LanguageDecryptedText";
import LogoLoop from "./components/LogoLoop";
import SlingButton from "./components/SlingButton";
import SpotlightCard from "./components/SpotlightCard";
import StudioMeta from "./components/StudioMeta";
import TechText from "./components/TechText";
import TextPressure from "./components/TextPressure";

const GenerativeCanvas = lazy(() => import("./components/GenerativeCanvas"));
const heroWordmark = "/brand-logo-en-orange.svg";
const defaultCategoryCaseCount = 18;
const contactEmail = "studioalmostworks@gmail.com";
const contactEmailTokens = ["studio", "almost", "works", "@", "gmail", ".", "com"];
const contactHref = `mailto:${contactEmail}`;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [graphicVariation, setGraphicVariation] = useState(0);
  const [mountainButtonActive, setMountainButtonActive] = useState(false);
  const [previewedCategory, setPreviewedCategory] = useState<string | null>(null);
  const mountainButtonTimer = useRef<number | null>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const contactDialogRef = useRef<HTMLDialogElement>(null);
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
    <main className="home">
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
          <TextPressure
            text="Selected Works"
            flex={false}
            alpha
            textColor="#000000"
            stroke={false}
            width={false}
            weight
            minWeight={300}
            maxWeight={900}
            idleMaxWeight={800}
            peakHold={1000}
            italic={false}
            radius={0.4}
            smoothing={0.85}
            idle="pulse"
            idleSpeed={0.7}
            clickRipple
            minFontSize={36}
          />
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
                <span className={`category-panel-art ${panel.art}`} aria-hidden="true">
                  <SpotlightCard
                    as="span"
                    overlay
                    theme="dark"
                    spotlightColor="#ffffff"
                    intensity={0.15}
                    spotlightSize={360}
                    softness={0.7}
                    shape="circle"
                    borderGlow={0.6}
                    proximity={80}
                    smoothing={0.3}
                    grain={0.8}
                    ambient={false}
                    flare
                  />
                </span>
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
        <div className="about-team">
          <FlowingMenu
            items={teamMembers}
            speed={55}
            stretch={1}
            magnet={0.4}
            followCursor={0.4}
            textColor="#000000"
            bgColor="#ffffff"
            marqueeBgColor="#000000"
            marqueeTextColor="#ffffff"
            borderColor="#000000"
            duration={0.65}
            bandInset={18}
            bandRadius={22}
            dividers
            dimInactive
            imageShape="circle"
            ariaLabel="工作室成员"
          />
        </div>
        <AboutPoster src="/about-poster-placeholder.svg">
          <h2 className="about-slogan shell" lang="en">Complete Incomplete</h2>
          <div className="about-image" aria-hidden="true" />
        </AboutPoster>
      </section>

      <div className="partners">
        <div className="shell">
          <LogoLoop
            logos={partnerLogos}
            speed={100}
            direction="right"
            logoHeight={48}
            gap={60}
            hoverSpeed={0}
            scaleOnHover={false}
            ariaLabel="合作品牌 Logo"
          />
        </div>
      </div>

      <footer className="contact" id="contact">
        <div className="shell contact-inner">
          <div className="contact-row">
            <span className="mail-entry">
              <a
                className="mail-link"
                href={contactHref}
                aria-label={contactEmail}
                onClick={(event) => {
                  if (event.detail === 0) return; // Preserve keyboard and assistive activation.
                  // Pointer capture may retarget a word click to the physics container.
                  const hit = document.elementFromPoint(event.clientX, event.clientY);
                  if (!hit?.closest(".falling-text__piece") || !event.currentTarget.contains(hit)) {
                    event.preventDefault();
                  }
                }}
              >
                <FallingText
                  text={contactEmail}
                  tokens={contactEmailTokens}
                  separator=""
                  highlightWords={["studio", "almost", "works"]}
                  trigger="hover"
                  split="words"
                  fontSize="inherit"
                  accentColor="var(--brand-orange)"
                  gravity={1}
                  bounciness={0.45}
                  scatter={0.9}
                  stagger={0.045}
                  restoreDelay={2}
                  aria-hidden="true"
                />
              </a>
            </span>
            <SlingButton
              className="contact-sling"
              label="DRAG ME →"
              ariaLabel="一键联系"
              hint="拉动图标后松手打开项目确认弹窗，也可点击或按回车。"
              padColor="var(--brand-orange)"
              accentColor="var(--brand-orange)"
              iconColor="#ffffff"
              showWell={false}
              bandColor="color-mix(in srgb, var(--brand-orange) 45%, white)"
              onSend={() => {
                const dialog = contactDialogRef.current;
                if (dialog && !dialog.open) dialog.showModal();
              }}
            >
              <img className="contact-brand-icon" src="/brand-logo-icon.svg" alt="" width={44} height={44} aria-hidden="true" draggable={false} />
            </SlingButton>
          </div>
          <div className="contact-meta">
            <p className="contact-copyright">© {new Date().getFullYear()} STUDIO ALMOST<span>ALL RIGHTS RESERVED.</span></p>
            <img className="contact-wordmark" src="/brand-logo-full-orange.svg" alt="Studio Almost 不周山" width={1500} height={120} />
          </div>
        </div>
        <dialog className="contact-dialog" ref={contactDialogRef} aria-labelledby="contact-dialog-message">
          <p id="contact-dialog-message">有项目？看看我最近有没有空。</p>
          <form method="dialog" className="contact-dialog-actions">
            <button type="submit" value="confirm">没错</button>
            <button type="submit" value="cancel">点错了</button>
          </form>
        </dialog>
      </footer>
    </main>
  );
}
