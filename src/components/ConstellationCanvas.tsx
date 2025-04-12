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
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "#000000"
          }
        },
        fullScreen: {
          enable: false
        },
        particles: {
          number: {
            value: 60,
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
            speed: 0.6,
            direction: "none",
            random: true,
            outModes: "out"
          },
          links: {
            enable: true,
            distance: 130,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
          }
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          }
        },
        detectRetina: true
      }}
    />
  );
}