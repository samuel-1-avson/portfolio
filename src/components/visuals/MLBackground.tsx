"use client";

import { useEffect, useRef } from "react";

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  hueOffset: number;
}

export default function MLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let animationId: number;
    let time = 0;
    let lastFrame = 0;
    let isVisible = !document.hidden;

    // Mouse Tracking & Gravitational Ripple
    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ==========================================
    // 3D CONSTELLATION PARTICLES INITIALIZATION
    // ==========================================
    const particleCount = 65;
    const particles: Particle3D[] = [];
    const boundX = window.innerWidth * 0.7;
    const boundY = window.innerHeight * 0.7;
    const boundZ = 350;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * boundX * 2,
        y: (Math.random() - 0.5) * boundY * 2,
        z: (Math.random() - 0.5) * boundZ * 2,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.2 + 1.2,
        hueOffset: Math.random() * 60,
      });
    }

    // ==========================================
    // CANVAS RESIZE & DENSITY SCALER
    // ==========================================
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ==========================================
    // 3D PERSPECTIVE PROJECTION SOLVER
    // ==========================================
    const project = (x: number, y: number, z: number, rotX: number, rotY: number) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const focalLength = 500;
      const cameraZ = 550;
      const scale = focalLength / (focalLength + z2 + cameraZ);

      const screenX = window.innerWidth * 0.5 + x1 * scale;
      const screenY = window.innerHeight * 0.5 + y2 * scale;

      return {
        sx: screenX,
        sy: screenY,
        scale,
        z: z2,
      };
    };

    // ==========================================
    // MAIN RENDER LOOP (60 FPS FLUID MOTION)
    // ==========================================
    const animate = (timestamp: number) => {
      if (!isVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      if (timestamp - lastFrame < 24) {
        // Limit to smooth ~40-60 FPS
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrame = timestamp;
      time += 0.022; // Active fluid motion step

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Interpolate mouse smoothly
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const cameraRotX = (mouseY / window.innerHeight - 0.5) * 0.25 + Math.sin(time * 0.3) * 0.08;
      const cameraRotY = (mouseX / window.innerWidth - 0.5) * 0.25 + Math.cos(time * 0.25) * 0.08;

      const isDark = document.documentElement.classList.contains("dark");
      const greenStroke = isDark ? "rgba(34, 197, 94, " : "rgba(22, 101, 52, ";
      const cyanStroke = isDark ? "rgba(6, 182, 212, " : "rgba(8, 145, 178, ";

      // ------------------------------------------
      // 1. DYNAMIC 3D SINE-WAVE TERRAIN SURFACE
      // ------------------------------------------
      const cols = 24;
      const rows = 14;
      const stepX = (window.innerWidth * 1.2) / cols;
      const stepY = (window.innerHeight * 1.1) / rows;
      const startX = -window.innerWidth * 0.6;
      const startY = -window.innerHeight * 0.4;

      const gridPoints: { sx: number; sy: number; scale: number }[][] = [];

      for (let r = 0; r <= rows; r++) {
        gridPoints[r] = [];
        for (let c = 0; c <= cols; c++) {
          const worldX = startX + c * stepX;
          const worldY = startY + r * stepY;

          // 3D Harmonic Wave Equation
          const waveZ =
            Math.sin(worldX * 0.003 + time * 1.4) * 45 +
            Math.cos(worldY * 0.004 + time * 1.6) * 35 +
            Math.sin((worldX + worldY) * 0.0025 + time * 2.0) * 25;

          gridPoints[r][c] = project(worldX, worldY + 140, waveZ, cameraRotX, cameraRotY);
        }
      }

      // Render Longitudinal Wave Curves
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const pt = gridPoints[r][c];
          const alpha = Math.max(0.03, Math.min(0.22, 0.14 * pt.scale));
          ctx.strokeStyle = r % 2 === 0 ? `${greenStroke}${alpha})` : `${cyanStroke}${alpha})`;
          ctx.lineWidth = 1.2;

          if (c === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
      }

      // Render Transversal Cross-Grid Lines
      for (let c = 0; c <= cols; c += 2) {
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const pt = gridPoints[r][c];
          const alpha = Math.max(0.02, Math.min(0.18, 0.1 * pt.scale));
          ctx.strokeStyle = `${greenStroke}${alpha})`;
          ctx.lineWidth = 1;

          if (r === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
      }

      // ------------------------------------------
      // 2. FLOWING 3D CONSTELLATION NODE STREAM
      // ------------------------------------------
      const projectedParticles = particles.map((p) => {
        // Move particles continuously
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Boundary Wrap-Around for Infinite Motion
        const currentBoundX = window.innerWidth * 0.65;
        const currentBoundY = window.innerHeight * 0.65;

        if (p.x > currentBoundX) p.x = -currentBoundX;
        if (p.x < -currentBoundX) p.x = currentBoundX;
        if (p.y > currentBoundY) p.y = -currentBoundY;
        if (p.y < -currentBoundY) p.y = currentBoundY;
        if (p.z > boundZ) p.z = -boundZ;
        if (p.z < -boundZ) p.z = boundZ;

        const proj = project(p.x, p.y, p.z, cameraRotX, cameraRotY);

        // Mouse Gravitational Deflection
        const dx = mouseX - proj.sx;
        const dy = mouseY - proj.sy;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 180 && distToMouse > 5) {
          const force = (180 - distToMouse) / 180;
          p.x -= (dx / distToMouse) * force * 1.5;
          p.y -= (dy / distToMouse) * force * 1.5;
        }

        return { ...proj, size: p.size, hueOffset: p.hueOffset };
      });

      // Draw Proximity Connections between Nodes
      const connectDistSq = 160 * 160;
      for (let i = 0; i < projectedParticles.length; i++) {
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p1 = projectedParticles[i];
          const p2 = projectedParticles[j];
          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectDistSq) {
            const alpha = (1 - distSq / connectDistSq) * 0.25 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.strokeStyle = i % 3 === 0 ? `${cyanStroke}${alpha})` : `${greenStroke}${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.stroke();
          }
        }
      }

      // Draw Glowing Particle Nodes
      projectedParticles.forEach((p, idx) => {
        const radius = Math.max(1.2, p.size * p.scale);
        const alpha = Math.min(0.6, 0.35 * p.scale);

        // Glowing Outer Ring
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = idx % 3 === 0 ? `${cyanStroke}${alpha * 0.25})` : `${greenStroke}${alpha * 0.25})`;
        ctx.fill();

        // Solid Core Node
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = idx % 3 === 0 ? `${cyanStroke}${alpha})` : `${greenStroke}${alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    const visibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", visibilityChange);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
