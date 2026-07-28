"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const dotX   = useMotionValue(0);
  const dotY   = useMotionValue(0);
  const ringX  = useSpring(dotX, { stiffness: 120, damping: 22, mass: 0.5 });
  const ringY  = useSpring(dotY, { stiffness: 120, damping: 22, mass: 0.5 });

  const isHovering = useRef(false);

  useEffect(() => {
    // Masquer le curseur natif
    document.documentElement.style.cursor = "none";

    const moveCursor = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const onMouseEnterLink = () => { isHovering.current = true; };
    const onMouseLeaveLink = () => { isHovering.current = false; };

    window.addEventListener("mousemove", moveCursor);

    // Agrandir le ring sur les éléments cliquables
    const interactives = document.querySelectorAll("a, button, [data-cursor-hover]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterLink);
      el.addEventListener("mouseleave", onMouseLeaveLink);
    });

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", moveCursor);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterLink);
        el.removeEventListener("mouseleave", onMouseLeaveLink);
      });
    };
  }, [dotX, dotY]);

  return (
    <>
      {/* Point central */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#C4998C",
          }}
        />
      </motion.div>

      {/* Ring extérieur avec spring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(196,153,140,0.5)",
          }}
        />
      </motion.div>
    </>
  );
}
