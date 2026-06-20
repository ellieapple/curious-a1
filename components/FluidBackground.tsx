"use client";

import { useEffect } from "react";

// WebGL fallback shader — runs when WebGPU is unavailable
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;
const FRAG = `
precision mediump float;
uniform float u_time; uniform vec2 u_res; uniform vec2 u_mouse; uniform float u_ms;
float hash(vec2 p){p=fract(p*vec2(234.34,435.35));p+=dot(p,p+34.23);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.1;a*=0.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 m=u_mouse/u_res; float md=length(uv-m);
  vec2 stir=(uv-m)*u_ms*0.35/(md*md+0.06);
  vec2 p=uv*2.8+vec2(u_time*0.045,u_time*0.028)+stir;
  float q0=fbm(p),q1=fbm(p+vec2(5.2,1.3));
  float r0=fbm(p+1.6*vec2(q0,q1)+vec2(1.7,9.2)+u_time*0.035);
  float r1=fbm(p+1.6*vec2(q0,q1)+vec2(8.3,2.8)-u_time*0.035);
  float f=fbm(p+1.9*vec2(r0,r1));
  vec3 bg=vec3(0.027,0.027,0.039),purple=vec3(0.13,0.20,0.72),blue=vec3(0.10,0.46,0.88),terra=vec3(0.58,0.28,0.82),teal=vec3(0.10,0.64,0.68);
  float t1=smoothstep(0.20,0.60,f),t2=smoothstep(0.48,0.88,f),t3=smoothstep(0.30,0.70,fbm(p+vec2(3.1,7.4)+u_time*0.02));
  vec3 col=bg;
  col=mix(col,purple,t1*0.82); col=mix(col,blue,t1*t2*0.70);
  col=mix(col,terra,(1.0-t1)*t2*0.55); col=mix(col,teal,t3*(1.0-t2)*0.40);
  gl_FragColor=vec4(col,1.0);
}
`;

function runWebGLFallback(canvas: HTMLCanvasElement): () => void {
  const gl = (canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!gl) return () => {};

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src); gl.compileShader(sh); return sh;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog); gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTime=gl.getUniformLocation(prog,"u_time"), uRes=gl.getUniformLocation(prog,"u_res"),
        uMouse=gl.getUniformLocation(prog,"u_mouse"), uMs=gl.getUniformLocation(prog,"u_ms");

  let mx=0, my=0, ms=0, animId=0;
  const resize = () => {
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    gl.viewport(0,0,canvas.width,canvas.height);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const onMM = (e: MouseEvent)  => { mx=e.clientX; my=canvas.height-e.clientY; ms=1; };
  const onTM = (e: TouchEvent)  => { const t=e.touches[0]; mx=t.clientX; my=canvas.height-t.clientY; ms=1; };
  const onEnd = () => { ms=0; };
  window.addEventListener("mousemove",  onMM, { passive: true });
  window.addEventListener("mouseup",    onEnd, { passive: true });
  window.addEventListener("touchmove",  onTM, { passive: true });
  window.addEventListener("touchend",   onEnd, { passive: true });

  const start = performance.now();
  const render = () => {
    ms *= 0.95;
    const t = (performance.now()-start)/1000;
    gl.uniform1f(uTime,t); gl.uniform2f(uRes,canvas.width,canvas.height);
    gl.uniform2f(uMouse,mx,my); gl.uniform1f(uMs,ms);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    animId = requestAnimationFrame(render);
  };
  render();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onMM);
    window.removeEventListener("mouseup",   onEnd);
    window.removeEventListener("touchmove", onTM);
    window.removeEventListener("touchend",  onEnd);
  };
}

export default function FluidBackground() {
  useEffect(() => {
    const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (REDUCED) return;

    // ── Inject the real WebGPU fluid simulation ──
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/a1-fluid-bg.js";
    document.body.appendChild(script);

    // ── If WebGPU fails, a1-fluid-bg.js calls markStatic() which adds
    //    "bg-static" to body and hides the canvas. Detect that and run
    //    the WebGL fallback instead. ──
    let glCleanup: (() => void) | null = null;
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("bg-static")) {
        observer.disconnect();
        document.body.classList.remove("bg-static");
        canvas.style.display = "";
        glCleanup = runWebGLFallback(canvas);
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      glCleanup?.();
      if (document.body.contains(script)) document.body.removeChild(script);
      document.body.classList.remove("bg-static", "bg-live");
    };
  }, []);

  return null;
}
