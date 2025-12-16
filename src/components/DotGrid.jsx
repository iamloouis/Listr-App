import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

// Helper: Throttle function to improve performance
const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

// Helper: Convert Hex to RGB
function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const DotGrid = ({
  dotSize = 2, // Made dots slightly smaller for elegance
  gap = 40,    // Increased gap for a cleaner look
  baseColor = '#333333', // Dark gray for background
  activeColor = '#6600FF', // Your Purple Brand Color
  proximity = 200, // Distance to react to mouse
  shockRadius = 200,
  shockStrength = 20, // How far dots push away
  returnDuration = 1, // How fast they bounce back
  className = '',
  style
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  // Create the circle drawing path
  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;
    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  // Build the Grid
  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width) / (gap));
    const rows = Math.floor((height) / (gap));
    
    // Center the grid
    const startX = (width - (cols * gap)) / 2;
    const startY = (height - (rows * gap)) / 2;

    const dots = [];
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        const cx = startX + x * gap;
        const cy = startY + y * gap;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, animating: false });
      }
    }
    dotsRef.current = dots;
  }, [gap]);

  // Animation Loop (The Canvas Draw)
  useEffect(() => {
    if (!circlePath) return;
    let rafId;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = mouseRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        
        // Calculate distance from mouse to dot
        const dx = px - dot.cx;
        const dy = py - dot.cy;
        const dsq = dx * dx + dy * dy;

        // Color Logic
        let style = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          // Interpolate color
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

  // Resize Handler
  useEffect(() => {
    buildGrid();
    const handleResize = throttle(buildGrid, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [buildGrid]);

  // Mouse Interaction Logic
  useEffect(() => {
    const onMove = e => {
      const rect = wrapperRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my };

      // Physics Calculation
      dotsRef.current.forEach(dot => {
        const dx = mx - dot.cx;
        const dy = my - dot.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < proximity) {
          // Calculate angle
          const angle = Math.atan2(dy, dx);
          // Push away based on how close mouse is
          const force = (proximity - dist) / proximity; 
          const push = shockStrength * force;

          const targetX = -Math.cos(angle) * push;
          const targetY = -Math.sin(angle) * push;

          // Animate to new position
          gsap.to(dot, {
            xOffset: targetX,
            yOffset: targetY,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
          });
        } else if (dot.xOffset !== 0 || dot.yOffset !== 0) {
           // Return to center if mouse is far
           gsap.to(dot, {
            xOffset: 0,
            yOffset: 0,
            duration: returnDuration,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto"
          });
        }
      });
    };

    const throttledMove = throttle(onMove, 16);
    window.addEventListener('mousemove', throttledMove);
    return () => window.removeEventListener('mousemove', throttledMove);
  }, [proximity, shockStrength, returnDuration]);

  return (
    <section className={`absolute inset-0 -z-10 h-full w-full overflow-hidden ${className}`} style={style}>
      <div ref={wrapperRef} className="w-full h-full">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    </section>
  );
};

export default DotGrid;