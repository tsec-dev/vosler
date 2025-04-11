"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function ConstellationCanvas() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      className="absolute inset-0"
      options={{
        fullScreen: false,
        background: {
          color: { value: "#000000" }
        },
        particles: {
          number: { value: 60 },
          color: { value: "#ffffff" },
          links: {
            enable: true,
            color: "#ffffff",
            distance: 120,
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 1.2,
            outModes: { default: "bounce" }
          },
          size: { value: 2 },
          opacity: { value: 0.5 }
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            resize: true
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 }
          }
        }
      }}
    />
  );
}
