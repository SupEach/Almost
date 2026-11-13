"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence } from "motion/react";
import SiteNavigation from "../components/SiteNavigation";
import OptionWheel from "../components/OptionWheel";
import Masonry from "../components/Masonry";
import FallingText from "../components/FallingText";
import TechText from "../components/TechText";
import { featuredProjects, homeCategoryPanels } from "../content/home";
import "./works.css";

// Existing records only identify the six parent groups. Both child entries
// show that group's records until real project-level classification is supplied.
const parentTypes = [...new Set(featuredProjects.map(project => project.type))];
// Width / height formats: square 1:1, portrait 3:4, landscape 4:3.
const ratios = [1, 4 / 3, 3 / 4];
const projects = featuredProjects.map((project, index) => ({
  ...project,
  id: project.no,
  width: 600,
  height: 600 * ratios[index % ratios.length],
}));
// Nine layout samples per category, using the existing records in three
// aspect ratios. These are preview variants, not additional project records.
const categoryPreviews = parentTypes.map(type => {
  const source = projects.filter(project => project.type === type);
  return Array.from({ length: 9 }, (_, index) => {
    const project = source[index % source.length];
    const variation = Math.floor(index / source.length);
    return {
      ...project,
      id: `${project.no}-preview-${variation}`,
      height: project.width * ratios[(index + variation) % ratios.length],
    };
  });
});
const allOptionIndex = 6;
const categories = homeCategoryPanels.map((panel, categoryIndex) => ({ ...panel, categoryIndex }));
const wheelOptions = [
  ...categories.slice(0, allOptionIndex),
  { label: "All", title: "全部", categoryIndex: null },
  ...categories.slice(allOptionIndex),
];
const options = wheelOptions.map(option => option.label);
const selectedOptions = wheelOptions.map(option => option.title);

type Project = typeof projects[number];

function subscribeCompactLayout(onChange: () => void) {
  const media = window.matchMedia("(max-width: 800px)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const getCompactLayout = () => window.matchMedia("(max-width: 800px)").matches;
const getServerLayout = () => false;

export default function WorksOverview() {
  const [wheelIndex, setWheelIndex] = useState(allOptionIndex);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasChangedCategory, setHasChangedCategory] = useState(false);
  const compactLayout = useSyncExternalStore(subscribeCompactLayout, getCompactLayout, getServerLayout);
  const [preview, setPreview] = useState<Project | null>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const category = wheelOptions[wheelIndex].categoryIndex;
  const panel = category === null ? null : homeCategoryPanels[category];
  const visibleProjects = category === null ? projects : categoryPreviews[Math.floor(category / 2)];

  const changeCategory = (index: number) => {
    if (index !== wheelIndex) setHasChangedCategory(true);
    setWheelIndex(index);
    setHasInteracted(true);
    // Reset long archive scrolls without moving the sticky wheel or header.
    const top = galleryRef.current?.offsetTop ?? 0;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" });
  };

  return (
    <main className="works-overview">
      <SiteNavigation currentPage="works" />
      <div className="works-browser">
        <aside className="works-sidebar" ref={sidebarRef} aria-label="作品分类导航">
          <div className="works-sidebar-heading">
            <div className="works-title-stage">
              <h1 ref={titleRef} aria-label="Works.">
                {Array.from("Works.").map((char, index) => <span key={index} data-tech-glyph={char} aria-hidden="true">{char}</span>)}
                <span data-tech-baseline="" aria-hidden="true" />
              </h1>
              <TechText
                text="Works."
                textElementRef={titleRef}
                drawingAreaRef={sidebarRef}
                fontWeight={500}
                letterSpacing={0}
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={15}
                intro="none"
                clickKick
                sweep={false}
                guides={false}
              />
            </div>
          </div>
          <OptionWheel
            items={options}
            selectedLabels={selectedOptions}
            defaultSelected={allOptionIndex}
            active={hasInteracted}
            onInteraction={() => setHasInteracted(true)}
            containLabels
            ariaLabel="作品分类；使用上下方向键切换，也可滚动或拖动"
            textColor="#000000"
            activeColor="var(--brand-orange)"
            fontSize={2.22}
            spacing={1.4}
            curve={1}
            tilt={6}
            blur={.5}
            fade={.2}
            minOpacity={.05}
            smoothing={300}
            inset={96}
            loop
            onChange={changeCategory}
          />
          <div className="works-sidebar-footer">
            <span aria-hidden="true">SCROLL / DRAG ↕</span>
          </div>
        </aside>

        <section className="works-gallery" ref={galleryRef} aria-labelledby="works-gallery-title">
          <header className="works-gallery-heading">
            <h2 id="works-gallery-title" aria-label={panel ? panel.label : "All works"}>
              <FallingText
                key={panel ? panel.label : "all"}
                text={panel ? panel.label : "All works"}
                split="letters"
                trigger="hover"
                fontSize="inherit"
                gravity={1}
                bounciness={.45}
                scatter={.9}
                stagger={.045}
                restoreDelay={2}
                aria-hidden="true"
              />
            </h2>
            <p role="status" aria-live="polite" aria-label={`共 ${visibleProjects.length} 张作品卡片`}><span className="works-project-count">{String(visibleProjects.length).padStart(2, "0")}</span></p>
          </header>
          <div className="works-gallery-stage">
            <AnimatePresence mode="wait" initial={false}>
                <Masonry
                  key={wheelIndex}
                  categoryTransition
                  items={visibleProjects}
                  columns={compactLayout ? "auto" : 3}
                  columnWidth={240}
                  gap={16}
                  radius={16}
                  animateFrom="bottom"
                  initialAnimateFrom={hasChangedCategory ? "none" : undefined}
                  duration={.45}
                  stagger={.035}
                  bounce={0}
                  blurToFocus={false}
                  hoverEffect="zoom"
                  captions="none"
                  lightbox={false}
                  draggable={false}
                  renderItem={(item: Project) => (
                    <span className={`works-art featured-visual art-${item.art}`} aria-hidden="true">
                      <span>{item.no}</span>
                      <strong>{item.en}</strong>
                    </span>
                  )}
                  onItemClick={(item: Project) => {
                    setPreview(item);
                    dialogRef.current?.showModal();
                  }}
                />
            </AnimatePresence>
          </div>
          <footer className="works-gallery-footer">
            <p className="contact-copyright">© {new Date().getFullYear()} STUDIO ALMOST<span>ALL RIGHTS RESERVED.</span></p><a href="/#contact">LET’S TALK ↗</a>
          </footer>
        </section>
      </div>
      <dialog className="works-preview-dialog" ref={dialogRef} aria-labelledby="works-preview-title">
        <form method="dialog">
          <span className="works-kicker">{preview?.en}</span>
          <h2 id="works-preview-title">{preview?.title}</h2>
          <p>作品详情页将在后续任务中展开。</p>
          <button type="submit">返回作品总览</button>
        </form>
      </dialog>
    </main>
  );
}
