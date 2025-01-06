"use client";

import { useEffect, useRef, useState } from "react";

export function ParallaxGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let currentPosition = 0;
    const smoothness = 0.1; // Lower = smoother

    const updatePosition = () => {
      const targetPosition = window.scrollY * 0.1;
      const delta = (targetPosition - currentPosition) * smoothness;
      currentPosition += delta;

      if (gridRef.current) {
        gridRef.current.style.transform = `translateY(${currentPosition}px)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="absolute top-0 left-0 w-full"
      style={{
        height: "300vh", // Make the grid taller than viewport
        backgroundImage: `
          linear-gradient(to right, rgb(228, 228, 231) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(228, 228, 231) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        backgroundRepeat: "repeat",
        opacity: 0.8,
        maskImage: `linear-gradient(to right,
          transparent,
          rgba(0, 0, 0, 0.1) 10%,
          rgba(0, 0, 0, 0.3) 20%,
          rgba(0, 0, 0, 0.6) 45%,
          rgba(0, 0, 0, 0.9) 60%,
          black 75%
        )`,
        WebkitMaskImage: `linear-gradient(to right,
          transparent,
          rgba(0, 0, 0, 0.1) 15%,
          rgba(0, 0, 0, 0.3) 50%,
          rgba(0, 0, 0, 0.6) 55%,
          rgba(0, 0, 0, 0.9) 60%,
          black 75%
        )`,
        transition: "transform 0.05s linear",
        willChange: "transform", // Optimizes performance
      }}
    />
  );
}
