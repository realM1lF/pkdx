/* useMapCamera — pan/zoom camera for the SVG transit map (maps.md §2.3).
 * drag pan (grab/grabbing) · wheel/pinch zoom 0.7–2.5× lerped toward cursor ·
 * out-expo tweens for flyTo/reset · direct <g> transform (GPU), never re-layout. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

export interface Camera {
  x: number;
  y: number;
  k: number;
}

interface Size {
  w: number;
  h: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const outExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export interface MapCamera {
  containerRef: React.RefObject<HTMLDivElement | null>;
  cam: Camera;
  size: Size;
  fitK: number;
  /** zoom relative to fit (1 = whole region visible) */
  relZoom: number;
  interacted: boolean;
  zoomBy: (factor: number) => void;
  resetView: () => void;
  /** center a world point at a relative zoom, out-expo tween */
  flyTo: (wx: number, wy: number, relZoom?: number, dur?: number) => void;
  /** center a world point keeping current zoom */
  centerOn: (wx: number, wy: number, dur?: number, offsetX?: number) => void;
  /** keyboard pan — shift the camera target by screen px */
  nudge: (dx: number, dy: number) => void;
  worldToScreen: (wx: number, wy: number) => { x: number; y: number };
  handlers: {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => void;
  };
  /** true briefly after a drag so node clicks are suppressed */
  suppressClickRef: React.RefObject<boolean>;
  dragging: boolean;
}

export function useMapCamera(vbW: number, vbH: number, resetKey: string): MapCamera {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });
  const [interacted, setInteracted] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fitK = useMemo(
    () => (size.w > 0 ? Math.min(size.w / vbW, size.h / vbH) * 0.94 : 1),
    [size.w, size.h, vbW, vbH],
  );
  const fitCam = useMemo<Camera>(
    () => ({ x: (size.w - vbW * fitK) / 2, y: (size.h - vbH * fitK) / 2, k: fitK }),
    [size.w, size.h, vbW, vbH, fitK],
  );

  const [cam, setCam] = useState<Camera>(fitCam);
  const camRef = useRef(cam);
  camRef.current = cam;
  const targetRef = useRef<Camera>(fitCam);
  const animRef = useRef<{ from: Camera; to: Camera; t0: number; dur: number } | null>(null);
  const rafRef = useRef(0);
  const suppressClickRef = useRef(false);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef<{ sx: number; sy: number; cam: Camera; moved: boolean } | null>(null);
  const pinchRef = useRef<{ dist: number; cam: Camera } | null>(null);

  /* measure container */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* refit when untouched or region changes */
  useEffect(() => {
    if (!interacted && size.w > 0) {
      setCam(fitCam);
      targetRef.current = fitCam;
    }
  }, [fitCam, interacted, size.w]);

  /* region switch → drop interaction, refit */
  useEffect(() => {
    setInteracted(false);
  }, [resetKey]);

  const loop = useCallback(() => {
    const anim = animRef.current;
    if (anim) {
      const t = Math.min(1, (performance.now() - anim.t0) / anim.dur);
      const e = outExpo(t);
      const c = {
        x: anim.from.x + (anim.to.x - anim.from.x) * e,
        y: anim.from.y + (anim.to.y - anim.from.y) * e,
        k: anim.from.k + (anim.to.k - anim.from.k) * e,
      };
      setCam(c);
      if (t >= 1) {
        animRef.current = null;
        targetRef.current = anim.to;
        return;
      }
    } else {
      const tg = targetRef.current;
      const prev = camRef.current;
      const nx = prev.x + (tg.x - prev.x) * 0.22;
      const ny = prev.y + (tg.y - prev.y) * 0.22;
      const nk = prev.k + (tg.k - prev.k) * 0.22;
      const done =
        Math.abs(nx - tg.x) < 0.4 && Math.abs(ny - tg.y) < 0.4 && Math.abs(nk - tg.k) < 0.002;
      setCam(done ? tg : { x: nx, y: ny, k: nk });
      if (done) return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const kick = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /* wheel zoom (non-passive to own the gesture) */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setInteracted(true);
      animRef.current = null;
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cur = targetRef.current;
      const kT = clamp(cur.k * Math.exp(-e.deltaY * 0.0012), fitK * 0.7, fitK * 2.5);
      const s = kT / cur.k;
      targetRef.current = { x: px - (px - cur.x) * s, y: py - (py - cur.y) * s, k: kT };
      kick();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [fitK, kick]);

  /* pointer drag + pinch */
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const el = containerRef.current;
      if (!el) return;
      suppressClickRef.current = false;
      /* Firefox retargets the follow-up click to the capture element (spec), which
         swallows node clicks — capture only for touch/pen, never for mouse. */
      if (e.pointerType !== 'mouse') el.setPointerCapture(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointersRef.current.size === 1) {
        dragRef.current = { sx: e.clientX, sy: e.clientY, cam: camRef.current, moved: false };
        setDragging(true);
      } else if (pointersRef.current.size === 2) {
        dragRef.current = null;
        const [p1, p2] = [...pointersRef.current.values()];
        pinchRef.current = { dist: Math.hypot(p2.x - p1.x, p2.y - p1.y), cam: camRef.current };
      }
    },
    [suppressClickRef],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const el = containerRef.current;
      if (!el) return;

      if (pinchRef.current && pointersRef.current.size === 2) {
        setInteracted(true);
        animRef.current = null;
        const [p1, p2] = [...pointersRef.current.values()];
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const rect = el.getBoundingClientRect();
        const mx = mid.x - rect.left;
        const my = mid.y - rect.top;
        const start = pinchRef.current;
        const kT = clamp(start.cam.k * (dist / (start.dist || 1)), fitK * 0.7, fitK * 2.5);
        const rel = kT / start.cam.k;
        const nc = { x: mx - (mx - start.cam.x) * rel, y: my - (my - start.cam.y) * rel, k: kT };
        targetRef.current = nc;
        setCam(nc);
        suppressClickRef.current = true;
        return;
      }

      const drag = dragRef.current;
      if (drag) {
        const dx = e.clientX - drag.sx;
        const dy = e.clientY - drag.sy;
        if (Math.abs(dx) + Math.abs(dy) > 4) {
          drag.moved = true;
          suppressClickRef.current = true;
          setInteracted(true);
          animRef.current = null;
        }
        if (drag.moved) {
          const nc = { x: drag.cam.x + dx, y: drag.cam.y + dy, k: drag.cam.k };
          targetRef.current = nc;
          setCam(nc);
        }
      }
    },
    [fitK, suppressClickRef],
  );

  const endPointer = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) {
      dragRef.current = null;
      setDragging(false);
      /* keep suppression until click event has fired */
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }, [suppressClickRef]);

  const animateTo = useCallback(
    (to: Camera, dur: number) => {
      animRef.current = { from: camRef.current, to, t0: performance.now(), dur };
      kick();
    },
    [kick],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      if (size.w === 0) return;
      setInteracted(true);
      const cur = targetRef.current;
      const kT = clamp(cur.k * factor, fitK * 0.7, fitK * 2.5);
      const s = kT / cur.k;
      const cx = size.w / 2;
      const cy = size.h / 2;
      animateTo({ x: cx - (cx - cur.x) * s, y: cy - (cy - cur.y) * s, k: kT }, 250);
    },
    [size, fitK, animateTo],
  );

  const resetView = useCallback(() => {
    animateTo(fitCam, 500);
  }, [animateTo, fitCam]);

  const flyTo = useCallback(
    (wx: number, wy: number, relZoom = 1.6, dur = 700) => {
      if (size.w === 0) return;
      setInteracted(true);
      const kT = clamp(fitK * relZoom, fitK * 0.7, fitK * 2.5);
      animateTo({ x: size.w / 2 - wx * kT, y: size.h / 2 - wy * kT, k: kT }, dur);
    },
    [size, fitK, animateTo],
  );

  const centerOn = useCallback(
    (wx: number, wy: number, dur = 500, offsetX = 0) => {
      if (size.w === 0) return;
      setInteracted(true);
      const k = targetRef.current.k;
      animateTo({ x: size.w / 2 + offsetX - wx * k, y: size.h / 2 - wy * k, k }, dur);
    },
    [size, animateTo],
  );

  const nudge = useCallback(
    (dx: number, dy: number) => {
      setInteracted(true);
      const cur = targetRef.current;
      targetRef.current = { x: cur.x + dx, y: cur.y + dy, k: cur.k };
      kick();
    },
    [kick],
  );

  const worldToScreen = useCallback(
    (wx: number, wy: number) => ({ x: wx * cam.k + cam.x, y: wy * cam.k + cam.y }),
    [cam],
  );

  return {
    containerRef,
    cam,
    size,
    fitK,
    relZoom: fitK > 0 ? cam.k / fitK : 1,
    interacted,
    zoomBy,
    resetView,
    flyTo,
    centerOn,
    nudge,
    worldToScreen,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
    },
    suppressClickRef,
    dragging,
  };
}
