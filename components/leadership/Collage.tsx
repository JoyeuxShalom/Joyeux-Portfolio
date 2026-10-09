import Image from "next/image";
import type { LeadershipEntry } from "@/data/leadership";
import { InViewVideo } from "@/components/media/InViewVideo";
import { cn } from "@/lib/utils";

function Photo({
  src,
  alt,
  caption,
  width,
  height,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  className?: string;
  sizes: string;
}) {
  return (
    <figure className={cn("group relative overflow-hidden rounded-sm bg-coal", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className="size-full object-cover grayscale-[35%] transition-[transform,filter] duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.03] group-hover:grayscale-0"
      />
      {caption && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-3 pt-10 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/85">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Arranges an entry's photos (and optional short loop) into a clean editorial
 * collage. Layout adapts to how many items there are: 1, 2, or 3.
 */
export function Collage({ entry }: { entry: LeadershipEntry }) {
  const media = entry.media ?? [];
  const loop = entry.loop;

  if (media.length === 1 && !loop) {
    const m = media[0];
    const landscape = m.width > m.height;
    return (
      <Photo
        {...m}
        sizes="(min-width: 1024px) 55vw, 100vw"
        className={cn(landscape ? "aspect-[16/10]" : "mx-auto aspect-[4/5] max-w-md lg:mx-0")}
      />
    );
  }

  if (media.length === 2 && !loop) {
    const [a, b] = media;
    const aLand = a.width > a.height;
    const bLand = b.width > b.height;
    // Mixed orientations: portrait narrow, landscape wide, each at its own ratio.
    if (aLand !== bLand) {
      return (
        <div className="grid grid-cols-12 items-end gap-3 sm:gap-4">
          {[a, b].map((m) => {
            const land = m.width > m.height;
            return (
              <Photo
                key={m.src}
                {...m}
                sizes={land ? "(min-width: 1024px) 34vw, 60vw" : "(min-width: 1024px) 22vw, 40vw"}
                className={land ? "col-span-7 aspect-[4/3]" : "col-span-5 aspect-[3/4]"}
              />
            );
          })}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-12 gap-3 sm:gap-4">
        <Photo {...a} sizes="(min-width: 1024px) 32vw, 58vw" className="col-span-7 aspect-[3/4]" />
        <Photo {...b} sizes="(min-width: 1024px) 24vw, 42vw" className="col-span-5 mt-12 aspect-[3/4] sm:mt-20" />
      </div>
    );
  }

  // Three or more items: tall lead image, the rest (loop and photos) stacked beside it.
  const rest = media.slice(1);
  const restAspect = loop ? "aspect-[4/5]" : "aspect-square";
  return (
    <div className="grid grid-cols-12 gap-3 sm:gap-4">
      {media[0] && <Photo {...media[0]} sizes="(min-width: 1024px) 30vw, 55vw" className="col-span-7 aspect-[3/4]" />}
      <div className="col-span-5 flex flex-col gap-3 sm:gap-4">
        {loop && (
          <figure className="relative overflow-hidden rounded-sm">
            <InViewVideo src={loop.src} poster={loop.poster} aspect={loop.width / loop.height} label={loop.caption} />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-3 pt-10 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/85">
              {loop.caption}
            </figcaption>
          </figure>
        )}
        {rest.map((m) => (
          <Photo key={m.src} {...m} sizes="(min-width: 1024px) 20vw, 40vw" className={restAspect} />
        ))}
      </div>
    </div>
  );
}

export { Photo };
