/* ParticleField — Three.js hero particle layer (home.md §1).
 * ~350 pts (mobile ÷3), additive blending, one draw call, upward drift,
 * noise sway, pointer repulsion (displacement lerp decay), paused offscreen.
 * Isolated dedicated component — no Framer Motion inside (react-dev rule). */
import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';

const BASE_COLOR = new THREE.Color('#A8B0C4');
const ACCENTS = ['#FF7A45', '#45C8FF', '#FFD60A'].map((c) => new THREE.Color(c));

const VERT = `
attribute float aSize;
attribute vec4 aColor;
varying vec4 vColor;
uniform float uPixelRatio;
void main() {
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio;
}
`;

const FRAG = `
varying vec4 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d);
  gl_FragColor = vec4(vColor.rgb, vColor.a * a);
}
`;

interface Particle {
  bx: number; // base x
  by: number; // base y
  vy: number; // upward speed px/s
  phase: number;
  swayAmp: number;
  dx: number; // displacement (lerp decay)
  dy: number;
}

function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const COUNT = coarse ? 117 : 350;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 4);
    const particles: Particle[] = [];

    let w = parent.clientWidth;
    let h = parent.clientHeight;

    for (let i = 0; i < COUNT; i++) {
      let color = BASE_COLOR;
      let alpha = 0.3;
      if (Math.random() > 0.6) {
        color = ACCENTS[Math.floor(Math.random() * 3)];
        alpha = 0.5;
      }
      colors[i * 4] = color.r;
      colors[i * 4 + 1] = color.g;
      colors[i * 4 + 2] = color.b;
      colors[i * 4 + 3] = alpha;
      sizes[i] = 1 + Math.random() * 2; // 1–3px
      particles.push({
        bx: (Math.random() - 0.5) * w,
        by: (Math.random() - 0.5) * h,
        vy: 2 + Math.random() * 4, // 2–6 px/s upward
        phase: Math.random() * Math.PI * 2,
        swayAmp: 4 + Math.random() * 8,
        dx: 0,
        dy: 0,
      });
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 4));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } },
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const applySize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
    };
    applySize();

    const pointer = { x: -9999, y: -9999 };
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left - w / 2;
      pointer.y = -(e.clientY - rect.top - h / 2);
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    parent.addEventListener('pointermove', onPointer, { passive: true });
    parent.addEventListener('pointerleave', onLeave, { passive: true });

    const ro = new ResizeObserver(applySize);
    ro.observe(parent);

    let raf = 0;
    let visible = true;
    const RADIUS = 120;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = now / 1000;
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        // pointer repulsion — displacement with lerp decay (never mutate base)
        const px = p.bx + Math.sin(t * 0.4 + p.phase) * p.swayAmp + p.dx;
        const pyBase = p.by + t * p.vy;
        const py = (((pyBase + h / 2) % (h + 40)) + h + 40) % (h + 40) - h / 2 - 20 + p.dy;
        const ddx = px - pointer.x;
        const ddy = py - pointer.y;
        const dist = Math.hypot(ddx, ddy);
        if (dist < RADIUS && dist > 0.01) {
          const f = ((RADIUS - dist) / RADIUS) * 1.6;
          p.dx += (ddx / dist) * f;
          p.dy += (ddy / dist) * f;
        }
        p.dx *= 0.95;
        p.dy *= 0.95;
        positions[i * 3] = px;
        positions[i * 3 + 1] = py;
        positions[i * 3 + 2] = 0;
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(parent);

    if (reduced) {
      // static frame — no drift loop
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = particles[i].bx;
        positions[i * 3 + 1] = particles[i].by;
        positions[i * 3 + 2] = 0;
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      parent.removeEventListener('pointermove', onPointer);
      parent.removeEventListener('pointerleave', onLeave);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
      aria-hidden
    />
  );
}

export default memo(ParticleField);
