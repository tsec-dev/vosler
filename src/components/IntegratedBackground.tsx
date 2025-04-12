"use client";

import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import Image from "next/image";

// Define goat positions with more variety
const GOATS = [
  { top: "15%", left: "10%", size: 100, delay: 0, opacity: 0.12 },
  { top: "25%", left: "75%", size: 120, delay: 2, opacity: 0.15 },
  { top: "65%", left: "20%", size: 90, delay: 4, opacity: 0.1 },
  { top: "70%", left: "80%", size: 130, delay: 6, opacity: 0.13 },
  { top: "40%", left: "50%", size: 140, delay: 8, opacity: 0.08 },
];

export default function IntegratedBackground() {
  // Particles initialization function
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // State for animated stars (separate from particles)
  const [stars, setStars] = useState<Array<{x: number, y: number, size: number, opacity: number}>>([]);
  
  // Create random stars on first render
  useEffect(() => {
    const randomStars = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7
    }));
    setStars(randomStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base particle system for constellation lines */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#000000"
            }
          },
          fullScreen: {
            enable: true,
            zIndex: -1
          },
          particles: {
            number: {
              value: 45, // Reduced for better performance
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: "#ffffff"
            },
            shape: {
              type: "circle"
            },
            opacity: {
              value: 0.5,
              random: true
            },
            size: {
              value: 2,
              random: true
            },
            move: {
              enable: true,
              speed: 0.4, // Slowed down for more subtle movement
              direction: "none",
              random: true,
              outModes: "out"
            },
            links: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.3,
              width: 1
            }
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab" // Changed to "grab" for more subtle interaction
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 150,
                links: {
                  opacity: 0.5
                }
              }
            }
          },
          detectRetina: true
        }}
      />

      {/* Additional decorative stars with pulsing animation */}
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
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      {/* Floating goat constellations */}
      {GOATS.map((goat, idx) => (
        <div
          key={`goat-${idx}`}
          className="absolute animate-float-slow pointer-events-none"
          style={{
            top: goat.top,
            left: goat.left,
            opacity: goat.opacity,
            animationDelay: `${goat.delay}s`,
            animationDuration: "20s"
          }}
        >
          <Image
            src="/image.png"
            alt="Goat Constellation"
            width={goat.size}
            height={goat.size}
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}