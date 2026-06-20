"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function PageAnimations() {
  useEffect(() => {
    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const NS = "http://www.w3.org/2000/svg";
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // ── Year ──
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // ── Lenis smooth scroll (desktop only — touch scroll handles itself) ──
    let lenis: Lenis | null = null;
    if (!REDUCED && !isMobile) {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis!.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    if (!REDUCED) {
      if (isMobile) {
        // ── Mobile: IntersectionObserver + CSS class system ──
        // More reliable than GSAP ScrollTrigger on iOS dynamic viewport.
        const docEl = document.documentElement;
        docEl.classList.add("js-anim");

        // Stamp --i on stagger children so the CSS delay cascade works
        document.querySelectorAll<HTMLElement>(".stagger").forEach((container) => {
          Array.from(container.children).forEach((child, i) => {
            (child as HTMLElement).style.setProperty("--i", String(i));
          });
        });

        // Observe .reveal and .stagger containers
        const revealIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (en.isIntersecting) {
                en.target.classList.add("in");
                revealIo.unobserve(en.target);
              }
            });
          },
          { threshold: 0, rootMargin: "0px 0px -6% 0px" }
        );

        requestAnimationFrame(() => {
          document.querySelectorAll<HTMLElement>(".reveal, .stagger").forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
              el.classList.add("in");
            } else {
              revealIo.observe(el);
            }
          });
        });

        // .js-draw scroll trigger on mobile
        const drawIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (en.isIntersecting) {
                en.target.classList.add("drawn");
                drawIo.unobserve(en.target);
              }
            });
          },
          { threshold: 0.3 }
        );
        document.querySelectorAll<HTMLElement>(".js-draw").forEach((el) => drawIo.observe(el));

        // Failsafe: never leave content hidden after 3s
        setTimeout(() => docEl.classList.remove("js-anim"), 3000);

      } else {
        // ── Desktop: GSAP ScrollTrigger ──

        // Section heads — fade up + scale
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 48,
            scale: 0.97,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        });

        // Stagger grids — cards cascade up with scale
        gsap.utils.toArray<HTMLElement>(".stagger:not(.from-left):not(.clip-up)").forEach((container) => {
          gsap.from(Array.from(container.children), {
            opacity: 0,
            y: 44,
            scale: 0.92,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          });
        });

        // From-left — terrain rows slide in from left
        gsap.utils.toArray<HTMLElement>(".stagger.from-left").forEach((container) => {
          gsap.from(Array.from(container.children), {
            opacity: 0,
            x: -48,
            scale: 0.97,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: container,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          });
        });

        // Clip-up — FAQ items wipe from bottom
        gsap.utils.toArray<HTMLElement>(".stagger.clip-up").forEach((container) => {
          gsap.from(Array.from(container.children), {
            opacity: 0,
            y: 20,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: container,
              start: "top 84%",
              toggleActions: "play none none none",
            },
          });
        });

        // s-rule draw lines
        document.querySelectorAll<HTMLElement>(".js-draw").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 80%",
            onEnter: () => el.classList.add("drawn"),
          });
        });

        // ── Background map sketches per section (desktop only, hidden via CSS on mobile) ──
        buildSectionSketches(NS, REDUCED);
      }

    } else {
      // reduced-motion: reveal everything immediately
      document.querySelectorAll<HTMLElement>(".js-draw").forEach((el) => el.classList.add("drawn"));
      buildSectionSketches(NS, true);
    }

    // ── Section background map sketches ──
    function buildSectionSketches(NS: string, reduced: boolean) {
      type SketchDef = {
        sectionId: string;
        pos: { top?: string; bottom?: string; left?: string; right?: string };
        size: [number, number];
        paths: { d: string; sw: number; op: number; dashed?: boolean }[];
      };

      const sketches: SketchDef[] = [
        // Services — compass rose (top-right, larger + more visible)
        {
          sectionId: "services",
          pos: { top: "3rem", right: "2rem" },
          size: [160, 160],
          paths: [
            { d: "M80,8 L80,152", sw: 0.7, op: 0.12 },
            { d: "M8,80 L152,80", sw: 0.7, op: 0.12 },
            { d: "M28,28 L132,132", sw: 0.6, op: 0.09 },
            { d: "M132,28 L28,132", sw: 0.6, op: 0.09 },
            { d: "M80,80 L80,18 L85,30 M80,18 L75,30", sw: 0.9, op: 0.22 },
            { d: "M80,80 L80,142 L85,130 M80,142 L75,130", sw: 0.7, op: 0.14 },
            { d: "M80,80 L18,80 L30,75 M18,80 L30,85", sw: 0.7, op: 0.14 },
            { d: "M80,80 L142,80 L130,75 M142,80 L130,85", sw: 0.7, op: 0.14 },
            { d: "M80,80 m-32,0 a32,32 0 1,1 64,0 a32,32 0 1,1 -64,0", sw: 0.6, op: 0.10 },
            { d: "M80,80 m-14,0 a14,14 0 1,1 28,0 a14,14 0 1,1 -28,0", sw: 0.7, op: 0.14 },
            { d: "M80,80 m-3,0 a3,3 0 1,1 6,0 a3,3 0 1,1 -6,0", sw: 1.2, op: 0.28 },
            { d: "M80,48 L84,56 M80,48 L76,56 M112,80 L104,76 M112,80 L104,84", sw: 0.5, op: 0.10 },
          ],
        },
        // Terrains — elevation profile (bottom-left, more prominent)
        {
          sectionId: "terrains",
          pos: { bottom: "2rem", left: "0" },
          size: [380, 110],
          paths: [
            { d: "M0,95 L35,95 L60,58 L85,70 L120,32 L155,50 L188,18 L222,40 L255,62 L288,45 L320,64 L380,64", sw: 1.0, op: 0.18 },
            { d: "M0,105 L35,105 L60,76 L85,84 L120,56 L155,66 L188,42 L222,58 L255,74 L288,62 L320,78 L380,78", sw: 0.6, op: 0.10 },
            { d: "M0,108 L380,108", sw: 0.6, op: 0.12 },
            { d: "M120,32 L120,95 M188,18 L188,95 M255,62 L255,95", sw: 0.5, op: 0.09 },
            { d: "M120,32 m-3,0 a3,3 0 1,1 6,0 a3,3 0 1,1 -6,0 M188,18 m-3,0 a3,3 0 1,1 6,0 a3,3 0 1,1 -6,0 M255,62 m-3,0 a3,3 0 1,1 6,0 a3,3 0 1,1 -6,0", sw: 0.7, op: 0.16 },
            { d: "M8,40 L14,40 M8,44 L11,44 M8,52 L14,52 M8,56 L11,56 M8,64 L14,64 M8,68 L11,68", sw: 0.5, op: 0.09 },
          ],
        },
        // Approach — route with waypoints (top-left, expanded)
        {
          sectionId: "approach",
          pos: { top: "4rem", left: "0" },
          size: [260, 200],
          paths: [
            { d: "M24,176 C48,148 72,108 100,94 C126,82 138,70 172,46 C196,30 218,20 248,16", sw: 1.0, op: 0.18 },
            { d: "M24,176 m-6,0 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0", sw: 0.8, op: 0.22 },
            { d: "M100,94 m-5,0 a5,5 0 1,1 10,0 a5,5 0 1,1 -10,0", sw: 0.7, op: 0.18 },
            { d: "M172,46 m-5,0 a5,5 0 1,1 10,0 a5,5 0 1,1 -10,0", sw: 0.7, op: 0.18 },
            { d: "M248,16 m-6,0 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0", sw: 1.0, op: 0.26 },
            { d: "M60,108 L74,108 M60,112 L67,112 M60,118 L74,118", sw: 0.5, op: 0.10 },
            { d: "M138,62 L152,62 M138,66 L145,66 M138,72 L152,72", sw: 0.5, op: 0.10 },
            { d: "M24,176 L100,94 M100,94 L172,46 M172,46 L248,16", sw: 0.3, op: 0.06, dashed: true },
          ],
        },
        // FAQ — survey grid (top-right, larger)
        {
          sectionId: "faq",
          pos: { top: "3rem", right: "0" },
          size: [220, 220],
          paths: [
            { d: "M20,20 L200,20 L200,200 L20,200 Z", sw: 0.6, op: 0.12 },
            { d: "M20,80 L200,80 M20,140 L200,140", sw: 0.5, op: 0.09 },
            { d: "M80,20 L80,200 M140,20 L140,200", sw: 0.5, op: 0.09 },
            { d: "M8,8 L20,20 M212,8 L200,20 M8,212 L20,200 M212,212 L200,200", sw: 0.6, op: 0.11 },
            { d: "M110,110 m-8,0 a8,8 0 1,1 16,0 a8,8 0 1,1 -16,0", sw: 0.8, op: 0.18 },
            { d: "M110,110 L136,84 M110,110 L142,110 M110,110 L110,142 M110,110 L84,134", sw: 0.5, op: 0.10 },
            { d: "M50,50 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M170,50 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M50,170 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M170,170 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0", sw: 0.6, op: 0.12 },
          ],
        },
      ];

      sketches.forEach(({ sectionId, pos, size, paths }) => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const wrapper = document.createElement("div");
        wrapper.className = "section-map";
        Object.assign(wrapper.style, {
          width: `${size[0]}px`,
          height: `${size[1]}px`,
          ...pos,
        });

        const svg = document.createElementNS(NS, "svg") as SVGSVGElement;
        svg.setAttribute("viewBox", `0 0 ${size[0]} ${size[1]}`);
        svg.setAttribute("width", String(size[0]));
        svg.setAttribute("height", String(size[1]));
        svg.setAttribute("xmlns", NS);

        const strokeEls: (SVGPathElement & { _l: number })[] = [];
        paths.forEach(({ d, sw, op, dashed }) => {
          const p = document.createElementNS(NS, "path") as SVGPathElement & { _l: number };
          p.setAttribute("d", d);
          p.setAttribute("class", "map-stroke");
          p.style.strokeWidth = String(sw);
          p.style.opacity = String(op);
          if (dashed) p.style.strokeDasharray = "4 6";
          svg.appendChild(p);
          const l = p.getTotalLength() || 100;
          if (!reduced && !dashed) {
            p.style.strokeDasharray = String(l);
            p.style.strokeDashoffset = String(l);
          }
          p._l = dashed ? 0 : l;
          strokeEls.push(p);
        });

        wrapper.appendChild(svg);
        section.style.position = "relative";
        section.appendChild(wrapper);

        if (reduced) {
          wrapper.classList.add("visible");
          return;
        }

        ScrollTrigger.create({
          trigger: section,
          start: "top 75%",
          onEnter: () => {
            wrapper.classList.add("visible");
            let delay = 0;
            strokeEls.forEach((e) => {
              if (e._l === 0) return;
              const dur = Math.min(2.2, Math.max(0.4, e._l / 280));
              e.style.transition = `stroke-dashoffset ${dur.toFixed(2)}s cubic-bezier(.45,0,.25,1) ${delay.toFixed(2)}s`;
              delay += dur * 0.35;
              requestAnimationFrame(() => { requestAnimationFrame(() => { e.style.strokeDashoffset = "0"; }); });
            });
          },
        });
      });

      // ── Per-section gradient glows ──
      const sectionGlows: { id: string; style: Partial<CSSStyleDeclaration> }[] = [
        { id: "services",  style: { width: "520px", height: "520px", top: "-120px", right: "-80px",  background: "radial-gradient(circle, rgba(108,50,158,0.18) 0%, transparent 70%)" } },
        { id: "terrains",  style: { width: "480px", height: "480px", bottom: "-80px", left: "-60px", background: "radial-gradient(circle, rgba(42,78,162,0.16) 0%, transparent 70%)" } },
        { id: "approach",  style: { width: "500px", height: "500px", top: "-100px", left: "-60px",   background: "radial-gradient(circle, rgba(172,70,70,0.14) 0%, transparent 70%)" } },
        { id: "faq",       style: { width: "460px", height: "460px", top: "-80px",  right: "-60px",  background: "radial-gradient(circle, rgba(48,96,138,0.16) 0%, transparent 70%)" } },
      ];
      sectionGlows.forEach(({ id, style }) => {
        const sec = document.getElementById(id);
        if (!sec) return;
        const glow = document.createElement("div");
        glow.className = "section-glow";
        Object.assign(glow.style, style);
        sec.appendChild(glow);
        ScrollTrigger.create({
          trigger: sec,
          start: "top 80%",
          onEnter: () => glow.classList.add("visible"),
        });
      });
    }

    // ── Topographic contours ──
    let _s = 7919;
    function rng() {
      _s = (_s * 1664525 + 1013904223) & 0x7fffffff;
      return _s / 0x7fffffff;
    }
    function makePath(cx: number, cy: number, rx: number, ry: number, pts: number, noise: number) {
      const a: [number, number][] = [];
      for (let i = 0; i < pts; i++) {
        const ang = (i / pts) * Math.PI * 2 - Math.PI / 2;
        const jt = 1 + (rng() - 0.5) * noise;
        a.push([cx + rx * jt * Math.cos(ang), cy + ry * jt * Math.sin(ang)]);
      }
      const n = a.length;
      let d = `M${a[0][0].toFixed(1)} ${a[0][1].toFixed(1)}`;
      for (let j = 0; j < n; j++) {
        const p0 = a[(j - 1 + n) % n], p1 = a[j];
        const p2 = a[(j + 1) % n], p3 = a[(j + 2) % n];
        d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
      return d + "Z";
    }

    // Force hero-geo visible — CSS animation may not fire on some browsers
    const heroGeo = document.querySelector<HTMLElement>(".hero-geo");
    if (heroGeo) {
      setTimeout(() => {
        heroGeo.style.opacity = "1";
        heroGeo.style.animation = "none";
      }, 2600);
    }

    const topoSvg = document.getElementById("topo-svg") as SVGSVGElement | null;
    if (topoSvg) {
      const CX = 335, CY = 215;
      const LVLS = [
        { rx: 255, ry: 192, pts: 14, n: 0.22, op: 0.10 },
        { rx: 196, ry: 148, pts: 13, n: 0.20, op: 0.14 },
        { rx: 145, ry: 110, pts: 12, n: 0.19, op: 0.20 },
        { rx: 102, ry:  77, pts: 11, n: 0.17, op: 0.28 },
        { rx:  66, ry:  50, pts: 10, n: 0.15, op: 0.38 },
        { rx:  36, ry:  27, pts:  9, n: 0.13, op: 0.50 },
      ];
      const ACC = (getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#e8c8a0").trim();
      const heroEls: (SVGPathElement & { _l: number })[] = [];

      function hadd(d: string, sw: number | null, op: number, stroke?: string) {
        const e = document.createElementNS(NS, "path") as SVGPathElement & { _l: number };
        e.setAttribute("d", d); e.setAttribute("class", "topo-path");
        if (sw) e.style.strokeWidth = String(sw);
        e.style.opacity = String(op);
        if (stroke) e.style.stroke = stroke;
        topoSvg!.appendChild(e);
        const l = e.getTotalLength() || 400;
        if (!REDUCED) { e.style.strokeDasharray = String(l); e.style.strokeDashoffset = String(l); }
        e._l = l;
        heroEls.push(e);
      }

      LVLS.forEach((lv) => { hadd(makePath(CX, CY, lv.rx, lv.ry, lv.pts, lv.n), null, lv.op); });
      hadd("M278,206 L304,176 L327,193 L356,168 L390,189 L416,172", 0.9, 0.30);
      hadd("M158,360 C232,330 268,352 318,314 C366,278 408,302 472,262", 0.8, 0.20);
      hadd("M176,98 L184,86 M180,92 L505,352 M501,358 L509,346", 0.7, 0.16);
      hadd("M331,201 L339,209 M339,201 L331,209", 1.0, 0.46, ACC);
      hadd("M246,156 L254,164 M254,156 L246,164", 1.0, 0.40, ACC);
      hadd("M426,266 L434,274 M434,266 L426,274", 1.0, 0.40, ACC);
      hadd("M548,400 L548,420 L528,420", 0.7, 0.30);
      hadd("M548,44 L548,24 L528,24", 0.7, 0.26);

      if (!REDUCED) {
        let t = 0.6;
        heroEls.forEach((e) => {
          const dur = Math.min(2.0, Math.max(0.5, e._l / 340));
          e.style.transition = `stroke-dashoffset ${dur.toFixed(2)}s cubic-bezier(.45,0,.25,1) ${t.toFixed(2)}s`;
          t += dur * 0.52;
          (function (x: typeof e) {
            requestAnimationFrame(() => { requestAnimationFrame(() => { x.style.strokeDashoffset = "0"; }); });
          }(e));
        });
      }
    }

    // ── City map sketch ──
    const cssvg = document.getElementById("city-svg") as SVGSVGElement | null;
    if (cssvg) {
      const cityEls: (SVGElement & { _l: number })[] = [];
      function ap(d: string, sw: number, op: number) {
        const e = document.createElementNS(NS, "path") as SVGPathElement & { _l: number };
        e.setAttribute("d", d); e.setAttribute("class", "city-path");
        e.style.strokeWidth = String(sw); e.style.opacity = String(op);
        cssvg!.appendChild(e);
        const l = e.getTotalLength() || 300;
        e.style.strokeDasharray = String(l); e.style.strokeDashoffset = String(l); e._l = l;
        cityEls.push(e);
      }
      function ar(x: number, y: number, w: number, h: number, r: number, sw: number, op: number) {
        const e = document.createElementNS(NS, "rect") as SVGRectElement & { _l: number };
        e.setAttribute("x", String(x)); e.setAttribute("y", String(y));
        e.setAttribute("width", String(w)); e.setAttribute("height", String(h));
        if (r) e.setAttribute("rx", String(r));
        e.setAttribute("fill", "none"); e.setAttribute("stroke", "var(--paper)");
        e.style.strokeWidth = String(sw); e.style.opacity = String(op);
        cssvg!.appendChild(e);
        const l = 2 * (w + h);
        e.style.strokeDasharray = String(l); e.style.strokeDashoffset = String(l); e._l = l;
        cityEls.push(e);
      }
      function ac(cx: number, cy: number, r: number, sw: number, op: number) {
        const e = document.createElementNS(NS, "circle") as SVGCircleElement & { _l: number };
        e.setAttribute("cx", String(cx)); e.setAttribute("cy", String(cy)); e.setAttribute("r", String(r));
        e.setAttribute("fill", "none"); e.setAttribute("stroke", "var(--paper)");
        e.style.strokeWidth = String(sw); e.style.opacity = String(op);
        cssvg!.appendChild(e);
        const l = 2 * Math.PI * r;
        e.style.strokeDasharray = String(l); e.style.strokeDashoffset = String(l); e._l = l;
        cityEls.push(e);
      }

      ap("M800,200 L1590,200",1.2,0.13); ap("M800,200 L10,200",1.2,0.13);
      ap("M800,200 L800,12",1.2,0.13);   ap("M800,200 L800,388",1.2,0.13);
      ap("M800,200 C870,162 1050,105 1340,48",1.0,0.11);
      ap("M800,200 C870,242 1050,310 1340,368",1.0,0.11);
      ap("M800,200 C730,162  550,105  260,48",1.0,0.11);
      ap("M800,200 C730,242  550,310  260,368",1.0,0.11);
      ac(800,200,28,0.9,0.14);
      ap("M1000,200 L1000,132",0.7,0.09); ap("M1000,200 L1000,268",0.7,0.09);
      ap("M1200,200 L1200,138",0.7,0.09); ap("M1200,200 L1200,262",0.7,0.09);
      ap("M1400,200 L1400,143",0.7,0.09); ap("M1400,200 L1400,257",0.7,0.09);
      ap("M1000,132 L1200,138",0.6,0.08); ap("M1000,268 L1200,262",0.6,0.08);
      ap("M1200,138 L1400,143",0.6,0.08); ap("M1200,262 L1400,257",0.6,0.08);
      ap("M600,200 L600,132",0.7,0.09);   ap("M600,200 L600,268",0.7,0.09);
      ap("M400,200 L400,138",0.7,0.09);   ap("M400,200 L400,262",0.7,0.09);
      ap("M200,200 L200,143",0.7,0.09);   ap("M200,200 L200,257",0.7,0.09);
      ap("M600,132 L400,138",0.6,0.08);   ap("M600,268 L400,262",0.6,0.08);
      ap("M400,138 L200,143",0.6,0.08);   ap("M400,262 L200,257",0.6,0.08);
      ap("M800,105 L738,105",0.6,0.08);   ap("M800,105 L862,105",0.6,0.08);
      ap("M800,44  L738,44",0.6,0.08);    ap("M800,44  L862,44",0.6,0.08);
      ap("M738,44  L738,105",0.6,0.08);   ap("M862,44  L862,105",0.6,0.08);
      ap("M1018,168 L1055,148 L1055,118",0.6,0.08); ap("M1215,138 L1252,118",0.6,0.08);
      ap("M582,168  L545,148  L545,118",0.6,0.08);  ap("M385,138  L348,118",0.6,0.08);
      ap("M1018,232 L1055,252 L1055,282",0.6,0.08); ap("M1215,262 L1252,278",0.6,0.08);
      ap("M582,232  L545,252  L545,282",0.6,0.08);  ap("M385,262  L348,278",0.6,0.08);
      ar(1010,140,58,44,2,0.5,0.07); ar(1072,140,54,44,2,0.5,0.07);
      ar(1010,216,58,42,2,0.5,0.07); ar(1072,216,54,42,2,0.5,0.07);
      ar(1210,145,62,42,2,0.5,0.07); ar(1210,218,62,40,2,0.5,0.07);
      ar(1276,145,54,42,2,0.5,0.07); ar(1276,218,54,40,2,0.5,0.07);
      ar(534,140,58,44,2,0.5,0.07);  ar(474,140,58,44,2,0.5,0.07);
      ar(534,216,58,42,2,0.5,0.07);  ar(474,216,58,42,2,0.5,0.07);
      ar(318,145,62,42,2,0.5,0.07);  ar(254,145,60,42,2,0.5,0.07);
      ar(318,218,62,40,2,0.5,0.07);  ar(254,218,60,40,2,0.5,0.07);
      ar(744,48,52,44,2,0.5,0.07);   ar(806,48,52,44,2,0.5,0.07);
      ar(1058,120,50,34,2,0.5,0.06); ar(548,120,50,34,2,0.5,0.06);
      ar(1058,262,50,34,2,0.5,0.06); ar(548,262,50,34,2,0.5,0.06);
      ([
        [1000,200],[1200,200],[1400,200],[600,200],[400,200],[200,200],
        [800,105],[800,44],[1000,132],[1000,268],[1200,138],[1200,262],
        [600,132],[600,268],[400,138],[400,262]
      ] as [number,number][]).forEach(([cx,cy]) => ac(cx,cy,3,0.7,0.14));
      ac(800,200,10,1.1,0.22); ac(800,200,3,1.5,0.30);

      let cityDrawn = false;
      function sketch() {
        if (cityDrawn) return; cityDrawn = true;
        if (REDUCED) { cityEls.forEach((e) => { e.style.strokeDashoffset = "0"; }); return; }
        let delay = 0;
        cityEls.forEach((e) => {
          const dur = Math.min(1.4, Math.max(0.25, e._l / 420));
          e.style.transition = `stroke-dashoffset ${dur.toFixed(2)}s cubic-bezier(.4,0,.2,1) ${delay.toFixed(2)}s`;
          delay += dur * 0.21;
          (function (el: typeof e) {
            requestAnimationFrame(() => { requestAnimationFrame(() => { el.style.strokeDashoffset = "0"; }); });
          }(e));
        });
      }

      const contactEl = document.getElementById("contact");
      let cio: IntersectionObserver | null = null;
      if ("IntersectionObserver" in window && contactEl) {
        cio = new IntersectionObserver(
          (entries) => { if (entries[0].isIntersecting) { sketch(); cio?.disconnect(); } },
          { threshold: 0.15 }
        );
        cio.observe(contactEl);
      } else { sketch(); }
    }

    return () => {
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
