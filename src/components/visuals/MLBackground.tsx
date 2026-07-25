"use client";

import { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

interface Edge {
  a: number;
  b: number;
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

    // Mouse Parallax State
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetRotX = (mouseY / window.innerHeight - 0.5) * 0.35;
      targetRotY = (mouseX / window.innerWidth - 0.5) * 0.35;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ==========================================
    // 3D GEODESIC ICOSAHEDRON VERTICES & EDGES
    // ==========================================
    const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio (~1.618)
    const scale = 140;

    const rawIcosahedronVertices: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];

    const icosahedronVertices: Point3D[] = rawIcosahedronVertices.map(([x, y, z]) => ({
      x: x * scale,
      y: y * scale,
      z: z * scale,
      vx: 0, vy: 0, vz: 0,
    }));

    // Find edges by distance (~2 * scale)
    const icosahedronEdges: Edge[] = [];
    const edgeDistSq = (2 * scale) * (2 * scale) * 1.15;
    for (let i = 0; i < icosahedronVertices.length; i++) {
      for (let j = i + 1; j < icosahedronVertices.length; j++) {
        const dx = icosahedronVertices[i].x - icosahedronVertices[j].x;
        const dy = icosahedronVertices[i].y - icosahedronVertices[j].y;
        const dz = icosahedronVertices[i].z - icosahedronVertices[j].z;
        if (dx * dx + dy * dy + dz * dz <= edgeDistSq) {
          icosahedronEdges.push({ a: i, b: j });
        }
      }
    }

    // ==========================================
    // 3D NEURAL CONSTELLATION NODES
    // ==========================================
    const particleCount = 36;
    const particles: Point3D[] = [];
    const bound = 280;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * bound * 2.2,
        y: (Math.random() - 0.5) * bound * 2.2,
        z: (Math.random() - 0.5) * bound * 2.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
      });
    }

    // ==========================================
    // RESIZE & CANVAS SCALE SOLVER
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
    // 3D PERSPECTIVE PROJECTION TRANSFORMER
    // ==========================================
    const project = (x: number, y: number, z: number, rotX: number, rotY: number, rotZ: number) => {
      // 1. Rotate Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // 2. Rotate X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // 3. Rotate Z
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const x3 = x1 * cosZ - y2 * sinZ;
      const y3 = x1 * sinZ + y2 * cosZ;

      // 4. Perspective Projection
      const focalLength = 450;
      const cameraZ = 520;
      const perspectiveScale = focalLength / (focalLength + z2 + cameraZ);

      const screenX = window.innerWidth * 0.5 + x3 * perspectiveScale;
      const screenY = window.innerHeight * 0.48 + y3 * perspectiveScale;

      return {
        sx: screenX,
        sy: screenY,
        scale: perspectiveScale,
        z: z2,
      };
    };

    // ==========================================
    // ANIMATION RENDER LOOP
    // ==========================================
    const animate = (timestamp: number) => {
      if (!isVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      if (timestamp - lastFrame < 30) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrame = timestamp;
      time += 0.012;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Smooth Mouse Parallax Damping
      currentRotX += (targetRotX - currentRotX) * 0.04;
      currentRotY += (targetRotY - currentRotY) * 0.04;

      const baseRotX = time * 0.18 + currentRotX;
      const baseRotY = time * 0.25 + currentRotY;
      const baseRotZ = Math.sin(time * 0.15) * 0.12;

      const isDark = document.documentElement.classList.contains("dark");

      // Soft theme colors with non-intrusive opacities
      const greenStroke = isDark ? "rgba(34, 197, 94, " : "rgba(22, 101, 52, ";
      const cyanStroke = isDark ? "rgba(6, 182, 212, " : "rgba(8, 145, 178, ";

      // ------------------------------------------
      // 1. DRAW UNDULATING 3D SPATIAL HORIZON GRID
      // ------------------------------------------
      const gridRows = 8;
      const gridCols = 16;
      const gridSpacing = 85;
      const gridY = 220;

      ctx.beginPath();
      ctx.lineWidth = 1;
      for (let r = 0; r <= gridRows; r++) {
        const zPos = (r - gridRows / 2) * gridSpacing;
        for (let c = 0; c <= gridCols; c++) {
          const xPos = (c - gridCols / 2) * gridSpacing;
          const yPos = gridY + Math.sin(xPos * 0.015 + time * 1.8) * 12 + Math.cos(zPos * 0.015 + time * 1.2) * 10;
          
          const p = project(xPos, yPos, zPos, currentRotX * 0.5, currentRotY * 0.5, 0);

          // Horizontal grid line
          if (c < gridCols) {
            const nextX = (c + 1 - gridCols / 2) * gridSpacing;
            const nextY = gridY + Math.sin(nextX * 0.015 + time * 1.8) * 12 + Math.cos(zPos * 0.015 + time * 1.2) * 10;
            const np = project(nextX, nextY, zPos, currentRotX * 0.5, currentRotY * 0.5, 0);
            
            ctx.strokeStyle = `${greenStroke}${Math.max(0.02, 0.08 * p.scale)}`;
            ctx.moveTo(p.sx, p.sy);
            ctx.lineTo(np.sx, np.sy);
          }

          // Vertical grid line
          if (r < gridRows) {
            const nextZ = (r + 1 - gridRows / 2) * gridSpacing;
            const nextY = gridY + Math.sin(xPos * 0.015 + time * 1.8) * 12 + Math.cos(nextZ * 0.015 + time * 1.2) * 10;
            const np = project(xPos, nextY, nextZ, currentRotX * 0.5, currentRotY * 0.5, 0);
            
            ctx.strokeStyle = `${greenStroke}${Math.max(0.02, 0.06 * p.scale)}`;
            ctx.moveTo(p.sx, p.sy);
            ctx.lineTo(np.sx, np.sy);
          }
        }
      }
      ctx.stroke();

      // ------------------------------------------
      // 2. DRAW 3D CONSTELLATION NODES & LINKS
      // ------------------------------------------
      // Update particle positions
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (Math.abs(p.x) > bound) p.vx *= -1;
        if (Math.abs(p.y) > bound) p.vy *= -1;
        if (Math.abs(p.z) > bound) p.vz *= -1;
      });

      const projectedParticles = particles.map((p) => project(p.x, p.y, p.z, baseRotX * 0.4, baseRotY * 0.4, baseRotZ));

      // Draw Proximity Energy Links between 3D nodes
      const maxConnectDistSq = 150 * 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dz = particles[i].z - particles[j].z;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxConnectDistSq) {
            const alpha = (1 - distSq / maxConnectDistSq) * 0.14 * projectedParticles[i].scale;
            ctx.beginPath();
            ctx.strokeStyle = i % 3 === 0 ? `${cyanStroke}${alpha})` : `${greenStroke}${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(projectedParticles[i].sx, projectedParticles[i].sy);
            ctx.lineTo(projectedParticles[j].sx, projectedParticles[j].sy);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Nodes
      projectedParticles.forEach((pp, i) => {
        const nodeRadius = Math.max(1, 2.5 * pp.scale);
        const nodeAlpha = Math.min(0.4, 0.25 * pp.scale);

        ctx.beginPath();
        ctx.arc(pp.sx, pp.sy, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? `${cyanStroke}${nodeAlpha})` : `${greenStroke}${nodeAlpha})`;
        ctx.fill();
      });

      // ------------------------------------------
      // 3. DRAW 3D ICOSAHEDRON GEODESIC CORE
      // ------------------------------------------
      const projectedIcosa = icosahedronVertices.map((v) =>
        project(v.x, v.y, v.z, baseRotX, baseRotY, baseRotZ)
      );

      // Render 3D Edges with Depth Glow
      icosahedronEdges.forEach((edge) => {
        const p1 = projectedIcosa[edge.a];
        const p2 = projectedIcosa[edge.b];

        const avgScale = (p1.scale + p2.scale) * 0.5;
        const edgeAlpha = Math.min(0.28, 0.16 * avgScale);

        ctx.beginPath();
        ctx.strokeStyle = `${greenStroke}${edgeAlpha})`;
        ctx.lineWidth = 1.25;
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.stroke();
      });

      // Render 3D Vertex Nodes
      projectedIcosa.forEach((p, idx) => {
        const radius = Math.max(1.5, 3.2 * p.scale);
        const alpha = Math.min(0.5, 0.3 * p.scale);

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
