"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  splitBy?: "word" | "char";
}

export default function AnimatedText({
  text,
  tag: Tag = "h2",
  className,
  style,
  delay = 0,
  stagger = 0.04,
  splitBy = "word",
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const items = splitBy === "char"
    ? text.split("")
    : text.split(" ");

  const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const itemVariants: Variants = {
    hidden:  { opacity: 0, y: "110%", skewY: 3 },
    visible: {
      opacity: 1,
      y: "0%",
      skewY: 0,
      transition: { duration: 0.75, ease: EASE },
    },
  };

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ display: "inline", overflow: "hidden" }}
        aria-hidden
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden" }}
          >
            <motion.span
              variants={itemVariants}
              style={{ display: "inline-block" }}
            >
              {item}
              {splitBy === "word" && i < items.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
