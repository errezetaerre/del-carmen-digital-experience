"use client";

import Link from "next/link";
import { useState } from "react";

import { useNavigationScroll } from "../hooks";
import { Container } from "@/shared/layout";
import { brand } from "@/config/brand";
import {
  DEFAULT_LANGUAGE,
  NAVIGATION_ITEMS,
} from "../constants";
import MobileMenu from "./MobileMenu";

export default function Navigation() {
  const isScrolled = useNavigationScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerState = isScrolled
    ? "bg-foreground/90 backdrop-blur-md shadow-sm"
    : "bg-transparent";

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          headerState,
        ].join(" ")}
      >
        <Container className="flex h-[52px] items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className={[
              "text-sm font-light uppercase tracking-[0.30em] transition-opacity duration-300 hover:opacity-80",
              isScrolled
                ? "text-brand-gold/100"
                : "text-white",
            ].join(" ")}
          >
            <span>{brand.name}</span>

            <span className="block text-[10px] tracking-[0.28em] text-brand-gold">
              by {brand.parentBrand}
            </span>
          </Link>

          {/* Desktop / Tablet Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-12">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "text-xs uppercase tracking-[0.12em] transition-colors duration-300",
                      isScrolled
                        ? "text-brand-gold/90 hover:text-background"
                        : "text-white/65 hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop / Tablet Language */}
          <button
            type="button"
            className={[
              "hidden text-xs uppercase tracking-[0.12em] transition-colors duration-300 md:block",
              isScrolled
                ? "text-brand-gold/90 hover:text-background"
                : "text-white/65 hover:text-white",
            ].join(" ")}
          >
            {DEFAULT_LANGUAGE}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className={[
              "flex h-10 w-10 items-center justify-center md:hidden",
              isScrolled
                ? "text-[#2F2E2C]"
                : "text-white",
            ].join(" ")}
          >
            <span className="sr-only">Open menu</span>

            <span className="flex w-5 flex-col gap-[5px]">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
            </span>
          </button>
        </Container>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}