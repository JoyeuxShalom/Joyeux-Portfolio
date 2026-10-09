import { leadership, moments, type LeadershipEntry } from "@/data/leadership";
import { ScrollReveal, SectionLabel } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { Collage, Photo } from "./Collage";

function EntryText({ entry }: { entry: LeadershipEntry }) {
  return (
    <>
      <p data-reveal className="label">
        {entry.period}
      </p>
      <h3 data-reveal className="mt-4 text-3xl font-medium leading-none tracking-[-0.03em] sm:text-4xl">
        {entry.org}
      </h3>
      <p data-reveal className="mt-3 text-[15px] text-paper/85">
        {entry.role}
      </p>
      <p data-reveal className="mt-5 max-w-md text-[15px] leading-relaxed text-mist">
        {entry.summary}
      </p>
      {entry.note && (
        <p data-reveal className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ember">
          <span className="size-1 rounded-full bg-ember" />
          {entry.note}
        </p>
      )}
      {entry.stats && entry.stats.length > 0 && (
        <dl data-reveal className="mt-6 flex gap-8">
          {entry.stats.map((s) => (
            <div key={s.label}>
              <dt className="label">{s.label}</dt>
              <dd className="mt-1 text-2xl font-medium tracking-tight">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}

/** Group consecutive compact entries so they can share a row. */
function groupEntries(entries: LeadershipEntry[]) {
  const groups: LeadershipEntry[][] = [];
  for (const e of entries) {
    const last = groups[groups.length - 1];
    if (e.layout === "compact" && last?.[0].layout === "compact") last.push(e);
    else groups.push([e]);
  }
  return groups;
}

export function LeadershipTimeline() {
  const groups = groupEntries(leadership);
  let featureCount = 0;

  return (
    <section id="leadership" aria-labelledby="leadership-title" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionLabel index="03">Technology is also people</SectionLabel>
        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            id="leadership-title"
            className="text-[clamp(2.25rem,5.4vw,5rem)] font-medium leading-[1] tracking-[-0.04em] lg:col-span-8"
          >
            Building technology.
            <br />
            <span className="text-mist">Creating opportunities.</span>
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-mist lg:col-span-4">
            Alongside engineering, I spend much of my time building rooms where young people can test ideas, find
            collaborators, and lead.
          </p>
        </div>

        <div className="mt-20 border-t hairline sm:mt-28">
          {groups.map((group) => {
            if (group[0].layout === "compact") {
              return (
                <div key={group.map((g) => g.id).join("-")} className="grid border-b hairline md:grid-cols-2">
                  {group.map((entry, i) => (
                    <ScrollReveal
                      key={entry.id}
                      as="article"
                      className={cn("py-14 sm:py-16", i > 0 && "border-t hairline md:border-l md:border-t-0 md:pl-10")}
                    >
                      <EntryText entry={entry} />
                    </ScrollReveal>
                  ))}
                </div>
              );
            }
            const entry = group[0];
            const flip = featureCount++ % 2 === 1;
            return (
              <ScrollReveal
                key={entry.id}
                as="article"
                className="grid gap-10 border-b hairline py-16 sm:py-24 lg:grid-cols-12 lg:gap-16"
              >
                <div className={cn("lg:col-span-5 lg:self-center", flip && "lg:order-2")}>
                  <EntryText entry={entry} />
                </div>
                <div data-reveal className={cn("lg:col-span-7", flip && "lg:order-1")}>
                  <Collage entry={entry} />
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Rooms I've learned in */}
        <div className="mt-28 sm:mt-36">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">Rooms I&apos;ve learned in</h3>
            <p className="label">Programs · Summits · Communities</p>
          </div>
          <ScrollReveal className="mt-10 grid grid-flow-dense auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
            {moments.map((m) => (
              <div
                key={m.src}
                data-reveal
                className={cn(
                  m.span === "tall" && "row-span-2",
                  m.span === "wide" && "col-span-2",
                )}
              >
                <Photo
                  src={m.src}
                  alt={m.alt}
                  width={m.width}
                  height={m.height}
                  caption={m.place}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="size-full"
                />
              </div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
