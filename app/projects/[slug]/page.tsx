import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Footer } from "@/components/contact/Footer";
import { GitHubIcon } from "@/components/contact/BrandIcons";
import { pad2 } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.headline} ${project.description}`,
  };
}

function Block({ index, title, id, children }: { index: string; title: string; id?: string; children: React.ReactNode }) {
  return (
    <ScrollReveal as="section" id={id} className="grid scroll-mt-20 gap-6 border-t hairline py-14 md:grid-cols-12 md:gap-10">
      <h2 data-reveal className="label md:col-span-4">
        <span className="text-signal">{index}</span> · {title}
      </h2>
      <div data-reveal className="md:col-span-8">
        {children}
      </div>
    </ScrollReveal>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = projects.indexOf(project);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  let section = 0;
  const idx = () => pad2(++section);

  return (
    <>
      <main id="main">
        <div id="top" className="container-x pb-10 pt-28 sm:pt-36">
          <Link href="/#work" className="label inline-flex items-center gap-2 transition-colors hover:text-paper">
            <ArrowLeft className="size-3.5" /> All work
          </Link>

          <ScrollReveal className="mt-12">
            <p data-reveal className="label">
              <span className="text-signal">{pad2(i + 1)}</span> / {pad2(projects.length)} · {project.category}
            </p>
            <h1
              data-reveal
              className="mt-6 text-[clamp(3rem,9vw,8rem)] font-medium leading-[0.9] tracking-[-0.05em]"
            >
              {project.title}
            </h1>
            <p data-reveal className="mt-6 max-w-3xl text-[clamp(1.25rem,2.4vw,2rem)] leading-snug tracking-tight text-paper/90">
              {project.headline}
            </p>
          </ScrollReveal>

          <dl className="mt-14 grid gap-px overflow-hidden rounded-sm border hairline bg-paper/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Role", project.role],
              ["Period", project.period],
              ["Context", project.context],
              ["Focus", project.focus.join(", ")],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink p-5">
                <dt className="label">{k}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="container-x">
          <div className="viewfinder relative aspect-[4/3] overflow-hidden rounded-md border hairline sm:aspect-[16/9]">
            <ProjectVisual project={project} mode="card" />
          </div>
        </div>

        <div className="container-x mt-20">
          <Block index={idx()} title="Overview">
            <div className="max-w-2xl space-y-5">
              <p className="text-lg leading-relaxed text-paper/90">{project.description}</p>
              {project.overview.map((p) => (
                <p key={p.slice(0, 20)} className="text-[16px] leading-relaxed text-mist">
                  {p}
                </p>
              ))}
            </div>
          </Block>

          <Block index={idx()} title="What I worked on">
            <ul className="max-w-2xl space-y-4">
              {project.contributions.map((c) => (
                <li key={c} className="flex gap-4 text-[16px] leading-relaxed text-mist">
                  <span className="mt-[0.7em] h-px w-4 shrink-0 bg-signal" />
                  {c}
                </li>
              ))}
            </ul>
          </Block>

          <Block index={idx()} title={project.system.title}>
            <ol className="grid gap-px overflow-hidden rounded-sm border hairline bg-paper/[0.07] sm:grid-cols-2">
              {project.system.steps.map((s, k) => (
                <li key={s.label} className="bg-ink p-5">
                  <p className="font-mono text-[11px] text-signal">{pad2(k + 1)}</p>
                  <p className="mt-2 font-medium">{s.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-mist">{s.detail}</p>
                </li>
              ))}
            </ol>
          </Block>

          {project.metrics && project.metrics.length > 0 && (
            <Block index={idx()} title="Results">
              <dl className="flex flex-wrap gap-10">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="label">{m.label}</dt>
                    <dd className="mt-1 text-3xl font-medium tracking-tight">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          )}

          {project.films && project.films.length > 0 && (
            <Block index={idx()} title="Film" id="film">
              <div className="space-y-8">
                {project.films.map((f) => (
                  <figure key={f.src}>
                    <video
                      src={f.src}
                      poster={f.poster}
                      controls
                      playsInline
                      preload="none"
                      className="w-full rounded-sm border hairline bg-coal"
                      style={{ aspectRatio: String(f.aspect), maxHeight: "80svh", objectFit: "contain" }}
                    />
                    <figcaption className="label mt-3">{f.title}</figcaption>
                  </figure>
                ))}
              </div>
            </Block>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <Block index={idx()} title="Gallery">
              <div className="grid gap-4 sm:grid-cols-2">
                {project.gallery.map((g) => (
                  <figure key={g.src}>
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={g.width}
                      height={g.height}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="aspect-[4/5] w-full rounded-sm object-cover"
                    />
                    {g.caption && <figcaption className="label mt-3">{g.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </Block>
          )}

          <Block index={idx()} title="Stack & tools">
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="rounded-full border hairline px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-mist">
                  {s}
                </li>
              ))}
            </ul>
          </Block>

          {project.nextSteps && (
            <Block index={idx()} title="Next steps">
              <ul className="max-w-2xl space-y-3">
                {project.nextSteps.map((s) => (
                  <li key={s} className="flex gap-4 text-[16px] text-mist">
                    <ArrowRight className="mt-1 size-4 shrink-0 text-ember" />
                    {s}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block index={idx()} title="Status">
            <p className="max-w-2xl text-[16px] leading-relaxed text-mist">{project.status}</p>
            {project.team && <p className="mt-4 text-sm text-paper/80">{project.team}</p>}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-paper hover:text-signal"
              >
                <GitHubIcon className="size-4" /> View repository <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </Block>
        </div>

        <nav aria-label="More projects" className="mt-16 border-t hairline">
          <div className="container-x grid sm:grid-cols-2">
            <Link href={`/projects/${prev.slug}`} className="group border-b hairline py-10 sm:border-b-0 sm:border-r sm:pr-8">
              <span className="label inline-flex items-center gap-2">
                <ArrowLeft className="size-3.5" /> Previous
              </span>
              <span className="mt-3 block text-3xl font-medium tracking-tight transition-colors group-hover:text-signal">
                {prev.title}
              </span>
            </Link>
            <Link href={`/projects/${next.slug}`} className="group py-10 text-right sm:pl-8">
              <span className="label inline-flex items-center gap-2">
                Next <ArrowRight className="size-3.5" />
              </span>
              <span className="mt-3 block text-3xl font-medium tracking-tight transition-colors group-hover:text-signal">
                {next.title}
              </span>
            </Link>
          </div>
        </nav>
      </main>
      <Footer />
    </>
  );
}
