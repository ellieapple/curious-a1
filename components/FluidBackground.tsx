"use client";

import { useEffect } from "react";

export default function FluidBackground() {
  useEffect(() => {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    // /a1-fluid-bg.js self-selects the right background and handles its own
    // fallbacks: WebGPU fluid → canvas-2D plume trail → (reduced motion) the
    // static CSS gradient. No WebGL noise fallback — it didn't match the design.
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/a1-fluid-bg.js";
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
      document.body.classList.remove("bg-static", "bg-live", "bg-gpu-tainted");
    };
  }, []);

  return null;
}
