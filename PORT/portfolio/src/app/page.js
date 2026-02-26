import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import Metrics from "@/components/Metrics";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-950 min-h-screen scroll-smooth">
      <Navbar />
      <Hero />
      <About />
      <Timeline />
      <Skills />
      <Projects />
      <Metrics />
      <Testimonials />
      <Blog />
      <Certifications />
      <Resume />
      <Contact />
      <Footer />
    </main>
  );
}
