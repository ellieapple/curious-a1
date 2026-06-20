"use client";

import { useEffect } from "react";

export default function FluidBackground() {
  useEffect(() => {
    const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── WebGPU path ──
    if (!REDUCED && "gpu" in navigator) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "/a1-fluid-bg.js";
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) document.body.removeChild(script);
      };
    }

    // ── Canvas 2D animated gradient fallback (all other browsers) ──
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Four animated blobs: purple, blue, terracotta, teal
    const blobs = [
      { px: 0.20, py: 0.26, ax: 0.12, ay: 0.09, fx: 0.52, fy: 0.43, r: 0.62, rgb: "108,50,158", a: 0.42 },
      { px: 0.78, py: 0.28, ax: 0.09, ay: 0.13, fx: 0.63, fy: 0.71, r: 0.58, rgb: "42,78,162", a: 0.36 },
      { px: 0.56, py: 0.86, ax: 0.08, ay: 0.07, fx: 0.81, fy: 0.57, r: 0.60, rgb: "172,70,70", a: 0.34 },
      { px: 0.38, py: 0.50, ax: 0.07, ay: 0.08, fx: 0.38, fy: 0.32, r: 0.44, rgb: "48,96,138", a: 0.22 },
    ];

    const animate = () => {
      t += 0.0022;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#07070a";
      ctx.fillRect(0, 0, w, h);

      blobs.forEach(({ px, py, ax, ay, fx, fy, r, rgb, a }) => {
        const x = (px + ax * Math.sin(t * fx)) * w;
        const y = (py + ay * Math.cos(t * fy)) * h;
        const radius = r * Math.max(w, h);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, `rgba(${rgb},${a})`);
        grad.addColorStop(0.45, `rgba(${rgb},${+(a * 0.38).toFixed(3)})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      ctx.globalCompositeOperation = "source-over";
      animId = requestAnimationFrame(animate);
    };

    if (!REDUCED) {
      animate();
    } else {
      // Static gradient for reduced-motion
      ctx.fillStyle = "#07070a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const g = ctx.createRadialGradient(
        canvas.width * 0.25, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7
      );
      g.addColorStop(0, "rgba(108,50,158,0.35)");
      g.addColorStop(0.5, "rgba(42,78,162,0.2)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return null;
}
