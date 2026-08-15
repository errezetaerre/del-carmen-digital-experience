"use client";

import { useRef } from "react";
import gsap from "gsap";

interface CollectionArtworkFrameProps {
  children: React.ReactNode;
}

export default function CollectionArtworkFrame({
  children,
}: CollectionArtworkFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const normalRef = useRef<SVGGElement>(null);
  const hoverRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGGElement>(null);

  const animateIn = () => {
    if (!normalRef.current || !hoverRef.current || !glowRef.current) {
      return;
    }

    gsap.killTweensOf([
      normalRef.current,
      hoverRef.current,
      glowRef.current,
    ]);

    gsap.to(normalRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.inOut",
    });

    gsap.to(hoverRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
    });

    gsap.fromTo(
      glowRef.current,
      {
        opacity: 0,
        scale: 0.985,
      },
      {
        opacity: 0.7,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
      },
    );
  };

  const animateOut = () => {
    if (!normalRef.current || !hoverRef.current || !glowRef.current) {
      return;
    }

    gsap.killTweensOf([
      normalRef.current,
      hoverRef.current,
      glowRef.current,
    ]);

    gsap.to(hoverRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });

    gsap.to(normalRef.current, {
      opacity: 1,
      duration: 0.9,
      ease: "power2.inOut",
    });

    gsap.to(glowRef.current, {
      opacity: 0,
      scale: 0.985,
      duration: 0.6,
      ease: "power2.in",
    });
  };

  return (
    <div
      ref={frameRef}
      className="group relative"
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      {children}

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-8px] h-[calc(100%+16px)] w-[calc(100%+16px)] overflow-visible"
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Normal state: solid at top → transparent at bottom */}
          <linearGradient
  id="collection-left-normal"
  x1="0"
  y1="0"
  x2="0"
  y2="125"
  gradientUnits="userSpaceOnUse"
>
  <stop offset="0%" stopColor="#b5a48e" stopOpacity="0.95" />
  <stop offset="35%" stopColor="#b5a48e" stopOpacity="0.55" />
  <stop offset="70%" stopColor="#b5a48e" stopOpacity="0.18" />
  <stop offset="100%" stopColor="#b5a48e" stopOpacity="0" />
</linearGradient>

<linearGradient
  id="collection-right-normal"
  x1="0"
  y1="0"
  x2="0"
  y2="125"
  gradientUnits="userSpaceOnUse"
>
  <stop offset="0%" stopColor="#b5a48e" stopOpacity="0.95" />
  <stop offset="35%" stopColor="#b5a48e" stopOpacity="0.55" />
  <stop offset="70%" stopColor="#b5a48e" stopOpacity="0.18" />
  <stop offset="100%" stopColor="#b5a48e" stopOpacity="0" />
</linearGradient>

<linearGradient
  id="collection-left-hover"
  x1="0"
  y1="0"
  x2="0"
  y2="125"
  gradientUnits="userSpaceOnUse"
>
  <stop offset="0%" stopColor="#b5a48e" stopOpacity="0" />
  <stop offset="30%" stopColor="#b5a48e" stopOpacity="0.18" />
  <stop offset="65%" stopColor="#b5a48e" stopOpacity="0.55" />
  <stop offset="100%" stopColor="#b5a48e" stopOpacity="0.95" />
</linearGradient>

<linearGradient
  id="collection-right-hover"
  x1="0"
  y1="0"
  x2="0"
  y2="125"
  gradientUnits="userSpaceOnUse"
>
  <stop offset="0%" stopColor="#b5a48e" stopOpacity="0" />
  <stop offset="30%" stopColor="#b5a48e" stopOpacity="0.18" />
  <stop offset="65%" stopColor="#b5a48e" stopOpacity="0.55" />
  <stop offset="100%" stopColor="#b5a48e" stopOpacity="0.95" />
</linearGradient>

          <filter
            id="collection-frame-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="1.2" result="blur" />
          </filter>
        </defs>

        {/* NORMAL */}
        <g ref={normalRef} opacity="1">
          {/* Top */}
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="0"
            stroke="#b5a48e"
            strokeWidth="0.45"
            vectorEffect="non-scaling-stroke"
          />

          {/* Left */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="125"
            stroke="url(#collection-left-normal)"
            strokeWidth="0.45"
            vectorEffect="non-scaling-stroke"
          />

          {/* Right */}
          <line
            x1="100"
            y1="0"
            x2="100"
            y2="125"
            stroke="url(#collection-right-normal)"
            strokeWidth="0.45"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* HOVER */}
        <g ref={hoverRef} opacity="0">
          {/* Left */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="125"
            stroke="url(#collection-left-hover)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Right */}
          <line
            x1="100"
            y1="0"
            x2="100"
            y2="125"
            stroke="url(#collection-right-hover)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Bottom */}
          <line
            x1="0"
            y1="125"
            x2="100"
            y2="125"
            stroke="#b5a48e"
            strokeWidth="0.25"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Very subtle atmospheric glow */}
        <g
          ref={glowRef}
          opacity="0"
          filter="url(#collection-frame-glow)"
        >
          <line
            x1="0"
            y1="125"
            x2="100"
            y2="125"
            stroke="#b5a48e"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}