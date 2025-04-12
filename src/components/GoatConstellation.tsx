"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function GoatConstellation() {
  const goatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (goatRef.current) {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 15; // subtle horizontal shift
        const y = (e.clientY / innerHeight - 0.5) * 15; // subtle vertical shift
        goatRef.current.style.transform = `translate(-50%, -50%) rotateX(${y}deg) rotateY(${x}deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={goatRef}
      className="pointer-events-none fixed top-1/2 left-1/2 z-0"
      style={{
        transform: "translate(-50%, -50%)",
        transition: "transform 0.1s ease-out",
      }}
    >
      <Image
        src="/goat_constellation_outline.svg"
        alt="Goat Constellation"
        width={300}
        height={300}
        className="opacity-30"
        priority
      />
    </div>
  );
}
