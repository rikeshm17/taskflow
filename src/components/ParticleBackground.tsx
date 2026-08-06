import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
  color: string;
}

const PALETTE = ["#997A80", "#A4B5C3", "#EAE0DC", "#731211", "#FC563C"];

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const particleCount = Math.min(120, Math.floor(window.innerWidth / 10));

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      vz: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }));

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function handleResize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    function animate() {
      const c = ctx;
      c.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const particles = particlesRef.current;

      particles.forEach((p) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200;
          p.vx += (dx / dist) * force * 0.02;
          p.vy += (dy / dist) * force * 0.02;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.vz *= 0.99;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const scale = 1 + (p.z / 1000) * 0.5;
        const drawSize = p.size * scale;
        const drawOpacity = p.opacity * (1 - p.z / 1500);

        c.beginPath();
        c.arc(p.x, p.y, Math.max(0.5, drawSize), 0, Math.PI * 2);
        c.fillStyle = p.color;
        c.globalAlpha = Math.max(0, Math.min(1, drawOpacity));
        c.fill();

        c.beginPath();
        c.arc(p.x, p.y, Math.max(1, drawSize * 3), 0, Math.PI * 2);
        const grad = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, drawSize * 3));
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = grad;
        c.globalAlpha = Math.max(0, drawOpacity * 0.15);
        c.fill();
      });

      c.globalAlpha = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15;
            c.beginPath();
            c.moveTo(a.x, a.y);
            c.lineTo(b.x, b.y);
            c.strokeStyle = `rgba(153, 122, 128, ${alpha})`;
            c.lineWidth = 0.5;
            c.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      aria-hidden="true"
    />
  );
}

export default ParticleBackground;
