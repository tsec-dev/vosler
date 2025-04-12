"use client";

import { useEffect, useRef } from "react";

const stars = [
  { x: 100, y: 130 },
  { x: 140, y: 100 },
  { x: 160, y: 60 },
  { x: 200, y: 80 },
  { x: 240, y: 100 },
  { x: 270, y: 150 },
  { x: 250, y: 200 },
  { x: 200, y: 220 },
  { x: 180, y: 260 },
  { x: 150, y: 280 },
  { x: 130, y: 230 },
  { x: 110, y: 200 },
  { x: 90, y: 170 },
];

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [10, 11], [11, 12], [12, 0]
];

export default function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // Glow stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x + width / 3, star.y + height / 3, 3, 0, 2 * Math.PI);
        ctx.shadowColor = "cyan";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "white";
        ctx.fill();
      });

      // Connect stars
      ctx.strokeStyle = "rgba(173,216,230,0.6)";
      ctx.lineWidth = 1;
      connections.forEach(([i, j]) => {
        const a = stars[i];
        const b = stars[j];
        ctx.beginPath();
        ctx.moveTo(a.x + width / 3, a.y + height / 3);
        ctx.lineTo(b.x + width / 3, b.y + height / 3);
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
