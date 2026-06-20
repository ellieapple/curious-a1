"use client";

import { useEffect } from "react";

export default function PageAnimations() {
  useEffect(() => {
    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const NS = "http://www.w3.org/2000/svg";

    // ── Year ──
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // ── Entrance reveal animations ──
    const docEl = document.documentElement;
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    let revealIo: IntersectionObserver | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const failsafeTimer = { id: null as any };
    if ("IntersectionObserver" in window && !REDUCED) {
      docEl.classList.add("js-anim");
      revealIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) { en.target.classList.add("in"); revealIo?.unobserve(en.target); }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -5% 0px" }
      );
      requestAnimationFrame(() => {
        reveals.forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
          else revealIo?.observe(el);
        });
      });
      failsafeTimer.id = setTimeout(() => { docEl.classList.remove("js-anim"); }, 3000);
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
        e.setAttribute("d", d);
        e.setAttribute("class", "topo-path");
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

    // ── Scroll-triggered draw rules (.js-draw) ──
    const drawTargets = document.querySelectorAll<HTMLElement>(".js-draw");
    let drawObs: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && drawTargets.length) {
      drawObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) { en.target.classList.add("drawn"); drawObs?.unobserve(en.target); }
          });
        },
        { threshold: 0.3 }
      );
      drawTargets.forEach((t) => drawObs!.observe(t));
    } else {
      drawTargets.forEach((t) => t.classList.add("drawn"));
    }

    // ── City map sketch ──
    const cssvg = document.getElementById("city-svg") as SVGSVGElement | null;
    if (cssvg) {
      const cityEls: (SVGElement & { _l: number })[] = [];

      function ap(d: string, sw: number, op: number) {
        const e = document.createElementNS(NS, "path") as SVGPathElement & { _l: number };
        e.setAttribute("d", d);
        e.setAttribute("class", "city-path");
        e.style.strokeWidth = String(sw);
        e.style.opacity = String(op);
        cssvg!.appendChild(e);
        const l = e.getTotalLength() || 300;
        e.style.strokeDasharray = String(l);
        e.style.strokeDashoffset = String(l);
        e._l = l;
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
        e.style.strokeDasharray = String(l);
        e.style.strokeDashoffset = String(l);
        e._l = l;
        cityEls.push(e);
      }
      function ac(cx: number, cy: number, r: number, sw: number, op: number) {
        const e = document.createElementNS(NS, "circle") as SVGCircleElement & { _l: number };
        e.setAttribute("cx", String(cx)); e.setAttribute("cy", String(cy)); e.setAttribute("r", String(r));
        e.setAttribute("fill", "none"); e.setAttribute("stroke", "var(--paper)");
        e.style.strokeWidth = String(sw); e.style.opacity = String(op);
        cssvg!.appendChild(e);
        const l = 2 * Math.PI * r;
        e.style.strokeDasharray = String(l);
        e.style.strokeDashoffset = String(l);
        e._l = l;
        cityEls.push(e);
      }

      ap("M800,200 L1590,200", 1.2, 0.13);
      ap("M800,200 L10,200",   1.2, 0.13);
      ap("M800,200 L800,12",   1.2, 0.13);
      ap("M800,200 L800,388",  1.2, 0.13);
      ap("M800,200 C870,162 1050,105 1340,48",  1.0, 0.11);
      ap("M800,200 C870,242 1050,310 1340,368", 1.0, 0.11);
      ap("M800,200 C730,162  550,105  260,48",  1.0, 0.11);
      ap("M800,200 C730,242  550,310  260,368", 1.0, 0.11);
      ac(800, 200, 28, 0.9, 0.14);

      ap("M1000,200 L1000,132", 0.7, 0.09);
      ap("M1000,200 L1000,268", 0.7, 0.09);
      ap("M1200,200 L1200,138", 0.7, 0.09);
      ap("M1200,200 L1200,262", 0.7, 0.09);
      ap("M1400,200 L1400,143", 0.7, 0.09);
      ap("M1400,200 L1400,257", 0.7, 0.09);
      ap("M1000,132 L1200,138", 0.6, 0.08);
      ap("M1000,268 L1200,262", 0.6, 0.08);
      ap("M1200,138 L1400,143", 0.6, 0.08);
      ap("M1200,262 L1400,257", 0.6, 0.08);

      ap("M600,200 L600,132", 0.7, 0.09);
      ap("M600,200 L600,268", 0.7, 0.09);
      ap("M400,200 L400,138", 0.7, 0.09);
      ap("M400,200 L400,262", 0.7, 0.09);
      ap("M200,200 L200,143", 0.7, 0.09);
      ap("M200,200 L200,257", 0.7, 0.09);
      ap("M600,132 L400,138", 0.6, 0.08);
      ap("M600,268 L400,262", 0.6, 0.08);
      ap("M400,138 L200,143", 0.6, 0.08);
      ap("M400,262 L200,257", 0.6, 0.08);

      ap("M800,105 L738,105", 0.6, 0.08);
      ap("M800,105 L862,105", 0.6, 0.08);
      ap("M800,44  L738,44",  0.6, 0.08);
      ap("M800,44  L862,44",  0.6, 0.08);
      ap("M738,44  L738,105", 0.6, 0.08);
      ap("M862,44  L862,105", 0.6, 0.08);

      ap("M1018,168 L1055,148 L1055,118", 0.6, 0.08);
      ap("M1215,138 L1252,118",           0.6, 0.08);
      ap("M582,168  L545,148  L545,118",  0.6, 0.08);
      ap("M385,138  L348,118",            0.6, 0.08);
      ap("M1018,232 L1055,252 L1055,282", 0.6, 0.08);
      ap("M1215,262 L1252,278",           0.6, 0.08);
      ap("M582,232  L545,252  L545,282",  0.6, 0.08);
      ap("M385,262  L348,278",            0.6, 0.08);

      ar(1010, 140, 58, 44, 2, 0.5, 0.07);
      ar(1072, 140, 54, 44, 2, 0.5, 0.07);
      ar(1010, 216, 58, 42, 2, 0.5, 0.07);
      ar(1072, 216, 54, 42, 2, 0.5, 0.07);
      ar(1210, 145, 62, 42, 2, 0.5, 0.07);
      ar(1210, 218, 62, 40, 2, 0.5, 0.07);
      ar(1276, 145, 54, 42, 2, 0.5, 0.07);
      ar(1276, 218, 54, 40, 2, 0.5, 0.07);

      ar(534, 140, 58, 44, 2, 0.5, 0.07);
      ar(474, 140, 58, 44, 2, 0.5, 0.07);
      ar(534, 216, 58, 42, 2, 0.5, 0.07);
      ar(474, 216, 58, 42, 2, 0.5, 0.07);
      ar(318, 145, 62, 42, 2, 0.5, 0.07);
      ar(254, 145, 60, 42, 2, 0.5, 0.07);
      ar(318, 218, 62, 40, 2, 0.5, 0.07);
      ar(254, 218, 60, 40, 2, 0.5, 0.07);

      ar(744,  48, 52, 44, 2, 0.5, 0.07);
      ar(806,  48, 52, 44, 2, 0.5, 0.07);
      ar(1058, 120, 50, 34, 2, 0.5, 0.06);
      ar( 548, 120, 50, 34, 2, 0.5, 0.06);
      ar(1058, 262, 50, 34, 2, 0.5, 0.06);
      ar( 548, 262, 50, 34, 2, 0.5, 0.06);

      ([
        [1000,200],[1200,200],[1400,200],[600,200],[400,200],[200,200],
        [800,105],[800,44],[1000,132],[1000,268],[1200,138],[1200,262],
        [600,132],[600,268],[400,138],[400,262]
      ] as [number, number][]).forEach(([cx, cy]) => { ac(cx, cy, 3, 0.7, 0.14); });

      ac(800, 200, 10, 1.1, 0.22);
      ac(800, 200,  3, 1.5, 0.30);

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
      } else {
        sketch();
      }
    }

    return () => {
      clearTimeout(failsafeTimer.id);
      revealIo?.disconnect();
      drawObs?.disconnect();
    };
  }, []);

  return null;
}
