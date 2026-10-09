import { projects } from "@/data/projects";
import { Hero } from "@/components/hero/Hero";
import { Philosophy } from "@/components/philosophy/Philosophy";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { LeadershipTimeline } from "@/components/leadership/LeadershipTimeline";
import { About } from "@/components/about/About";
import { FutureDirection } from "@/components/future/FutureDirection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/contact/Footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Philosophy />
        <ProjectShowcase projects={projects} />
        <LeadershipTimeline />
        <About />
        <FutureDirection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
