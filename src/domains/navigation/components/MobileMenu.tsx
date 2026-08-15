"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { brand } from "@/config/brand";
import {
  DEFAULT_LANGUAGE,
  NAVIGATION_ITEMS,
} from "../constants";

import { ParticleField } from "@/shared/ui/particle-field";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  const [activeItem, setActiveItem] =
    useState<string | null>(null);

  const activeItemRef =
    useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setActiveItem(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="mobile-navigation"
      className="
        fixed
        inset-0
        z-[60]
        overflow-hidden
        bg-[#080808]
        text-white/80
      "
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Particle atmosphere */}
      <ParticleField
        targetRef={activeItemRef}
        active={Boolean(activeItem)}
        particleCount={65}
      />

      <div className="relative z-10 flex flex-1 min-h-full flex-col">
        {/* Header */}
        <div className="flex h-[72px] items-center justify-between px-6">
          <Link
            href="/"
            onClick={onClose}
            className="
              text-sm
              font-light
              uppercase
              tracking-[0.30em]
              text-white
            "
          >
            <span>{brand.name}</span>

            <span
              className="
                block
                text-[10px]
                tracking-[0.28em]
                text-brand-gold
              "
            >
              by {brand.parentBrand}
            </span>
          </Link>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-2xl
              font-light
              text-[#2F2E2C]
              transition-opacity
              duration-300
              hover:opacity-60
            "
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 items-center px-8">
          <ul className="w-full space-y-7">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive =
                activeItem === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    ref={(element) => {
                      if (
                        isActive
                      ) {
                        activeItemRef.current =
                          element;
                      }
                    }}
                    onPointerEnter={() => {
                      activeItemRef.current =
                        document.querySelector(
                          `[data-navigation-item="${item.href}"]`,
                        ) as HTMLAnchorElement | null;

                      setActiveItem(
                        item.href,
                      );
                    }}
                    onPointerLeave={() => {
                      setActiveItem(null);
                    }}
                    onFocus={() => {
                      activeItemRef.current =
                        document.querySelector(
                          `[data-navigation-item="${item.href}"]`,
                        ) as HTMLAnchorElement | null;

                      setActiveItem(
                        item.href,
                      );
                    }}
                    onBlur={() => {
                      setActiveItem(null);
                    }}
                    data-navigation-item={
                      item.href
                    }
                    className={[
                      "relative  z-10 block w-fit rounded-sm px-4 py-2 font-serif text-3xl font-light tracking-wide transition-all duration-500",
                      isActive
                        ? "bg-black text-brand-gold"
                        : "bg-transparent text-white/85",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-8 pb-10">
          <button
            type="button"
            className="
              text-xs
              uppercase
              tracking-[0.18em]
              text-brand-gold
              transition-opacity
              duration-300
              hover:opacity-60
            "
          >
            {DEFAULT_LANGUAGE}
          </button>
        </div>
      </div>
    </div>
  );
}