"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface RevealImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  delay?: number;
  priority?: boolean;
  objectFit?: "cover" | "contain";
}

export default function RevealImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  delay = 0,
  priority = false,
  objectFit = "cover",
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <div
      ref={ref}
      className={containerClassName ?? ""}
      style={{
        position: fill ? "absolute" : "relative",
        inset: fill ? 0 : undefined,
        overflow: "hidden",
      }}
    >
      {/* Masque blush qui glisse vers le haut pour révéler l'image */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "#E8D5CE",
          zIndex: 2,
          transformOrigin: "bottom",
        }}
        initial={{ scaleY: 1 }}
        animate={isInView ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {/* Image avec zoom léger au reveal */}
      <motion.div
        style={{ width: "100%", height: "100%" }}
        initial={{ scale: 1.08 }}
        animate={isInView ? { scale: 1 } : { scale: 1.08 }}
        transition={{
          duration: 1.2,
          delay: delay + 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          className={className}
          style={{ objectFit }}
        />
      </motion.div>
    </div>
  );
}
