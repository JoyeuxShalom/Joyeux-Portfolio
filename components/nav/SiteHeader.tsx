"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#leadership", label: "Leadership" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || open
          ? "border-b hairline bg-ink/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={`${site.name}, home`}
          onClick={() => setOpen(false)}
        >
          <span className="relative grid size-7 place-items-center rounded-full border hairline">
            <span className="size-1.5 rounded-full bg-signal shadow-[0_0_12px_var(--color-signal)]" />
          </span>
          <span className="text-sm font-medium tracking-tight text-paper">
            Joyeux Shalom
            <span className="ml-2 hidden font-mono text-[11px] tracking-[0.14em] text-mist sm:inline">
              / ENGINEER
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-4 py-2 text-[13px] text-mist transition-colors hover:text-paper"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="ml-2">
              <ThemeToggle />
            </li>
            <li className="ml-2">
              <a
                href={`mailto:${site.email}`}
                className="rounded-full border hairline px-4 py-2 text-[13px] text-paper transition-colors hover:border-signal/60 hover:text-signal"
              >
                Get in touch
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="relative grid size-10 place-items-center rounded-full border hairline"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={cn(
                "absolute h-px w-4 bg-paper transition-transform duration-300",
                open ? "rotate-45" : "-translate-y-[3px]",
              )}
            />
            <span
              className={cn(
                "absolute h-px w-4 bg-paper transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-[3px]",
              )}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100svh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden"
          >
            <ul className="container-x flex flex-col gap-1 pt-8">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b hairline py-5 text-3xl font-medium tracking-tight"
                  >
                    {item.label}
                    <span className="label">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
