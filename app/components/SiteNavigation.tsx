"use client";

import { useState } from "react";

type Props = {
  currentPage?: "home" | "works";
  mountainButtonActive?: boolean;
  onNextMountain?: () => void;
};

export default function SiteNavigation({ currentPage = "home", mountainButtonActive, onNextMountain }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const home = currentPage === "home";

  return (
    <nav className="nav shell" aria-label="主导航">
      <a href={home ? "#home" : "/#home"} className="brand" aria-label="薛譞杰作品集首页">
        <img src="/brand-logo-cn.svg" alt="" />
      </a>
      <button type="button" className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "关闭导航" : "打开导航"}>{menuOpen ? "关闭" : "菜单"}</button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="/works" aria-current={currentPage === "works" ? "page" : undefined} onClick={() => setMenuOpen(false)}>Works</a>
        <a href={home ? "#about" : "/#about"} onClick={() => setMenuOpen(false)}>About</a>
        <a href={home ? "#contact" : "/#contact"} onClick={() => setMenuOpen(false)}>Contact</a>
      </div>
      {onNextMountain ? (
        <button type="button" className={`contact-pill ${mountainButtonActive ? "is-selected" : ""}`} onClick={onNextMountain} aria-label="切换至下一座山">下一座山</button>
      ) : home ? (
        <a className="contact-pill" href="/#home" aria-label="回到首页探索下一座山">下一座山</a>
      ) : null}
    </nav>
  );
}
