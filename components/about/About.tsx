import Image from "next/image";
import { bio, capabilities, experience, languages, recognition } from "@/data/about";
import { ScrollReveal, SectionLabel } from "@/components/ui/ScrollReveal";
import { pad2 } from "@/lib/utils";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative border-t hairline bg-coal/40 py-28 sm:py-40">
      <div className="container-x">
        <SectionLabel index="04">The person behind the engineering</SectionLabel>

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <ScrollReveal className="lg:col-span-5">
            <figure data-reveal className="viewfinder relative mx-auto max-w-md overflow-hidden rounded-sm lg:sticky lg:top-24 lg:mx-0">
              <Image
                src="/images/portrait-studio.jpg"
                alt="Portrait of Joyeux Shalom Uwoyatoranije in a navy suit, seated against a dark background"
                width={1600}
                height={2000}
                sizes="(min-width: 1024px) 36vw, (min-width: 640px) 28rem, 100vw"
                className="aspect-[4/5] size-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/90 to-transparent p-4 pt-14">
                <span className="label text-paper/80">Joyeux Shalom</span>
                <span className="label">Kigali, Rwanda</span>
              </figcaption>
            </figure>
          </ScrollReveal>

          <div className="lg:col-span-7">
            <ScrollReveal>
              <h2
                id="about-title"
                data-reveal
                className="text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.035em]"
              >
                From learning to code with no experience, to leading the systems I build.
              </h2>
              <div className="mt-10 space-y-5">
                {bio.map((p) => (
                  <p key={p.slice(0, 24)} data-reveal className="text-[17px] leading-relaxed text-mist">
                    {p}
                  </p>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal as="ul" className="mt-16 grid gap-px overflow-hidden rounded-sm border hairline bg-paper/[0.07] sm:grid-cols-2">
              {capabilities.map((c, i) => (
                <li key={c.title} data-reveal className="bg-ink p-6">
                  <p className="font-mono text-[11px] text-signal">{pad2(i + 1)}</p>
                  <h3 className="mt-3 text-lg font-medium tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{c.detail}</p>
                  <p className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-paper/55">
                    {c.tools.join(" · ")}
                  </p>
                </li>
              ))}
            </ScrollReveal>

            <div className="mt-16 grid gap-12 sm:grid-cols-2">
              <ScrollReveal>
                <h3 data-reveal className="label">
                  Security & systems experience
                </h3>
                <ul className="mt-5 space-y-5">
                  {experience.map((e) => (
                    <li key={e.role} data-reveal>
                      <p className="text-[15px] text-paper">{e.role}</p>
                      <p className="text-sm text-mist">
                        {e.org} · {e.period}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-mist/80">{e.detail}</p>
                    </li>
                  ))}
                </ul>
                <h3 data-reveal className="label mt-10">
                  Languages
                </h3>
                <p data-reveal className="mt-3 text-sm text-mist">
                  {languages.join(" · ")}
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <h3 data-reveal className="label">
                  Recognition & programs
                </h3>
                <ul className="mt-5 divide-y divide-paper/[0.07]">
                  {recognition.map((r) => (
                    <li key={r.title} data-reveal className="flex items-baseline justify-between gap-4 py-3">
                      <span>
                        <span className="block text-sm text-paper">{r.title}</span>
                        <span className="block text-xs text-mist">{r.issuer}</span>
                      </span>
                      <span className="font-mono text-[11px] text-mist">{r.year}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
