"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type PointerPosition = {
  x: number;
  y: number;
  active: boolean;
};

type ParticleFieldProps = {
  targetRef?: RefObject<HTMLElement | null>;
  pointerRef?: RefObject<PointerPosition>;
  active?: boolean;
  particleCount?: number;
};

type Particle = {
  x: number;
  y: number;

  baseX: number;
  baseY: number;

  targetX: number;
  targetY: number;

  size: number;
  alpha: number;

  color: string;

  phase: number;
  speed: number;

  attraction: number;

  twinkleSpeed: number;
  twinkleAmount: number;
};

const PARTICLE_COLORS = [
  "rgba(218, 178, 92, 0.95)",
  "rgba(235, 235, 230, 0.92)",
  "rgba(201, 164, 92, 0.90)",
  "rgba(250, 245, 225, 0.95)",
];

export default function ParticleField({
  targetRef,
  pointerRef,
  active = false,
  particleCount = 85,
}: ParticleFieldProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const particlesRef =
    useRef<Particle[]>([]);

  const activeRef =
    useRef(active);

  const targetRefInternal = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
      );

      canvas.width =
        window.innerWidth * dpr;

      canvas.height =
        window.innerHeight * dpr;

      canvas.style.width =
        `${window.innerWidth}px`;

      canvas.style.height =
        `${window.innerHeight}px`;

      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );
    };

    const createParticles = () => {
      particlesRef.current =
        Array.from(
          {
            length: particleCount,
          },
          (_, index) => {
            const x =
              Math.random() *
              window.innerWidth;

            const y =
              Math.random() *
              window.innerHeight;

            return {
              x,
              y,

              baseX: x,
              baseY: y,

              targetX: x,
              targetY: y,

              size:
                Math.random() * 2.2 +
                0.8,

              alpha:
                Math.random() * 0.35 +
                0.55,

              color:
                PARTICLE_COLORS[
                index %
                PARTICLE_COLORS.length
                ],

              phase:
                Math.random() *
                Math.PI *
                2,

              speed:
                Math.random() *
                0.0007 +
                0.00035,

              attraction:
                Math.random() *
                0.035 +
                0.025,

              twinkleSpeed:
                Math.random() *
                0.004 +
                0.0015,

              twinkleAmount:
                Math.random() *
                0.45 +
                0.25,
            };
          },
        );
    };

    const updateTarget = () => {
      if (!targetRef?.current) {
        return;
      }

      const rect =
        targetRef.current.getBoundingClientRect();

      const padding = 12;

      targetRefInternal.current = {
        x: rect.left - padding,
        y: rect.top - padding,
        width:
          rect.width +
          padding * 2,
        height:
          rect.height +
          padding * 2,
      };
    };

    const getPerimeterPoint = (
      particle: Particle,
      index: number,
    ) => {
      const target =
        targetRefInternal.current;

      const perimeter =
        target.width * 2 +
        target.height * 2;

      if (!perimeter) {
        return {
          x: particle.baseX,
          y: particle.baseY,
        };
      }

      /*
       * Stable golden-ratio distribution
       * around the selected navigation item.
       */
      const normalized =
        ((index * 0.61803398875) %
          1 +
          1) %
        1;

      const position =
        normalized * perimeter;

      if (
        position <
        target.width
      ) {
        return {
          x:
            target.x +
            position,

          y:
            target.y,
        };
      }

      if (
        position <
        target.width +
        target.height
      ) {
        return {
          x:
            target.x +
            target.width,

          y:
            target.y +
            (position -
              target.width),
        };
      }

      if (
        position <
        target.width * 2 +
        target.height
      ) {
        return {
          x:
            target.x +
            target.width -
            (
              position -
              target.width -
              target.height
            ),

          y:
            target.y +
            target.height,
        };
      }

      return {
        x:
          target.x,

        y:
          target.y +
          target.height -
          (
            position -
            target.width * 2 -
            target.height
          ),
      };
    };

    const getPointerPoint = (
      index: number,
    ) => {
      const pointer =
        pointerRef?.current;

      if (!pointer) {
        return null;
      }

      /*
       * Golden-angle distribution creates
       * a soft particle halo around the finger.
       */
      const angle =
        index *
        2.399963229728653;

      const ring =
        22 +
        (index % 5) * 8;

      return {
        x:
          pointer.x +
          Math.cos(angle) *
          ring,

        y:
          pointer.y +
          Math.sin(angle) *
          ring,
      };
    };

    const animate = (
      time: number,
    ) => {
      context.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight,
      );

      updateTarget();

      const isActive =
        activeRef.current;

      const isFollowingPointer =
        Boolean(
          pointerRef?.current
            ?.active,
        );

      particlesRef.current.forEach(
        (particle, index) => {
          /*
           * Ambient floating movement.
           */
          const driftX =
            Math.sin(
              time *
              particle.speed +
              particle.phase,
            ) * 10;

          const driftY =
            Math.cos(
              time *
              particle.speed *
              0.8 +
              particle.phase,
            ) * 10;

          /*
           * Priority:
           *
           * 1. Selected navigation item
           * 2. Finger / pointer
           * 3. Ambient floating state
           */
          if (isActive) {
            const perimeter =
              getPerimeterPoint(
                particle,
                index,
              );

            particle.targetX =
              perimeter.x;

            particle.targetY =
              perimeter.y;
          } else if (
            isFollowingPointer
          ) {
            const pointerPoint =
              getPointerPoint(
                index,
              );

            if (pointerPoint) {
              particle.targetX =
                pointerPoint.x;

              particle.targetY =
                pointerPoint.y;
            }
          } else {
            particle.targetX =
              particle.baseX +
              driftX;

            particle.targetY =
              particle.baseY +
              driftY;
          }

          /*
           * Attraction strength changes
           * according to interaction state.
           */
          const attraction =
            isActive
              ? particle.attraction
              : isFollowingPointer
                ? 0.055
                : 0.008;

          particle.x +=
            (
              particle.targetX -
              particle.x
            ) * attraction;

          particle.y +=
            (
              particle.targetY -
              particle.y
            ) * attraction;

          /*
           * Gentle breathing.
           */
          const twinkle =
            0.72 +
            Math.sin(
              time *
              particle.twinkleSpeed +
              particle.phase,
            ) *
            particle.twinkleAmount;

          /*
           * Gentle shimmer.
           */
          const shimmer =
            0.9 +
            Math.sin(
              time *
              particle.twinkleSpeed *
              0.37 +
              particle.phase *
              1.7,
            ) *
            0.1;

          const intensity =
            Math.max(
              0.28,
              twinkle *
              shimmer,
            );

          /*
           * Glow.
           */
          context.save();

          context.shadowBlur =
            isActive
              ? 20
              : isFollowingPointer
                ? 17
                : 14;

          context.shadowColor =
            particle.color;

          context.beginPath();

          context.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2,
          );

          context.fillStyle =
            particle.color.replace(
              /[\d.]+\)$/,
              `${intensity})`,
            );

          context.fill();

          /*
           * Small luminous core for
           * larger particles.
           */
          if (
            particle.size >
            1.8
          ) {
            context.save();

            context.shadowBlur =
              18;

            context.shadowColor =
              "rgba(255, 248, 225, 0.9)";

            context.beginPath();

            context.arc(
              particle.x,
              particle.y,
              particle.size *
              0.32,
              0,
              Math.PI * 2,
            );

            context.fillStyle =
              "rgba(255, 250, 235, 0.9)";

            context.fill();

            context.restore();
          }

          context.restore();
        },
      );

      animationRef.current =
        requestAnimationFrame(
          animate,
        );
    };

    resize();
    createParticles();

    window.addEventListener(
      "resize",
      resize,
    );

    animationRef.current =
      requestAnimationFrame(
        animate,
      );

    return () => {
      window.removeEventListener(
        "resize",
        resize,
      );

      if (
        animationRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationRef.current,
        );
      }
    };
  }, [
    particleCount,
    targetRef,
    pointerRef,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-0
        z-0
        h-full
        w-full
      "
    />
  );
}