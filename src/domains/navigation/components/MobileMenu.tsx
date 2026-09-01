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

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { isNavigationItemActive } from "../utils/isNavigationItemActive";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentNavigationHref =
    pathname === "/artist" ||
      pathname.startsWith("/artist/")
      ? "/about"
      : NAVIGATION_ITEMS.find(
        (item) =>
          pathname === item.href ||
          (
            item.href !== "/" &&
            pathname.startsWith(`${item.href}/`)
          ),
      )?.href ?? null;



  const currentItemRef =
    useRef<HTMLAnchorElement | null>(null);

  const [activeItem, setActiveItem] =
    useState<string | null>(null);

  const activeItemRef =
    useRef<HTMLAnchorElement | null>(null);

  const navigationRef =
    useRef<HTMLElement | null>(null);

  const touchTrackingRef = useRef(false);

  const pointerRef = useRef({
    x: 0,
    y: 0,
    active: false,
  });

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

      activeItemRef.current = null;

      pointerRef.current.active = false;

      touchTrackingRef.current = false;
    }
  }, [isOpen]);

  const getNavigationItemAtPoint = (
    x: number,
    y: number,
  ) => {
    const element =
      document.elementFromPoint(x, y);

    if (!element) {
      return null;
    }

    return element.closest(
      "[data-navigation-item]",
    ) as HTMLAnchorElement | null;
  };

  const updateTouchTarget = (
    x: number,
    y: number,
  ) => {
    pointerRef.current.x = x;
    pointerRef.current.y = y;

    const item =
      getNavigationItemAtPoint(x, y);

    if (!item) {
      activeItemRef.current =
        currentItemRef.current;

      setActiveItem(null);

      return null;
    }

    const href =
      item.dataset.navigationItem ?? null;

    activeItemRef.current = item;
    setActiveItem(href);

    return href;
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    if (
      event.pointerType !== "touch" &&
      event.pointerType !== "pen"
    ) {
      return;
    }

    touchTrackingRef.current = true;

    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
      active: true,
    };

    navigationRef.current?.setPointerCapture(
      event.pointerId,
    );

    updateTouchTarget(
      event.clientX,
      event.clientY,
    );
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    if (!touchTrackingRef.current) {
      return;
    }

    updateTouchTarget(
      event.clientX,
      event.clientY,
    );
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    if (!touchTrackingRef.current) {
      return;
    }

    const href = updateTouchTarget(
      event.clientX,
      event.clientY,
    );

    touchTrackingRef.current = false;
    pointerRef.current.active = false;

    try {
      navigationRef.current?.releasePointerCapture(
        event.pointerId,
      );
    } catch {
      // Pointer may already have been released.
    }

    if (!href) {
      setActiveItem(null);
      activeItemRef.current = null;

      return;
    }

    onClose();
    router.push(href);
  };

  const handlePointerCancel = () => {
    touchTrackingRef.current = false;
    pointerRef.current.active = false;

    setActiveItem(null);

    activeItemRef.current =
      currentItemRef.current;
  };

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
        active={Boolean(activeItem || currentNavigationHref)}
        pointerRef={pointerRef}
        particleCount={65}
      />

      <div className="relative z-10 flex min-h-full flex-1 flex-col">
        {/* Header */}
        <div className="flex h-[72px] shrink-0 items-center justify-between px-6">
          <Link
            href="/"
            onClick={onClose}
            className="
              font-sans
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
              h-11
              w-11
              items-center
              justify-center
              font-sans
              text-[32px]
              font-light
              leading-none
              text-white/55
              transition-all
              duration-300
              hover:text-brand-gold
              focus-visible:text-brand-gold
              focus-visible:outline-none
            "
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav
          ref={navigationRef}
          className="
            flex
            flex-1
            touch-none
            items-center
            px-8

            [@media(orientation:landscape)_and_(max-height:600px)]:py-4
          "
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <ul
            className="
              w-full
              space-y-7

              [@media(orientation:landscape)_and_(max-height:600px)]:space-y-2
            "
          >
            {NAVIGATION_ITEMS.map((item) => {
              const isArtistRoute =
                pathname === "/artist" ||
                pathname.startsWith("/artist/");

              const isCurrentRoute =
                isNavigationItemActive(
                  pathname,
                  item.href,
                );


              const isActive =
                activeItem === item.href;

              const isHighlighted =
                isActive || isCurrentRoute;

              // isActive
              //   ? "bg-black text-brand-gold"
              //   : isCurrentRoute
              //     ? "bg-transparent text-brand-gold"
              //     : "bg-transparent text-white/85",

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      isCurrentRoute ? "page" : undefined
                    }
                    onClick={(event) => {
                      /*
                       * Touch navigation is confirmed
                       * manually on pointer release.
                       */
                      if (
                        touchTrackingRef.current
                      ) {
                        event.preventDefault();
                        return;
                      }

                      onClose();
                    }}
                    ref={(element) => {
                      if (!element) return;

                      if (isCurrentRoute) {
                        currentItemRef.current = element;
                      }

                      if (isActive || (!activeItem && isCurrentRoute)) {
                        activeItemRef.current = element;
                      }
                    }}
                    onPointerEnter={(event) => {
                      if (
                        event.pointerType ===
                        "touch"
                      ) {
                        return;
                      }

                      activeItemRef.current =
                        event.currentTarget;

                      setActiveItem(item.href);
                    }}
                    onPointerLeave={(event) => {
                      if (
                        event.pointerType ===
                        "touch"
                      ) {
                        return;
                      }

                      setActiveItem(null);
                    }}
                    onFocus={(event) => {
                      activeItemRef.current =
                        event.currentTarget;

                      setActiveItem(item.href);
                    }}
                    onBlur={() => {
                      setActiveItem(null);
                    }}
                    data-navigation-item={
                      item.href
                    }
                    className={[
                      `
                        relative
                        z-10
                        block
                        w-fit
                        rounded-sm
                        px-4
                        py-2
                        font-display
                        text-3xl
                        font-light
                        tracking-[0.01em]
                        transition-all
                        duration-500

                        [@media(orientation:landscape)_and_(max-height:600px)]:py-1
                        [@media(orientation:landscape)_and_(max-height:600px)]:text-2xl
                      `,
                      isHighlighted
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
        <div
          className="
            shrink-0
            px-8
            pb-10

            [@media(orientation:landscape)_and_(max-height:600px)]:pb-5
          "
        >
          <button
            type="button"
            className="
              font-sans
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