import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container-x flex min-h-[100svh] flex-col justify-center">
      <p className="label">404 · Signal lost</p>
      <h1 className="mt-6 max-w-[16ch] text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
        This page isn&apos;t part of the system.
      </h1>
      <Link href="/" className="mt-10 w-fit border-b border-paper/30 pb-0.5 text-sm tracking-[0.06em] hover:border-signal hover:text-signal">
        RETURN HOME
      </Link>
    </main>
  );
}
