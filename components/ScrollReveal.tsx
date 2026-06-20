"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const docEl = document.documentElement;
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || reduce) return;

    docEl.classList.add("js-anim");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );

    requestAnimationFrame(() => {
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
        else io.observe(el);
      });
    });

    const failsafe = setTimeout(() => docEl.classList.remove("js-anim"), 3000);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return null;
}
