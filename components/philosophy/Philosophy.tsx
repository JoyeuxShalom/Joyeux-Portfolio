import { ScrollReveal, ScrubWords, SectionLabel } from "@/components/ui/ScrollReveal";
import { IdeaToSystem } from "./IdeaToSystem";

export function Philosophy() {
  return (
    <section id="philosophy" aria-label="Philosophy" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionLabel index="01">Beyond the prototype</SectionLabel>

        <ScrubWords
          text="A working prototype is only the beginning."
          className="mt-8 max-w-[18ch] text-[clamp(2.25rem,5.6vw,5.25rem)] font-medium leading-[1] tracking-[-0.04em]"
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <IdeaToSystem />
          </div>

          <ScrollReveal className="flex flex-col justify-between gap-12 lg:col-span-5">
            <p data-reveal className="text-lg leading-relaxed text-mist sm:text-xl">
              Building a prototype taught me what technology can do. It also showed me what I still need to learn. I
              want to understand the systems beneath the interface, the intelligence behind the prediction, and the
              engineering that makes a product reliable outside a controlled environment.
            </p>

            <figure data-reveal className="border-l border-ember/70 pl-6">
              <blockquote className="text-xl font-medium leading-snug tracking-tight text-paper sm:text-2xl">
                “Getting a prototype to work is one thing. Building a system people can trust is another.”
              </blockquote>
              <figcaption className="label mt-4">Working principle</figcaption>
            </figure>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
