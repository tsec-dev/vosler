// src/components/FloatingGoats.tsx
"use client";

import Image from "next/image";

const goats = [
  { top: "10%", left: "5%", size: 100, delay: "delay-0" },
  { top: "20%", left: "80%", size: 120, delay: "delay-500" },
  { top: "60%", left: "10%", size: 90, delay: "delay-1000" },
  { top: "75%", left: "70%", size: 130, delay: "delay-2000" },
];

export default function FloatingGoats() {
  return (
    <>
      {goats.map((goat, idx) => (
        <div
          key={idx}
          className={`absolute opacity-10 animate-float-slow ${goat.delay}`}
          style={{
            top: goat.top,
            left: goat.left,
            width: goat.size,
            height: goat.size,
          }}
        >
          <Image
            src="/image.png" // Your goat outline file in /public
            alt="Floating Goat"
            width={goat.size}
            height={goat.size}
            className="object-contain"
          />
        </div>
      ))}
    </>
  );
}
