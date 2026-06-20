"use client";

import { useEffect } from "react";

export default function FluidBackground() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/a1-fluid-bg.js";
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <canvas id="bg-canvas" aria-hidden="true" />
      <div className="scrim" aria-hidden="true" />
    </>
  );
}
