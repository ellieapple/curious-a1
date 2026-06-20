"use client";

import { useEffect, useRef } from "react";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 24) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => {
    const links = linksRef.current;
    const toggle = toggleRef.current;
    if (!links || !toggle) return;
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  const closeMenu = () => {
    linksRef.current?.classList.remove("open");
    toggleRef.current?.classList.remove("open");
    toggleRef.current?.setAttribute("aria-expanded", "false");
    toggleRef.current?.setAttribute("aria-label", "Open menu");
  };

  return (
    <header className="site-header" id="header" ref={headerRef}>
      <div className="wrap nav">
        <a href="#top" className="brand" aria-label="A1 Marketing — home">
          <span className="mark">
            A<sup>1</sup>
          </span>
          <span className="word">Across Terrains</span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links" id="navLinks" ref={linksRef} onClick={closeMenu}>
            <li><a href="#services">Services</a></li>
            <li><a href="#terrains">Terrains</a></li>
            <li><a href="#approach">Approach</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li className="nav-cta">
              <a href="#contact" className="btn btn-primary">Start a project</a>
            </li>
          </ul>
        </nav>
        <button
          className="nav-toggle"
          id="navToggle"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="navLinks"
          ref={toggleRef}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
