import Link from "next/link";

import { brand } from "@/config/brand";
import {
  DEFAULT_LANGUAGE,
  NAVIGATION_ITEMS,
} from "@/domains/navigation/constants";
import { Container } from "@/shared/layout";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinkStyles =
    "font-sans text-[11px] uppercase tracking-[0.16em] text-white/50 transition-colors duration-300 hover:text-brand-gold";

  const socialLinkStyles =
    "flex h-6 w-6 items-center justify-center text-white/45 transition-all duration-500 hover:text-brand-gold hover:drop-shadow-[0_0_8px_rgba(201,163,90,0.45)]";

  return (
    <footer className="relative bg-background text-white">
      {/* Closing line */}
      <div
        aria-hidden="true"
        className="
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-brand-gold/50
          to-transparent
        "
      />

      <Container className="py-20 md:py-24 lg:py-28">
        {/* Main Footer */}
        <div
          className="
            flex
            flex-col
            gap-16
            md:flex-row
            md:items-start
            md:justify-between
            md:gap-12
          "
        >
          {/* Left — Identity & Navigation */}
          <div className="flex flex-col">
            {/* Brand */}
            <Link
              href="/"
              className="
                w-fit
                font-sans
                text-sm
                font-light
                uppercase
                tracking-[0.30em]
                text-white
                transition-opacity
                duration-300
                hover:opacity-70
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

            {/* Navigation */}
            <nav
              aria-label="Footer navigation"
              className="mt-10"
            >
              <ul className="flex flex-col items-start gap-4">
                {NAVIGATION_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={footerLinkStyles}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right — Artist / Social / Language / Legal */}
          <div
            className="
              flex
              flex-col
              md:min-w-[220px]
              md:items-end
              md:text-right
            "
          >
            {/* Artist */}
            <div>
              <p
                className="
                  font-sans
                  text-sm
                  font-light
                  tracking-[0.12em]
                  text-white/80
                "
              >
                Rolando Del Carmen
              </p>

              <p
                className="
                  mt-2
                  font-sans
                  text-xs
                  uppercase
                  tracking-[0.20em]
                  text-white/40
                "
              >
                Costa Rica
              </p>
            </div>

            {/* Social */}
            <nav
              aria-label="Social media"
              className="mt-10"
            >
              <ul className="flex items-center gap-5 md:justify-end">
                {/* Instagram */}
                <li>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className={socialLinkStyles}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-2.388-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.668 2.668 0 1 1 0 5.335 2.668 2.668 0 0 1 0-5.335" />
                    </svg>
                  </a>
                </li>

                {/* Facebook */}
                <li>
                  <a
                    href="#"
                    aria-label="Facebook"
                    className={socialLinkStyles}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.604 0 8.049c0 4.015 2.94 7.347 6.785 7.958V10.24H4.945V8.049h1.84V6.379c0-1.817 1.092-2.822 2.733-2.822.784 0 1.607.14 1.607.14v1.765h-.903c-.9 0-1.18.56-1.18 1.134v1.433h1.99l-.318 2.19h-1.672v5.767C13.06 15.396 16 12.064 16 8.049" />
                    </svg>
                  </a>
                </li>

                {/* YouTube */}
                <li>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className={socialLinkStyles}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.05-.075 1.964l-.007.105-.022.257-.01.102c-.048.524-.12 1.026-.22 1.406a2.01 2.01 0 0 1-1.415 1.42c-1.123.302-5.288.332-6.11.335L8 13.999c-.823-.003-4.987-.033-6.11-.335a2.01 2.01 0 0 1-1.415-1.42c-.101-.38-.172-.882-.22-1.402l-.01-.104-.022-.261-.008-.104c-.065-.914-.073-1.77-.074-1.957v-.075c.001-.194.01-1.05.075-1.964l.007-.105.022-.257.01-.102c.048-.524-.12-1.026-.22-1.406A2.01 2.01 0 0 1 1.916 2.334c1.123-.303 5.288-.333 6.11-.335zM6.5 5.201v5.596L11 8z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Language */}
            <button
              type="button"
              className="
                mt-8
                w-fit
                font-sans
                text-[11px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-white/55
                transition-colors
                duration-300
                hover:text-brand-gold
                md:self-end
              "
            >
              {DEFAULT_LANGUAGE}
            </button>

            {/* Legal */}
            <nav
              aria-label="Legal"
              className="mt-8"
            >
              <ul className="flex items-center gap-6">
                <li>
                  <Link
                    href="/privacy"
                    className="
                      font-sans
                      text-[10px]
                      uppercase
                      tracking-[0.16em]
                      text-white/45
                      transition-colors
                      duration-300
                      hover:text-brand-gold
                    "
                  >
                    Privacy
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms"
                    className="
                      font-sans
                      text-[10px]
                      uppercase
                      tracking-[0.16em]
                      text-white/45
                      transition-colors
                      duration-300
                      hover:text-brand-gold
                    "
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="
            mt-20
            border-t
            border-white/10
            pt-8
            text-center
            md:mt-24
          "
        >
          <p
            className="
              font-sans
              text-[10px]
              uppercase
              tracking-[0.16em]
              text-white/35
            "
          >
            © {currentYear} {brand.name} — {brand.parentBrand}
          </p>

          <p
            className="
              mt-2
              font-sans
              text-[10px]
              normal-case
              tracking-[0.08em]
              text-white/30
            "
          >
            All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}