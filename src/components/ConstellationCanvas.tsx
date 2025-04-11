"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";


export default function ConstellationCanvas() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        particles: {
          number: { value: 35 },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.6 },
          size: { value: 2 },
          move: {
            enable: true,
            speed: 0.4,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          links: {
            enable: true,
            distance: 120,
            color: "#aaa",
            opacity: 0.4,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            repulse: { distance: 70, duration: 0.4 },
          },
        },
      }}
    />
  );
}
