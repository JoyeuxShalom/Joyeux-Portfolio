"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react";
import { site } from "@/config/site";
import { projects } from "@/data/projects";
import { ScrollReveal, SectionLabel } from "@/components/ui/ScrollReveal";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";

/** Only links that are actually configured are shown. */
function getLinks() {
  const candidates: { href: string; label: string; Icon: typeof GitHubIcon }[] = [
    { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: site.links.github, label: "GitHub", Icon: GitHubIcon },
  ];
  const social = candidates.filter((l) => l.href);
  const repos = projects.filter((p) => p.repo).map((p) => ({ href: p.repo!, label: `${p.title} repository` }));
  return { social, repos };
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setCopied(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setCopied(false), 2000);
        } catch {
          window.location.href = `mailto:${site.email}`;
        }
      }}
      className="grid size-12 shrink-0 place-items-center rounded-full border hairline text-mist transition-colors hover:border-paper/40 hover:text-paper"
      aria-label={copied ? "Email address copied" : "Copy email address"}
    >
      {copied ? <Check className="size-4 text-signal" /> : <Copy className="size-4" />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

export function ContactSection() {
  const { social, repos } = getLinks();

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t hairline py-28 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--signal)_7%,transparent),transparent_55%)]"
      />
      <div className="container-x relative">
        <SectionLabel index="06">Contact</SectionLabel>
        <ScrollReveal>
          <h2
            id="contact-title"
            data-reveal
            className="mt-8 max-w-[15ch] text-[clamp(2.5rem,6.6vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.045em]"
          >
            Have a meaningful problem to solve? <span className="text-signal">Let&apos;s talk.</span>
          </h2>

          <div data-reveal className="mt-14 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-paper pl-5 pr-6 text-[14px] font-medium text-ink transition-colors hover:bg-signal"
            >
              <Mail className="size-4" />
              {site.email}
            </a>
            <CopyEmail />
            {site.cv && (
              <a
                href={site.cv}
                download
                className="inline-flex h-12 items-center gap-2 rounded-full border hairline px-6 text-[13px] tracking-[0.06em] text-paper transition-colors hover:border-paper/40"
              >
                <Download className="size-4" />
                DOWNLOAD CV
              </a>
            )}
          </div>

          {(social.length > 0 || repos.length > 0) && (
            <ul data-reveal className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {social.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[15px] text-mist transition-colors hover:text-paper"
                  >
                    <Icon className="size-4" />
                    {label}
                    <ArrowUpRight className="size-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
              {repos.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[15px] text-mist transition-colors hover:text-paper"
                  >
                    <GitHubIcon className="size-4" />
                    {label}
                    <ArrowUpRight className="size-3.5 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p data-reveal className="label mt-16">
            Based in {site.location} · Open to engineering roles, research, and collaborations
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
