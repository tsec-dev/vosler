"use client";

import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import Image from "next/image";

// Define goat positions with more variety
const GOATS = [
  { top: "15%", left: "10%", size: 100, delay: 0, opacity: 0.3 },
  { top: "25%", left: "75%", size: 120, delay: 2, opacity: 0.35 },
  { top: "65%", left: "20%", size: 90, delay: 4, opacity: 0.3 },
  { top: "70%", left: "80%", size: 130, delay: 6, opacity: 0.33 },
  { top: "40%", left: "50%", size: 140, delay: 8, opacity: 0.28 },
];

export default function IntegratedBackground() {
  // Particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // State for decorative stars
  const [stars, setStars] = useState<
    Array<{ x: number; y: number; size: number; opacity: number }>
  >([]);

  // State for mouse offset for parallax effect
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Generate random stars on first render
  useEffect(() => {
    const randomStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      opacity: 0.4 + Math.random() * 0.6,
    }));
    setStars(randomStars);
  }, []);

  // Mousemove listener for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = (e.clientX - window.innerWidth / 2) * 0.05;
      const offsetY = (e.clientY - window.innerHeight / 2) * 0.05;
      console.log("Mouse Offset:", offsetX, offsetY); // Debug logging
      setMouseOffset({ x: offsetX, y: offsetY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Append animation styles if not already present
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      @keyframes floatSideways {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(15px); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .floating {
        animation: float 15s ease-in-out infinite;
      }
      .floating-sideways {
        animation: floatSideways 12s ease-in-out infinite;
      }
      .floating-2 {
        animation: float 15s ease-in-out infinite, floatSideways 17s ease-in-out infinite;
        animation-delay: 2s, 0s;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Particles background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#000000" } },
          fullScreen: { enable: true, zIndex: -1 },
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.6, random: true },
            size: { value: 2.5, random: true },
            move: {
              enable: true,
              speed: 0.3,
              direction: "none",
              random: true,
              outModes: "out",
            },
            links: {
              enable: true,
              distance: 180,
              color: "#ffffff",
              opacity: 0.4,
              width: 1.2,
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              resize: true,
            },
            modes: { grab: { distance: 180, links: { opacity: 0.7 } } },
          },
          detectRetina: true,
        }}
      />

      {/* Mouse-reactive wrapper */}
      <div
        style={{
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Decorative stars */}
        {stars.map((star, idx) => (
          <div
            key={`star-${idx}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${star.y}%`,
              left: `${star.x}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${3 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Goat elements */}
        {GOATS.map((goat, idx) => {
          const animationClass =
            idx % 3 === 0
              ? "floating"
              : idx % 3 === 1
              ? "floating-sideways"
              : "floating-2";

          return (
            <div
              key={`goat-${idx}`}
              className={`absolute ${animationClass} pointer-events-none z-20`}
              style={{
                top: goat.top,
                left: goat.left,
                opacity: goat.opacity,
                animationDelay: `${goat.delay}s`,
              }}
            >
              <Image
                src="/image.png"
                alt={`Goat Constellation ${idx}`}
                width={goat.size}
                height={goat.size}
                className="object-contain"
                unoptimized={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
